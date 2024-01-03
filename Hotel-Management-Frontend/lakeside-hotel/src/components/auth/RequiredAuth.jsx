import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import PropTypes from "prop-types";

const RequireAuth = (props) => {
  const auth = useAuth();
  const location = useLocation();

  return auth?.authUserDetails?.roles?.find((role) =>
    props.allowedRoles?.includes(role)
  ) ? (
    <Outlet />
  ) : auth.authUserDetails?.email ? (
    <Navigate to="/unauthorized" state={{ path: location.pathname }} replace />
  ) : (
    <Navigate to="/login" state={{ path: location.pathname }} replace />
  );
};

RequireAuth.propTypes = {
  allowedRoles: PropTypes.array,
};

export default RequireAuth;
