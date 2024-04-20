import React, { useMemo } from 'react';
import { Table } from 'antd/lib';
import { Document } from '@types/document';

interface TablePropsI {
  documents: Document[];
}

const DocumentsList = ({ documents }: TablePropsI): React.JSX.Element => {
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
    ],
    [],
  );

  return <Table dataSource={documents} columns={columns} rowKey="id" />;
};

export default DocumentsList;
