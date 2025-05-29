import React, { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserFlow } from "../../contexts/UserFlowContext";
import { useAuth } from "../../contexts/AuthContext";
import { UserFlowStatus } from "../../constants";
import LoadingSpinner from "../common/LoadingSpinner";

const FlowGuard = ({ children }) => {
  const { flowStatus, loading } = useUserFlow();
  const { isAuthenticated, user, authToken } = useAuth();
  const location = useLocation();

  const currentPath = location.pathname;
  const isAdmin = user?.accessLevel === "admin";

  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect unauthenticated or unknown flow users to sign-in
  if (!isAuthenticated && !flowStatus) {
    return <Navigate to="/signin" replace />;
  }

  if (!flowStatus) {
    return children;
  }

  // Redirect admins trying to access /dashboard to /admin/dashboard
  if (isAdmin && currentPath === "/dashboard") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Define allowed routes based on user flow status
  const allowedRoutes = useMemo(
    () => ({
      [UserFlowStatus.LOGGED_OUT]: ["/signin", "/signup", "/forgot-password"],
      [UserFlowStatus.EMAIL_UNVERIFIED]: ["/verify-email", "/logout"],
      [UserFlowStatus.PROFILE_INCOMPLETE]: ["/health-profile", "/logout"],
      [UserFlowStatus.SUBSCRIPTION_REQUIRED]: [
        "/subscription",
        "/health-profile",
        "/logout",
      ],
      [UserFlowStatus.COMPLETE]: ["*"],
    }),
    []
  );

  // Determine if current route is allowed
  const isRouteAllowed = allowedRoutes[flowStatus]?.some(
    (route) => route === "*" || currentPath.startsWith(route)
  );

  if (isRouteAllowed) {
    return children;
  }

  // Redirect based on current user flow status
  const redirectMap = {
    [UserFlowStatus.EMAIL_UNVERIFIED]: `/verify-email`,
    [UserFlowStatus.PROFILE_INCOMPLETE]: "/health-profile",
    [UserFlowStatus.SUBSCRIPTION_REQUIRED]: "/subscription",
    [UserFlowStatus.LOGGED_OUT]: "/signin",
  };

  const fallbackRedirect = redirectMap[flowStatus] || "/signin";

  return <Navigate to={fallbackRedirect} state={{ from: location }} replace />;
};

export default FlowGuard;
