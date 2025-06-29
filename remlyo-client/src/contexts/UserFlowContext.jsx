import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { UserFlowStatus } from "../constants";
import { checkHealthProfile, checkSubscription } from "../api/userApi";
import LoadingSpinner from "./../components/common/LoadingSpinner";

const UserFlowContext = createContext();

export const UserFlowProvider = ({ children }) => {
  const { user, isAuthenticated, authToken, loading: authLoading } = useAuth();
  const [flowStatus, setFlowStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUserFlow = async () => {
    try {
      setLoading(true);
      if (!isAuthenticated) {
        setFlowStatus(UserFlowStatus.LOGGED_OUT);
        return;
      }

      if (user && !user.emailVerified) {
        setFlowStatus(UserFlowStatus.EMAIL_UNVERIFIED);
        return;
      }

      // Check health profile
      const healthProfileRes = await checkHealthProfile(authToken);
      if (!healthProfileRes || !healthProfileRes.success) {
        setFlowStatus(UserFlowStatus.PROFILE_INCOMPLETE);
        return;
      }

      // Check subscription
      const subscriptionRes = await checkSubscription(authToken);
      if (!subscriptionRes?.data?.hasActiveSubscription) {
        setFlowStatus(UserFlowStatus.SUBSCRIPTION_REQUIRED);
        return;
      }

      setFlowStatus(UserFlowStatus.COMPLETE);
    } catch (error) {
      console.error("Error checking user flow:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated && authToken) {
      checkUserFlow();
    } else if (!isAuthenticated) {
      setFlowStatus(UserFlowStatus.LOGGED_OUT);
      setLoading(false);
    }
  }, [isAuthenticated, authToken, authLoading]);

  if (!authLoading && loading) {
    console.log("loading...........");
    return <LoadingSpinner />;
  }
  return (
    <UserFlowContext.Provider
      value={{ flowStatus, loading, checkUserFlow, setFlowStatus }}
    >
      {children}
    </UserFlowContext.Provider>
  );
};

export const useUserFlow = () => useContext(UserFlowContext);
