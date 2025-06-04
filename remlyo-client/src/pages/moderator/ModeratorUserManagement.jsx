import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";

const ModeratorUserManagement = () => {
  const { user } = useAuth();
  return <DashboardLayout user={user} pageTitle="Comments"></DashboardLayout>;
};

export default ModeratorUserManagement;
