import React, { SetStateAction } from 'react';
import {
  Button,
  Form,
  Input,
  Modal,
  FormInstance,
  Select,
  Tag,
} from 'antd/lib';
import { Document } from '@/types/document';

const { Option } = Select;

interface ModalFormProps {
  title: string;
  form: FormInstance;
  onFinish: (values: Document) => Promise<void>;
  handleCancel: () => void;
  setSelectedFile: SetStateAction<any>;
}

const tagColors = {
  branding: 'red',
  'ui-ux': 'green',
  product: 'gray',
};

const ModalForm = ({
  title,
  form,
  onFinish,
  handleCancel,
  setSelectedFile,
}: ModalFormProps) => {
  return (
    <Modal title={title} open onCancel={handleCancel} footer={null}>
      <Form form={form} onFinish={onFinish} layout="vertical">
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
        <Form.Item name="tags" label="Tags">
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select tags"
            dropdownRender={(menu) => <>{menu}</>}
            tagRender={({ label, value, closable, onClose }) => {
              const color = tagColors[value] || 'blue';
              return (
                <Tag color={color} closable={closable} onClose={onClose}>
                  {label}
                </Tag>
              );
            }}
          >
            {Object.keys(tagColors).map((tag) => (
              <Option key={tag} value={tag}>
                {tag}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Project Image">
          <Input
            type="file"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (event.target.files && event.target.files.length > 0) {
                setSelectedFile(event.target.files[0]);
              } else {
                console.log('No file selected');
              }
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button key="submit" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalForm;
