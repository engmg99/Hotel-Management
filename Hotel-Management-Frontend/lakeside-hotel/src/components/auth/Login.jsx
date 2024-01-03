import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { GlobalConstants } from "../constants/global-constants";
import { Container, Form, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const [isValidated, setIsValidated] = useState(false);
  const [errorMsg, setErrorMessage] = useState("");
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();
  const redirectUrl = location.state?.path || "/";
  const axiosPrivateHook = useAxiosPrivate();

  const handleInputChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const validateLoginForm = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      setIsValidated(true);
      return false;
    }
    return true;
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    // console.log(e.currentTarget.checkValidity());
    if (validateLoginForm(e)) {
      try {
        const loginResult = await axiosPrivateHook.post(
          GlobalConstants.USER_LOGIN,
          login
        );
        if (loginResult?.data) {
          setErrorMessage("");
          console.log("loginResult: ", loginResult?.data);
          auth.handleLogin(loginResult?.data);
          navigate(redirectUrl, { replace: true });
        }
      } catch (error) {
        console.log(error);
        setErrorMessage(error?.response?.data);
      }
    }
    setTimeout(() => {
      setErrorMessage("");
    }, 2500);
  };

  const togglePersist = () => {
    auth.setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", auth.persist);
  }, [auth.persist]);

  return (
    <Container className="col-6 mt-5 mb-5">
      {errorMsg && (
        <div className="alert alert-danger fade show">
          {errorMsg.toString()}
        </div>
      )}
      <h2>Login</h2>
      <Form noValidate validated={isValidated} onSubmit={handleUserLogin}>
        <div className="row mb-3">
          <Form.Label htmlFor="email" className="col-sm-2 col-form-label">
            Email:
          </Form.Label>
          <FormControl
            required
            type="email"
            id="email"
            name="email"
            value={login.email}
            placeholder="Enter email"
            pattern={GlobalConstants.emailRegex}
            onChange={handleInputChange}
          />
          <Form.Control.Feedback type="invalid">
            Please enter valid email
          </Form.Control.Feedback>
        </div>
        <div className="row mb-2">
          <Form.Label htmlFor="password" className="col-sm-2 col-form-label">
            Password:
          </Form.Label>
          <FormControl
            required
            type="password"
            id="password"
            name="password"
            autoComplete="off"
            value={login.password}
            placeholder="Enter password"
            // pattern={GlobalConstants.emailRegex}
            onChange={handleInputChange}
          />
          <Form.Control.Feedback type="invalid">
            Please enter correct password
          </Form.Control.Feedback>
        </div>
        <div className="row mb-3">
          <div className="persistCheck">
            <input
              type="checkbox"
              id="isPersist"
              onChange={togglePersist}
              checked={auth.persist}
            />
            <label htmlFor="isPersist">Trust This Device</label>
          </div>
        </div>
        <div className="mb-3">
          <button
            type="submit"
            className="btn btn-hotel"
            style={{ marginRight: "10px" }}
          >
            Login
          </button>
          <span style={{ marginLeft: "10px" }}>
            Don&apos;t have an account yet?{" "}
            <Link to={"/register"}>Sign Up</Link>
          </span>
        </div>
      </Form>
    </Container>
  );
};

export default Login;
