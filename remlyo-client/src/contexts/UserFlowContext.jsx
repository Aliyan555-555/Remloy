import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { UserFlowStatus } from "../constants";
import { checkHealthProfile, checkSubscription } from "../api/userApi";
import LoadingSpinner from "./../components/common/LoadingSpinner";

const UserFlowContext = createContext();

export const UserFlowProvider = ({ children }) => {
  const { user, isAuthenticated, authToken, loading: authLoading,flowStatus,setFlowStatus} = useAuth();
  const [loading, setLoading] = useState(true);

  const checkUserFlow = async () => {
    try {
      // if (loading) return;

      // setLoading(true);
      if (!isAuthenticated) {
    
        setFlowStatus(UserFlowStatus.LOGGED_OUT);
        setLoading(false);
        return;
      }
      if (user && user.status && user.status.toLowerCase() === "suspended"){
        setFlowStatus(UserFlowStatus.SUSPENDED);
        setLoading(false);
        return
      }

      // if (user && !user.emailVerified) {
      //   setFlowStatus(UserFlowStatus.EMAIL_UNVERIFIED);
      //   setLoading(false);
      //   return;
      // }

      // Check health profile
      const healthProfileRes = await checkHealthProfile(authToken);
      if (!healthProfileRes || !healthProfileRes.success) {
        setFlowStatus(UserFlowStatus.PROFILE_INCOMPLETE);
        setLoading(false);
        return;
      }

      // Check subscription
      const subscriptionRes = await checkSubscription(authToken);
      if (!subscriptionRes?.data?.hasActiveSubscription) {
        setFlowStatus(UserFlowStatus.SUBSCRIPTION_REQUIRED);
        setLoading(false);
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
  }, [isAuthenticated, authToken, authLoading,flowStatus]);

  if (loading) {
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
