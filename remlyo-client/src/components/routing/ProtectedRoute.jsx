import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredSubscription = 'free' }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/signin" />;
  }

  // Check subscription level if required
  if (requiredSubscription === 'premium' && user.subscriptionType !== 'premium') {
    // Redirect to upgrade page or regular dashboard
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;