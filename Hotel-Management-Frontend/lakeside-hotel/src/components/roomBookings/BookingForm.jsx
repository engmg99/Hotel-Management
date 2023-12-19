import React, { useEffect, useState } from "react";
import { bookRoom, getRoomById } from "../utils/APIFunctions";
import { useNavigate, useParams } from "react-router";
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

const BookingForm = () => {
  // State Variables
  const [isValidated, setIsValidated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [roomPrice, setRoomPrice] = useState(0);
  const [bookingInfo, setBookingInfo] = useState({
    guestName: "",
    guestEmail: "",
    checkInDate: "",
    checkOutDate: "",
    noOfAdults: "",
    noOfChildren: "",
  });
  // const [roomInfo, setRoomInfo] = useState({
  //   photo: "",
  //   roomType: "",
  //   price: "",
  // });

  // route params
  const { roomId } = useParams();

  // navigation
  const navigate = useNavigate();

  // methods
  const handleInputChange = (e) => {
    setBookingInfo({
      ...bookingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const getRoomPriceById = async (roomId) => {
    try {
      const response = await getRoomById(roomId);
      setRoomPrice(response.price);
      console.log(response.price);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    getRoomPriceById(roomId);
  }, [roomId]);

  const calcPayment = () => {
    const checkInDate = moment(bookingInfo.checkInDate);
    console.log(checkInDate);
    const checkOutDate = moment(bookingInfo.checkOutDate);
    const totalDays = checkOutDate.diff(checkInDate);
    console.log("totalDays", totalDays);
    console.log("roomPrice", roomPrice);
    const price = roomPrice ? roomPrice : 0;
    console.log("price", price);
    return totalDays * price;
  };

  const isGuestCountValid = () => {
    const adultCount = parseInt(bookingInfo.noOfAdults);
    const childrenCount = parseInt(bookingInfo.noOfChildren);
    const totalCount = adultCount + childrenCount;
    return totalCount >= 1 && adultCount >= 1;
  };

  const isCheckOutDateValid = () => {
    if (
      !moment(bookingInfo.checkOutDate).isSameOrAfter(
        moment(bookingInfo.checkInDate)
      )
    ) {
      setErrorMsg("Check-Out Date must come before Check-In Date");
      return false;
    } else {
      setErrorMsg("");
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (
      form.checkValidity() === false ||
      !isGuestCountValid() ||
      !isCheckOutDateValid()
    ) {
      e.stopPropagation();
    } else {
      setIsSubmitted(true);
    }
    setIsValidated(true);
  };

  const handleBooking = async () => {
    try {
      const confirmCode = await bookRoom(roomId, bookingInfo);
      setIsSubmitted(true);
      navigate("/booking-success", { state: { message: confirmCode } });
    } catch (error) {
      setErrorMsg(error.message);
      navigate("/booking-success", { state: { message: errorMsg } });
    }
  };
  return (
    <React.Fragment>
      <Container className="mb-5">
        <Row>
          <Col md={6}>
            <Card>
              <CardBody>
                <CardTitle>Reserve Room</CardTitle>
                <Form
                  noValidate
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
                      onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter your full name
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
                      onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter your email
                    </Form.Control.Feedback>
                  </Form.Group>

                  <fieldset style={{ border: "2px" }}>
                    <legend>Lodging Period</legend>
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

                  <fieldset>
                    <legend>Number of Guests: </legend>
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
                          placeholder="0"
                          onChange={handleInputChange}
                        />
                      </Col>
                    </Row>
                  </fieldset>

                  <FormGroup className="mt-2 mb-2">
                    <Button className="btn-hotel" type="submit">
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

export default BookingForm;
