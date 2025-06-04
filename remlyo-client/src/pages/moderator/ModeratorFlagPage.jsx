import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';

const ModeratorFlagPage = () => {
   const {user} = useAuth();
  return (
   <DashboardLayout user={user} pageTitle="Flags" >


   </DashboardLayout>
  );
}

export default ModeratorFlagPage;
