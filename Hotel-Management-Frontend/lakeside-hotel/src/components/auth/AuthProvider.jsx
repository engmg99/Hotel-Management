import { createContext, useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { axiosGet } from "../utils/APIFunctions";
import axios from "axios";

export const AuthContext = createContext({
  authUserDetails: {},
  handleLogin: () => {},
  handleLogout: () => {},
});

export const AuthProvider = (props) => {
  const [authUserDetails, setAuthUserDetails] = useState({});
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const validateLoggedInUserSession = useCallback(async () => {
    try {
      const sessionResponse = await axiosGet("/api/auth/check-status", {
        cancelToken: source.token,
      });
      if (sessionResponse) {
        handleLogin(sessionResponse);
        if (sessionResponse.message !== "Login successful") {
          removeUserLocalStorage();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    validateLoggedInUserSession();
    return () => {
      source.cancel("Request canceled");
    };
  }, [validateLoggedInUserSession, source]);

  const handleLogin = (user) => {
    setAuthUserDetails(user);
    setUserLocalStorage(user);
  };

  const handleLogout = () => {
    removeUserLocalStorage();
    setAuthUserDetails(null);
  };

  const setUserLocalStorage = (user) => {
    localStorage.setItem("userId", user?.email);
    localStorage.setItem("userRole", user?.roles?.join(","));
  };

  const removeUserLocalStorage = () => {
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
