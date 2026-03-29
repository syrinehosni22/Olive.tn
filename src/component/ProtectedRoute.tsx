import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // We pass the current path into the 'state' property
    // so the SignIn page knows where to send the user back to.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;