import { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Button } from "react-bootstrap";

const BookingSummary = ({ bookingInfo, payment, isFormValid, onConfirm }) => {
  const checkInDate = moment(bookingInfo.checkInDate);
  const checkOutDate = moment(bookingInfo.checkOutDate);
  const noOfDays = checkOutDate.diff(checkInDate, "days");
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleConfirmBooking = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsBookingConfirmed(true);
    }, 3000);
    setTimeout(() => {
      onConfirm();
    }, 6000);
  };

  return (
    <div className="card card-body" style={{ height: "97%" }}>
      <h2 className="text-center">Reservation Summary</h2>
      <p>
        Name: <strong>{bookingInfo.guestName}</strong>
      </p>
      <p>
        Email: <strong>{bookingInfo.guestEmail}</strong>
      </p>
      <p>
        Check-In Date:{" "}
        <strong>{moment(bookingInfo.checkInDate).format("MMM Do YYYY")}</strong>
      </p>
      <p>
        Check-Out Date:{" "}
        <strong>
          {moment(bookingInfo.checkOutDate).format("MMM Do YYYY")}
        </strong>
      </p>
      <p>
        Number of Days Booked: <strong>{noOfDays}</strong>
      </p>
      <div>
        <h5 className="mb-0">Total Guests</h5>
        <strong>
          Adult{bookingInfo.noOfAdults > 1 ? "s " : ""} :{" "}
          {bookingInfo.noOfAdults}
        </strong>
        <br />
        <strong> Children: {bookingInfo.noOfChildren}</strong>
      </div>
      {payment > 0 ? (
        <>
          <h2 className="mt-2 mb-4">Total Payment: ${payment}</h2>

          {isFormValid && !isBookingConfirmed ? (
            <Button variant="success" onClick={handleConfirmBooking}>
              {isProcessingPayment ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm mr-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  &nbsp; Booking Confirmed, redirecting to payment ....
                </>
              ) : (
                "Confirm Booking and proceed to payment"
              )}
            </Button>
          ) : isBookingConfirmed ? (
            <div className="d-flex justify-content-center align-items-center">
              <div className="spinner-border text-primary" role="status"></div>
              <span className="sr-only">&nbsp; Loading</span>
            </div>
          ) : null}
        </>
      ) : (
        <p className="text-danger"> Error while calculating payment.</p>
      )}
    </div>
  );
};
BookingSummary.propTypes = {
  bookingInfo: PropTypes.object,
  payment: PropTypes.number,
  isFormValid: PropTypes.bool,
  onConfirm: PropTypes.func,
};
export default BookingSummary;
