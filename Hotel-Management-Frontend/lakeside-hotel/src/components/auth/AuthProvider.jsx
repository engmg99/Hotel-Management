import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

export const AuthContext = createContext({
  user: null,
  handleLogin: () => {},
  handleLogout: () => {},
});

export const AuthProvider = (props) => {
  const [user, setUser] = useState(null);

  const handleLogin = (token) => {
    const decodedUser = jwtDecode(token);
    console.log("decodedUser", decodedUser);
    localStorage.setItem("userId", decodedUser.sub);
    localStorage.setItem("userRole", decodedUser.roles.join(","));
    localStorage.setItem("token", token);
    setUser(decodedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};
