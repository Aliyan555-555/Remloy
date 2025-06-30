import React, { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserFlow } from "../../contexts/UserFlowContext";
import { useAuth } from "../../contexts/AuthContext";
import { UserFlowStatus } from "../../constants";
import LoadingSpinner from "../common/LoadingSpinner";

const FlowGuard = ({ children }) => {
  const { flowStatus, loading } = useUserFlow();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const currentPath = location.pathname;
  
    if (loading) {
      return <LoadingSpinner />;
    }
  const role = user?.accessLevel;

  const roleDashboardRoutes = {
    user: "/dashboard",
    admin: "/admin/dashboard",
    moderator: "/moderator/dashboard",
    writer: "/writer/dashboard",
  };

  const userDashboardRoute = roleDashboardRoutes[role] || "/dashboard";

  // Redirect unauthenticated users
  if (!isAuthenticated && !flowStatus) {
    return <Navigate to="/signin" replace />;
  }

  if (user && user.status == "suspended"){
    return <Navigate to={'/suspended'} replace />
  }

  // Redirect authenticated users accessing base /dashboard to their role-specific dashboard
  if (isAuthenticated && currentPath === "/dashboard" && role !== "user") {
    return <Navigate to={userDashboardRoute} replace />;
  }

  // Skip flow checks for admin routes
  const isAdminRoute = currentPath.startsWith("/admin");
  if (isAdminRoute && role === "admin") {
    return children;
  }

  // Define allowed routes based on flow status
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
      [UserFlowStatus.COMPLETE]: ["*"], // Full access
      [UserFlowStatus.SUSPENDED]:["/suspended","/logout"]
    }),
    []
  );

  // Check if current route is allowed for this flow status
  const isRouteAllowed = allowedRoutes[flowStatus]?.some(
    (route) => route === "*" || currentPath.startsWith(route)
  );

  if (isRouteAllowed) {
    return children;
  }

  // Flow-based redirection
  const redirectMap = {
    [UserFlowStatus.EMAIL_UNVERIFIED]: "/verify-email",
    [UserFlowStatus.PROFILE_INCOMPLETE]: "/health-profile",
    [UserFlowStatus.SUBSCRIPTION_REQUIRED]: "/pricing",
    [UserFlowStatus.LOGGED_OUT]: "/signin",
  };

  const fallbackRedirect = redirectMap[flowStatus] || "/signin";
  console.log("Redirecting due to flow restriction:", fallbackRedirect,flowStatus);

  return <Navigate to={fallbackRedirect} state={{ from: location }} replace />;
};

export default FlowGuard;
