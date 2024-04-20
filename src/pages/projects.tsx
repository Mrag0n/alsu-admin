import React, { useEffect, useState } from 'react';
import { db } from '@lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Document } from '@types/document';
import Table from '@components/Table';

const Projects = () => {
  const [projects, setProjects] = useState<Document[]>([]);

  const fetchDocuments = async () => {
    const querySnapshot = await getDocs(collection(db, 'projects'));
    const docsArray = querySnapshot.docs.map((doc) => {
      const { title, year, desc } = doc.data();
      return {
        id: doc.id,
        title,
        year,
        desc,
      };
    });
    setProjects(docsArray);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return <Table documents={projects} />;
};

export default Projects;
