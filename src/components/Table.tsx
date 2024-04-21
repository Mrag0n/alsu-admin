import React, { useMemo } from 'react';
import { Table, Button, Space } from 'antd/lib';
import { Document } from '@/types/document';

interface TablePropsI {
  documents: Document[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const DocumentsList = ({
  documents,
  onEdit,
  onDelete,
}: TablePropsI): React.JSX.Element => {
  const columns = useMemo(
    () => [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Year',
        dataIndex: 'year',
        key: 'year',
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: Document) => (
          <Space size="middle">
            <Button onClick={() => onEdit(record.id)} type="link">
              Edit
            </Button>
            <Button onClick={() => onDelete(record.id)} type="link">
              Delete
            </Button>
          </Space>
        ),
      },
    ],
    [onEdit, onDelete],
  );

  return <Table dataSource={documents} columns={columns} rowKey="id" />;
};

export default DocumentsList;
