// src/components/routing/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/signin" />;
  }

  // Check if user is admin
  if (user.accessLevel !== 'admin') {
    // Redirect to user dashboard if not admin
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AdminRoute;