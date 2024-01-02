import { useState } from "react";
import { Link } from "react-router-dom";
import { axiosPost } from "../utils/APIFunctions";
import { GlobalConstants } from "../constants/global-constants";
import { Container, Form, FormControl } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";

const Registration = () => {
  const [isValidated, setIsValidated] = useState(false);
  const [matchPwd, setMatchPwd] = useState("");
  const [registration, setRegistration] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // useEffect(() => {
  //   userRef.current.focus();
  // }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name == "matchPwd") {
      if (value !== registration.password) {
        setIsValidated(true);
      }
      setMatchPwd(value);
    } else {
      setRegistration({ ...registration, [name]: value });
    }
  };

  const checkPwdMatch = () => {
    if (matchPwd !== registration.password) {
      return false;
    }
    return true;
  };

  const validateRegistrationForm = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setIsValidated(true);
      return false;
    }
    if (!checkPwdMatch()) {
      return false;
    }
    return true;
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (validateRegistrationForm(e)) {
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
              pattern={GlobalConstants.firstLastNameRegex}
              placeholder="Enter first name"
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              <p className="instructions">
                <FaInfoCircle />
                4 to 24 characters.
                <br />
                Only Letters are allowed.
              </p>
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
              pattern={GlobalConstants.firstLastNameRegex}
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
              required
              id="email"
              name="email"
              type="email"
              value={registration.email}
              placeholder="Enter email"
              pattern={GlobalConstants.emailRegex}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Please enter valid email
            </Form.Control.Feedback>
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
              autoComplete="off"
              value={registration.password}
              placeholder="Enter password"
              pattern={GlobalConstants.PWD_REGEX}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              <p className="instructions">
                <FaInfoCircle />
                8 to 24 characters.
                <br />
                Must include uppercase and lowercase letters, a number and a
                special character.
                <br />
                Allowed special characters:{" "}
                <span aria-label="exclamation mark">!</span>{" "}
                <span aria-label="at symbol">@</span>{" "}
                <span aria-label="hashtag">#</span>{" "}
                <span aria-label="dollar sign">$</span>{" "}
                <span aria-label="percent">%</span>
              </p>
            </Form.Control.Feedback>
          </div>
        </div>

        <div className="mb-3 row">
          <Form.Label htmlFor="matchPwd" className="col-sm-2 col-form-label">
            Confirm Password
          </Form.Label>
          <div className="col-sm-10">
            <FormControl
              required
              type="password"
              id="matchPwd"
              name="matchPwd"
              autoComplete="off"
              value={matchPwd}
              placeholder="Re-enter password"
              onChange={handleInputChange}
            />
            {!checkPwdMatch() ? (
              <p className="instructions">
                <FaInfoCircle />
                Must match the password input field.
              </p>
            ) : (
              <Form.Control.Feedback type="invalid">
                Value cannot be blank
              </Form.Control.Feedback>
            )}
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
