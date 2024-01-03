import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext({
  authUserDetails: {},
  handleLogin: () => {},
  handleLogout: () => {},
  persist: false,
  setPersist: false,
});

export const AuthProvider = (props) => {
  const [authUserDetails, setAuthUserDetails] = useState({});
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

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
        persist,
        setPersist,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};
