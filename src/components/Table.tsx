import React, { useMemo } from 'react';
import { Table, Button, Space, Tag } from 'antd/lib';
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
        title: 'Description',
        dataIndex: 'desc',
        key: 'desc',
        ellipsis: true,
      },
      {
        title: 'Tags',
        dataIndex: 'tags',
        key: 'tags',
        render: (tags: string[]) => (
          <span>
            {tags?.map((tag) => {
              let color = tag.length > 5 ? 'geekblue' : 'green';
              if (tag === 'loser') {
                color = 'volcano';
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        ),
      },
      {
        title: 'Year',
        dataIndex: 'year',
        key: 'year',
      },
      {
        title: 'Actions',
        key: 'actions',
        align: 'right',
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

  return (
    <Table
      dataSource={documents}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 8 }}
    />
  );
};

export default DocumentsList;
