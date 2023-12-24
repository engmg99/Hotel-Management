import { Link, NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import Logout from "../auth/Logout";
import { AuthContext } from "../auth/AuthProvider";

const Navbar = (props) => {
  const [showAccount, setShowAccount] = useState(false);

  const auth = useContext(AuthContext);

  const handleAccountClick = () => {
    setShowAccount(!showAccount);
  };

  const isLoggedIn = auth.user !== null;
  const userRole = localStorage.getItem("userRole");

  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary px-5 shadow sticky-top"
      data-bs-theme={props.appMode === "light" ? "light" : "dark"}
    >
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <span className="hotel-color">{props.headingTitle}</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarScroll"
          aria-controls="navbarScroll"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 navbar-nav-scroll">
            <li className="nav-item">
              <NavLink
                className="nav-link"
                aria-current="page"
                to={"/browse-all-rooms"}
              >
                Browse All Rooms
              </NavLink>
            </li>
            {/* If logged in user is an Admin then only this Link will show */}
            {isLoggedIn && userRole === "ROLE_ADMIN" && (
              <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to={"/admin"}>
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
          <ul className="d-flex navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to={"/find-booking"}>
                Find My Booking
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <a
                className={`nav-link dropdown-toggle ${
                  showAccount ? "show" : ""
                }`}
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={handleAccountClick}
              >
                Account
              </a>
              <ul
                className={`dropdown-menu ${showAccount ? "show" : ""}`}
                aria-labelledby="navbarDropdown"
              >
                {isLoggedIn ? (
                  <Logout />
                ) : (
                  <li>
                    <Link to={"/login"} className="dropdown-item">
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </li>
          </ul>
          {props.appMode === "light" ? (
            <FaSun onClick={props.toggleMode} />
          ) : (
            <FaMoon className="text-light" onClick={props.toggleMode} />
          )}
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  appMode: PropTypes.string,
  headingTitle: PropTypes.string,
  toggleMode: PropTypes.func,
};

export default Navbar;
