import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import PropTypes from "prop-types";
import LoadingSpinner from "../common/LoadingSpinner";
import { useUserFlow } from "../../contexts/UserFlowContext";
import { UserFlowStatus } from "../../constants";


const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const { flowStatus, loading } = useUserFlow();
  if (loading) return <LoadingSpinner />;


  if (!loading && flowStatus && flowStatus === UserFlowStatus.COMPLETE) {
    const redirectTo =
      user?.accessLevel !== "user" ? "/admin/dashboard" : "/dashboard";
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  return children;
};

GuestRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GuestRoute;
