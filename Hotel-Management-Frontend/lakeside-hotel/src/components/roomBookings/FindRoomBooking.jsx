import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Spinner from "../layouts/Spinner";
import { GlobalConstants } from "../constants/global-constants";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const FindRoomBooking = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [bookingInfo, setBookingInfo] = useState({
    bookingId: 0,
    room: { id: 0 },
    bookingConfirmationCode: "",
    roomNumber: "",
    checkInDate: "",
    checkOutDate: "",
    guestName: "",
    guestEmail: "",
    noOfAdults: 0,
    noOfChildren: 0,
    totalGuests: 0,
  });

  const clearBookingInfo = {
    bookingId: 0,
    room: { id: 0 },
    bookingConfirmationCode: "",
    roomNumber: "",
    checkInDate: "",
    checkOutDate: "",
    guestName: "",
    guestEmail: "",
    noOfAdults: 0,
    noOfChildren: 0,
    totalGuests: 0,
  };

  const axiosPrivateHook = useAxiosPrivate();

  const handleInputChange = (e) => {
    setConfirmationCode(e.target.value);
  };

  const findRoomById = async (e) => {
    console.log("CC", confirmationCode);
    console.log("BCC", bookingInfo.bookingConfirmationCode);
    e.preventDefault;
    if (confirmationCode === bookingInfo.bookingConfirmationCode) {
      return;
    }
    setIsLoading(true);
    try {
      const roomInfo = await axiosPrivateHook.get(
        GlobalConstants.GET_ROOM_BOOKING_BY_CODE(confirmationCode)
      );
      resetStates();
      if (roomInfo?.data) {
        console.log(roomInfo?.data);
        setBookingInfo(roomInfo?.data);
        setIsDeleted(false);
      } else {
        setErrorMsg("No Bookings found for this code");
        setBookingInfo({ bookingConfirmationCode: confirmationCode });
      }
    } catch (error) {
      setIsLoading(false);
      setBookingInfo(clearBookingInfo);
      console.log(error);
      setErrorMsg(error?.response?.data);
    }
  };

  const cancelRoomBooking = async (bookingId) => {
    setIsLoading(true);
    try {
      await axiosPrivateHook.delete(
        GlobalConstants.CANCEL_ROOM_BOOKING_BY_ID(bookingId)
      );
      setIsDeleted(true);
      setBookingInfo(clearBookingInfo);
      resetStates();
    } catch (error) {
      setErrorMsg(error?.response?.data);
      setIsLoading(false);
    }
  };

  const handleCancelBooking = () => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to cancel this booking?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            cancelRoomBooking(bookingInfo?.bookingId);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const resetStates = () => {
    setIsLoading(false);
    setErrorMsg("");
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <React.Fragment>
      <Container className="mt-5 d-flex flex-column justify-content-center align-items-center">
        <h2>Find My Booking</h2>
        <div className="mt-3 input-group" style={{ width: "60%" }}>
          <input
            required
            type="number"
            id="bookingCode"
            name="bookingCode"
            value={confirmationCode}
            placeholder="Enter the booking confirmation code"
            className="form-control"
            onChange={handleInputChange}
          />
          <button className="btn btn-hotel" onClick={findRoomById}>
            Find Booking
          </button>
        </div>
        <div className="col-md-7 mt-4 mb-5">
          {errorMsg ? (
            <div className="alert alert-danger fade show">
              {errorMsg.toString()}
            </div>
          ) : bookingInfo.bookingConfirmationCode ? (
            <>
              <h3>Booking Information</h3>
              <p>
                Booking Confirmation Code: {bookingInfo.bookingConfirmationCode}
              </p>
              <p>Room Number: {bookingInfo?.room?.id}</p>
              <p>
                Check In Date:{" "}
                {bookingInfo?.checkOutDate
                  .subtract(1, "month")
                  .format("MMM Do, YYYY")}
              </p>
              <p>
                Check Out Date:{" "}
                {bookingInfo?.checkOutDate
                  .subtract(1, "month")
                  .format("MMM Do, YYYY")}
              </p>
              <p>Room Type: {bookingInfo?.room?.roomType}</p>
              <p>Name: {bookingInfo?.guestName}</p>
              <p>Email: {bookingInfo?.guestEmail}</p>
              <p>Adults: {bookingInfo?.noOfAdults}</p>
              <p>Children: {bookingInfo?.noOfChildren}</p>
              <p>Total Guests: {bookingInfo?.totalGuests}</p>
              {!isDeleted && (
                <button
                  className="btn btn-danger"
                  onClick={handleCancelBooking}
                >
                  {" "}
                  Cancel Booking
                </button>
              )}
            </>
          ) : !isDeleted ? (
            <p className="text-center">Find booking...</p>
          ) : (
            <div className="alert alert-success mt-3" role="alert">
              Booking has been cancelled successfully!
            </div>
          )}
        </div>
      </Container>
    </React.Fragment>
  );
};

export default FindRoomBooking;
