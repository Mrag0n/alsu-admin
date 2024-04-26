import React, { useEffect, useState } from 'react';
import { Button, Form, Layout, message, Modal } from 'antd/lib';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  setDoc,
  increment,
  DocumentReference,
} from 'firebase/firestore';

import { getStorage, ref, uploadBytes, deleteObject } from 'firebase/storage';

import { db } from '@lib/firebase';
import { Document } from '@/types/document';
import Table from '@components/Table';
import ModalForm from '@components/ModalForm';

const CREATE_MODE = 'create';
const UPDATE_MODE = 'update';

type Mode = 'create' | 'update';

interface ModalState {
  title: string;
  mode: Mode;
}

interface FileReference {
  count: number;
}

const Projects = () => {
  const [projects, setProjects] = useState<Document[]>([]);
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const [currentProject, setCurrentProject] = useState<Document | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Function to create a valid Firestore document ID from a file path
  const sanitizeFilePath = (filePath: string): string => {
    return filePath.replace(/[\/\s]+/g, '_'); // Replace slashes and spaces with underscores
  };

  // Function to increment file reference count
  const incrementFileReference = async (filePath: string): Promise<void> => {
    const sanitizedPath = sanitizeFilePath(filePath);
    const fileRef = doc(
      db,
      'fileRefs',
      sanitizedPath,
    ) as DocumentReference<FileReference>;
    await setDoc(fileRef, { count: increment(1) }, { merge: true });
  };

  // Function to decrement file reference count and delete file if count is zero
  const decrementFileReference = async (filePath: string): Promise<void> => {
    const sanitizedPath = sanitizeFilePath(filePath);
    const fileRef = doc(
      db,
      'fileRefs',
      sanitizedPath,
    ) as DocumentReference<FileReference>;
    const fileSnap = await getDoc(fileRef);
    if (fileSnap.exists() && fileSnap.data().count <= 1) {
      const storage = getStorage();
      const fileStorageRef = ref(storage, filePath); // Original path for Firebase Storage
      await deleteObject(fileStorageRef);
      await deleteDoc(fileRef);
    } else if (fileSnap.exists()) {
      await updateDoc(fileRef, { count: increment(-1) });
    }
  };

  const fetchDocuments = async () => {
    const querySnapshot = await getDocs(collection(db, 'projects'));
    const docsArray = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Document; // Cast the document data to your Document type
      // Ensure there's no ID conflict
      return {
        ...data,
        id: doc.id, // Explicitly set the document's ID, ensuring it takes precedence
      };
    });
    setProjects(docsArray);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    return `images/${file.name}`; // Return the path as the identifier
  };

  const showModal = () => {
    setModalState({
      title: 'Create Project',
      mode: CREATE_MODE,
    });
  };

  const showEditModal = (project: Document) => {
    form.setFieldsValue(project);
    setCurrentProject(project);
    setModalState({
      title: 'Create Project',
      mode: UPDATE_MODE,
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedFile(null);
    setModalState(null);
  };

  const handleEdit = (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      showEditModal(project);
    }
  };

  const handleAdd = async (values: Document) => {
    try {
      if (selectedFile) {
        values.imageUrl = await uploadImage(selectedFile);
        await incrementFileReference(values.imageUrl);
      }
      await addDoc(collection(db, 'projects'), values);
      message.success('Project added successfully');
      form.resetFields();
      setSelectedFile(null);
      handleCancel();
      await fetchDocuments();
    } catch (error) {
      console.error('Error adding document:', error);
      message.error('Failed to add project');
    }
  };

  const handleUpdate = async (values: Document) => {
    if (!currentProject) return;

    try {
      let imageUrl = currentProject.imageUrl;

      if (selectedFile) {
        if (imageUrl) {
          await decrementFileReference(imageUrl); // Decrement the old image reference
        }
        imageUrl = await uploadImage(selectedFile);
        values.imageUrl = imageUrl;
        await incrementFileReference(imageUrl); // Increment the new image reference
      }

      await updateDoc(doc(db, 'projects', currentProject.id), values);
      message.success('Project updated successfully');
      form.resetFields();
      setSelectedFile(null);
      handleCancel();
      fetchDocuments();
    } catch (error) {
      console.error('Error updating document:', error);
      message.error('Failed to update project');
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this project?',
      content:
        'Once deleted, the project cannot be recovered along with its image.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        const projectToDelete = projects.find((p) => p.id === id);
        if (!projectToDelete) {
          message.error('Project not found.');
          return;
        }

        if (projectToDelete.imageUrl) {
          await decrementFileReference(projectToDelete.imageUrl); // Decrement the file reference
        }

        try {
          await deleteDoc(doc(db, 'projects', id));
          message.success('Project deleted successfully.');
          await fetchDocuments();
        } catch (error) {
          console.error('Error deleting project:', error);
          message.error('Error deleting project.');
        }
      },
    });
  };

  const actionsMap = {
    [CREATE_MODE]: handleAdd,
    [UPDATE_MODE]: handleUpdate,
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '16px 0',
        }}
      >
        <Button type="primary" onClick={showModal}>
          Add Project
        </Button>
      </div>
      <div style={{ maxHeight: '100%' }}>
        <Table
          documents={projects}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      {Boolean(modalState) && (
        <ModalForm
          title={modalState?.title || ''}
          form={form}
          handleCancel={handleCancel}
          setSelectedFile={setSelectedFile}
          onFinish={
            (modalState && actionsMap[modalState.mode]) ||
            actionsMap[CREATE_MODE]
          }
        />
      )}
    </>
  );
};

export default Projects;
