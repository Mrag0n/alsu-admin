import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Upload } from 'antd/lib';
import { PlusOutlined } from '@ant-design/icons/lib';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db } from '@lib/firebase';
import { Document } from '@types/document';
import Table from '@components/Table';

const Projects = () => {
  const [projects, setProjects] = useState<Document[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentProject, setCurrentProject] = useState<Document | null>(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const querySnapshot = await getDocs(collection(db, 'projects'));
    const docsArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Document),
    }));
    setProjects(docsArray);
  };

  const uploadImage = async (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showEditModal = (project: Document) => {
    form.setFieldsValue(project);
    setCurrentProject(project);
    setIsEditModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setIsEditModalVisible(false);
  };

  const handleAdd = async (values: Document) => {
    try {
      if (selectedFile) {
        values.imageUrl = await uploadImage(selectedFile);
      }
      await addDoc(collection(db, 'projects'), values);
      message.success('Project added successfully');
      form.resetFields();
      setIsModalVisible(false);
      fetchDocuments();
    } catch (error) {
      console.error('Error adding document: ', error);
      message.error('Failed to add project');
    }
  };

  const handleEdit = (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      showEditModal(project);
    }
  };

  const handleUpdate = async (values) => {
    if (!currentProject) return;

    try {
      let imageUrl = currentProject.imageUrl;

      // Check if a new file has been selected
      if (selectedFile) {
        // Delete the old file from storage if it exists
        if (imageUrl) {
          const oldRef = ref(getStorage(), imageUrl);
          await deleteObject(oldRef).catch((error) =>
            console.error('Failed to delete old image:', error),
          );
        }

        // Upload the new file and get the URL
        imageUrl = await uploadImage(selectedFile);
        values.imageUrl = imageUrl;
      }

      await updateDoc(doc(db, 'projects', currentProject.id), values);
      message.success('Project updated successfully');
      form.resetFields();
      setIsEditModalVisible(false);
      fetchDocuments();
    } catch (error) {
      console.error('Error updating document:', error);
      message.error('Failed to update project');
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this project?',
      content: 'Once deleted, the project cannot be recovered.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteDoc(doc(db, 'projects', id));
          message.success('Project deleted successfully');
          fetchDocuments();
        } catch (error) {
          message.error('Error deleting project');
          console.error('Error deleting document: ', error);
        }
      },
    });
  };

  function formFields() {
    return (
      <>
        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: 'Please input the title of the project!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="year"
          label="Year"
          rules={[
            { required: true, message: 'Please input the project year!' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="desc"
          label="Description"
          rules={[
            {
              required: true,
              message: 'Please input the project description!',
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Project Image">
          <Input
            type="file"
            onChange={(event) => setSelectedFile(event.target.files[0])}
          />
        </Form.Item>
        <Form.Item>
          <Button key="submit" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </>
    );
  }

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add Project
      </Button>
      <Table documents={projects} onEdit={handleEdit} onDelete={handleDelete} />
      <Modal
        title="Add a New Project"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          {formFields()}
        </Form>
      </Modal>
      <Modal
        title="Edit Project"
        open={isEditModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          {formFields()}
        </Form>
      </Modal>
    </>
  );
};

export default Projects;
