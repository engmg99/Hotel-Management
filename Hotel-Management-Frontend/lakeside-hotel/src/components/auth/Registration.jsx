import { useState } from "react";
import { Link } from "react-router-dom";
import { axiosPost } from "../utils/APIFunctions";
import { GlobalConstants } from "../constants/global-constants";
import { Container, Form, FormControl } from "react-bootstrap";

const Registration = () => {
  const [isValidated, setIsValidated] = useState(true);
  const [registration, setRegistration] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    setRegistration({ ...registration, [e.target.name]: e.target.value });
  };

  const validateLoginForm = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      setIsValidated(true);
      return false;
    }
    return true;
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (validateLoginForm(e)) {
      try {
        const result = await axiosPost(
          GlobalConstants.REGISTER_USER,
          registration
        );
        setSuccessMessage(result);
        setErrorMessage("");
        setRegistration({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        });
      } catch (error) {
        setSuccessMessage("");
        setErrorMessage(`Registration error : ${error.message}`);
      }
    }
    setTimeout(() => {
      setErrorMessage("");
      setSuccessMessage("");
    }, 2500);
  };

  return (
    <Container className="col-6 mt-5 mb-5">
      {errorMessage && (
        <p className="alert alert-danger">{errorMessage.toString()}</p>
      )}
      {successMessage && (
        <p className="alert alert-success">{successMessage.toString()}</p>
      )}

      <h2>Register</h2>
      <Form noValidate validated={isValidated} onSubmit={handleRegistration}>
        <div className="mb-3 row">
          <Form.Label htmlFor="firstName" className="col-sm-2 col-form-label">
            First Name
          </Form.Label>
          <div className="col-sm-10">
            <FormControl
              required
              type="firstName"
              id="firstName"
              name="firstName"
              value={registration.firstName}
              placeholder="Enter first name"
              pattern={GlobalConstants.nameRegex}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Please enter valid first name
            </Form.Control.Feedback>
          </div>
        </div>

        <div className="mb-3 row">
          <Form.Label htmlFor="lastName" className="col-sm-2 col-form-label">
            Last Name
          </Form.Label>
          <div className="col-sm-10">
            <FormControl
              required
              id="lastName"
              name="lastName"
              type="text"
              value={registration.lastName}
              placeholder="Enter last name"
              pattern={GlobalConstants.nameRegex}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Please enter valid last name
            </Form.Control.Feedback>
          </div>
        </div>

        <div className="mb-3 row">
          <Form.Label htmlFor="email" className="col-sm-2 col-form-label">
            Email
          </Form.Label>
          <div className="col-sm-10">
            <FormControl
              id="email"
              name="email"
              type="email"
              value={registration.email}
              placeholder="Enter email"
              pattern={GlobalConstants.emailRegex}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="mb-3 row">
          <Form.Label htmlFor="password" className="col-sm-2 col-form-label">
            Password
          </Form.Label>
          <div className="col-sm-10">
            <FormControl
              required
              type="password"
              id="password"
              name="password"
              value={registration.password}
              placeholder="Enter password"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="mb-3">
          <button
            type="submit"
            className="btn btn-hotel"
            style={{ marginRight: "10px" }}
          >
            Register
          </button>
          <span style={{ marginLeft: "10px" }}>
            Already have an account? <Link to={"/login"}>Login</Link>
          </span>
        </div>
      </Form>
    </Container>
  );
};

export default Registration;
