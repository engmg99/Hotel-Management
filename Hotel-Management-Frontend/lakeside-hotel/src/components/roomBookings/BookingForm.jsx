import React, { useState } from "react";
import { axiosPost } from "../utils/APIFunctions";
import { useNavigate } from "react-router";
import moment from "moment/moment";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  Row,
} from "react-bootstrap";
import BookingSummary from "./BookingSummary";
import PropTypes from "prop-types";
import { GlobalConstants } from "../constants/global-constants";

const BookingForm = (props) => {
  // State Variables
  const [isValidated, setIsValidated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [bookingInfo, setBookingInfo] = useState({
    guestName: "",
    guestEmail: "",
    checkInDate: moment().format("YYYY-MM-DD"), //set the today date
    checkOutDate: moment().add(1, "days").format("YYYY-MM-DD"), //set next date from the today date
    noOfAdults: 2,
    noOfChildren: 0, //by default zero childrens are there
  });

  // navigation
  const navigate = useNavigate(); // used to navigate to a particular URL after performing some logic

  // method used to handle the form inputs
  const handleInputChange = (e) => {
    const fieldName = e.target.name;
    let fieldValue = e.target.value;
    const bookingObj = {
      ...bookingInfo,
      [e.target.name]: e.target.value,
    };
    if (fieldName === "checkInDate") {
      bookingObj["checkOutDate"] = moment(fieldValue)
        .add(1, "days")
        .format("YYYY-MM-DD");
    }
    // console.log(bookingObj);
    setBookingInfo(bookingObj);
  };

  //used to calculate the payment of room
  const calcPayment = () => {
    const checkInDate = moment(bookingInfo.checkInDate); // checkInDate converted to Moment
    const checkOutDate = moment(bookingInfo.checkOutDate); // checkOutDate converted to Moment
    const totalDays = checkOutDate.diff(checkInDate, "days"); // get total number of days
    const price = props.room?.price ? props.room?.price : 0;
    return totalDays * price;
  };

  //counts the number of guests i.e adults + childrens
  // const isGuestCountValid = () => {
  //   const adultCount = parseInt(bookingInfo.noOfAdults);
  //   const childrenCount = parseInt(bookingInfo.noOfChildren);
  //   const totalCount = adultCount + childrenCount;
  //   return totalCount >= 1;
  // };

  // ***IMP*** this method checks that the Selected dates are correct
  // i.e Check Out date must be after Check In only
  // I had added a functionality that if check-In date is selected, we can disable all the dates before that
  // const isCheckOutDateValid = () => {
  //   if (
  //     !moment(bookingInfo.checkOutDate).isSameOrAfter(
  //       moment(bookingInfo.checkInDate)
  //     )
  //   ) {
  //     setErrorMsg("Check-Out Date must come after the Check-In Date");
  //     return false;
  //   } else {
  //     setErrorMsg("");
  //   }
  //   return true;
  // };

  //calculates the from which date, the dates to be disabled in calender
  const calcMinimumCheckOutDate = () => {
    return moment(bookingInfo.checkInDate).add(1, "days").format("YYYY-MM-DD");
  };

  // checks the form data and validation stuff
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget; // current form
    // console.log(form.checkValidity()); // method provided by form to check validity
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      setIsSubmitted(true);
    }
    setIsValidated(true);
  };

  // submit room reservation
  const handleBooking = async () => {
    try {
      const confirmCode = await axiosPost(
        GlobalConstants.BOOK_ROOM_BY_ID(props.roomId),
        bookingInfo
      );
      setIsSubmitted(true);
      navigate("/booking-success", { state: { message: confirmCode } });
    } catch (error) {
      setErrorMsg(error?.response?.data);
      navigate("/booking-success", { state: { error: error?.response?.data } });
    }
  };

  return (
    <React.Fragment>
      <Container className="mb-5">
        {/* <Row>
          <Col md={4}>
            <img src={`data:image/jpeg;base64,${props.room.roomPhoto}`} />
          </Col>
        </Row> */}
        <Row>
          <Col md={6}>
            <Card>
              <CardBody>
                <CardTitle className="text-center">
                  <h2>Reserve Room</h2>
                </CardTitle>
                <Form
                  noValidate //used to disable the browser's built-in form validation.
                  validated={isValidated}
                  onSubmit={handleSubmit}
                >
                  <Form.Group>
                    <Form.Label htmlFor="guestName">Full Name:</Form.Label>
                    <FormControl
                      required
                      type="text"
                      id="guestName"
                      name="guestName"
                      value={bookingInfo.guestName}
                      placeholder="Enter your full name"
                      pattern={GlobalConstants.nameRegex}
                      onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter valid name
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label htmlFor="guestEmail">Email:</Form.Label>
                    <FormControl
                      required
                      type="text"
                      id="guestEmail"
                      name="guestEmail"
                      value={bookingInfo.guestEmail}
                      placeholder="Enter your email"
                      pattern={GlobalConstants.emailRegex}
                      onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter valid email
                    </Form.Control.Feedback>
                  </Form.Group>

                  <fieldset className="mt-2">
                    <legend style={{ marginBottom: "0" }}>
                      Lodging Period
                    </legend>
                    <Row>
                      <Col md={6}>
                        <Form.Label htmlFor="checkInDate">
                          Check-In Date:
                        </Form.Label>
                        <FormControl
                          required
                          type="date"
                          id="checkInDate"
                          name="checkInDate"
                          value={bookingInfo.checkInDate}
                          placeholder="Enter check In Date"
                          min={new Date().toISOString().slice(0, 10)}
                          onChange={handleInputChange}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter valid check in date
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6}>
                        <Form.Label htmlFor="checkOutDate">
                          Check-Out Date:
                        </Form.Label>
                        <FormControl
                          required
                          type="date"
                          id="checkOutDate"
                          name="checkOutDate"
                          value={bookingInfo.checkOutDate}
                          min={calcMinimumCheckOutDate()}
                          placeholder="Enter check out Date"
                          onChange={handleInputChange}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter valid check out date
                        </Form.Control.Feedback>
                      </Col>
                      {errorMsg && (
                        <p className="error-message text-danger">{errorMsg}</p>
                      )}
                    </Row>
                  </fieldset>

                  <fieldset className="mt-2">
                    <legend style={{ marginBottom: "0" }}>
                      Number of Guests:{" "}
                    </legend>
                    <Row>
                      <Col md={6}>
                        <Form.Label htmlFor="noOfAdults">
                          Number of Adults:
                        </Form.Label>
                        <FormControl
                          required
                          type="number"
                          id="noOfAdults"
                          name="noOfAdults"
                          value={bookingInfo.noOfAdults}
                          placeholder="0"
                          min={1}
                          onChange={handleInputChange}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please select at least 1 adult.
                        </Form.Control.Feedback>
                      </Col>

                      <Col md={6}>
                        <Form.Label htmlFor="noOfChildren">
                          Children:
                        </Form.Label>
                        <FormControl
                          required
                          type="number"
                          id="noOfChildren"
                          name="noOfChildren"
                          value={bookingInfo.noOfChildren}
                          min={0}
                          onChange={handleInputChange}
                        />
                      </Col>
                    </Row>
                  </fieldset>

                  <FormGroup className="mt-3 mb-1">
                    <Button variant="btn" className="btn-hotel" type="submit">
                      Continue
                    </Button>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col md={6}>
            {isSubmitted && (
              <BookingSummary
                bookingInfo={bookingInfo}
                payment={calcPayment()}
                isFormValid={isValidated}
                onConfirm={handleBooking}
              />
            )}
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};
BookingForm.propTypes = {
  roomId: PropTypes.string,
  room: PropTypes.object,
};
export default BookingForm;
