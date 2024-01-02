import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
  const auth = useAuth();
  const location = useLocation();

  return auth.authUserDetails?.email ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ path: location.pathname }} replace />
  );
};

export default RequireAuth;
