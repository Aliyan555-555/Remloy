import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, requiredSubscription = 'free' }) => {
  const { isAuthenticated,loading, user } = useAuth();



  if (loading) {
    return (
      <LoadingSpinner/>
    )
  }

  if (!loading && !isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/signin" />;
  }

  // Check subscription level if required
  if (!loading && requiredSubscription === 'premium' && user.subscriptionType !== 'premium') {
    // Redirect to upgrade page or regular dashboard
    return <Navigate to="/dashboard" />;
  }

  if (!loading && user?.status === 'suspended') {
    // Allow access only to home and suspended user page
    const allowedPaths = ['/', '/suspended'];
    if (!allowedPaths.includes(window.location.pathname)) {
      return <Navigate to="/suspended" />;
    }
  }

  return children;
};

export default ProtectedRoute;