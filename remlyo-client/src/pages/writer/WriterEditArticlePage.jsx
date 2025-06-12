import React from 'react'
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';

const WriterEditArticlePage = () => {
  const { user } = useAuth();
  return (
    <DashboardLayout user={user} pageTitle="Edit Article"></DashboardLayout>
  );
}

export default WriterEditArticlePage
