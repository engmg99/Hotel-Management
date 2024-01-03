import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext({
  authUserDetails: {},
  handleLogin: () => {},
  handleLogout: () => {},
});

export const AuthProvider = (props) => {
  const [authUserDetails, setAuthUserDetails] = useState({});

  const handleLogin = (user) => {
    setAuthUserDetails(user);
    localStorage.setItem("userId", user?.email);
    localStorage.setItem("userRole", user?.roles?.join(","));
  };

  const handleLogout = () => {
    setAuthUserDetails(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
  };

  return (
    <AuthContext.Provider
      value={{
        authUserDetails,
        handleLogin,
        handleLogout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};
