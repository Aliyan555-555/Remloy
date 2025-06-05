import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "./../common/LoadingSpinner";

const WriterRoutes = ({ children }) => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }
  if (!loading && !isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/signin" />;
  }

  // Check if user is admin
  if (
    !loading &&
    isAuthenticated &&
    user.emailVerified &&
    user.accessLevel !== "writer"
  ) {
    // Redirect to user dashboard if not admin
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default WriterRoutes;
