import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { UserFlowStatus } from "../constants";
import { checkHealthProfile, checkSubscription } from "../api/userApi";


const UserFlowContext = createContext();

export const UserFlowProvider = ({ children }) => {
  const { user, isAuthenticated, authToken, loading: authLoading } = useAuth();
  const [flowStatus, setFlowStatus] = useState(null);
  const [loading, setLoading] = useState(authLoading);

  const checkUserFlow = async () => {
    if (!loading && !isAuthenticated) {
      setFlowStatus(UserFlowStatus.LOGGED_OUT);
      setLoading(false);
      return;
    }
  
    if (user && !user.emailVerified) {
      setFlowStatus(UserFlowStatus.EMAIL_UNVERIFIED);
      setLoading(false);
      return;
    }
  
    try {
      const healthProfileRes = await checkHealthProfile(authToken);
      
      // If profile check is successful, set status to complete
      if (healthProfileRes && healthProfileRes.success) {
        setFlowStatus(UserFlowStatus.COMPLETE);
        setLoading(false);
        return;
      }

      // Only set profile incomplete if the check explicitly failed
      if (healthProfileRes && !healthProfileRes.success) {
        setFlowStatus(UserFlowStatus.PROFILE_INCOMPLETE);
        setLoading(false);
        return;
      }
  
      // Uncomment and expand this if you want to include subscription
      // const subscriptionRes = await checkSubscription(authToken);
      // if (!subscriptionRes.data.hasActiveSubscription) {
      //   setFlowStatus(UserFlowStatus.SUBSCRIPTION_REQUIRED);
      //   setLoading(false);
      //   return;
      // }
  
      setFlowStatus(UserFlowStatus.COMPLETE);
    } catch (error) {
      console.error("Error checking user flow:", error);
      // Don't set profile incomplete on error, keep previous status
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (!loading && isAuthenticated && authToken) {
      checkUserFlow();
    } else if (!loading && !isAuthenticated) {
      // Optionally handle the logged out state if needed here,
      // though checkUserFlow also handles it internally
      setFlowStatus(UserFlowStatus.LOGGED_OUT);
      setLoading(false);
    }

    return setLoading(false)
  }, [location.pathname]);

  return (
    <UserFlowContext.Provider value={{ flowStatus, loading, checkUserFlow,setFlowStatus }}>
      {children}
    </UserFlowContext.Provider>
  );
};

export const useUserFlow = () => useContext(UserFlowContext);
