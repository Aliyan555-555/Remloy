import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";
import useUserPlan from "../hooks/useUserPlan";

const MyRemedies = () => {
  const { user } = useAuth();
  const { plan, isPremium } = useUserPlan();

  return (
    <DashboardLayout
      pageTitle="My Remedies"
      user={user}
      isPremiumUser={isPremium}
    ></DashboardLayout>
  );
};

export default MyRemedies;
