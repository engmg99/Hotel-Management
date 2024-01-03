import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { GlobalConstants } from "../constants/global-constants";

const Logout = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const axiosPrivateHook = useAxiosPrivate();

  const handleLogout = async () => {
    try {
      const logoutUser = await axiosPrivateHook.get(
        GlobalConstants.USER_LOGOUT
      );
      if (logoutUser?.data?.message === GlobalConstants.userLogoutMsg) {
        console.log(logoutUser?.data);
        auth.handleLogout();
        navigate("/", { state: { message: GlobalConstants.userLogoutMsg } });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isLoggedIn = auth.authUserDetails?.email;

  return isLoggedIn ? (
    <React.Fragment>
      <li>
        <Link className="dropdown-item" to={"/profile"}>
          Profile
        </Link>
      </li>
      <li>
        <hr className="dropdown-divider" />
      </li>
      <button className="dropdown-item" onClick={handleLogout}>
        Logout
      </button>
    </React.Fragment>
  ) : null;
};

export default Logout;
