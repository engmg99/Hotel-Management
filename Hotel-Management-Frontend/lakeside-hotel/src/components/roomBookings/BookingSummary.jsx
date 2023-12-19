import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { useNavigate } from "react-router";
import { Button } from "react-bootstrap";

const BookingSummary = ({ bookingInfo, payment, isFormValid, onConfirm }) => {
  const checkInDate = moment(bookingInfo.checkInDate);
  const checkOutDate = moment(bookingInfo.checkOutDate);
  const noOfDays = checkOutDate.diff(checkInDate, "days");
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isBookingConfirmed) {
      navigate("/booking-success");
    }
  }, [isBookingConfirmed, navigate]);

  const handleConfirmBooking = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsBookingConfirmed(true);
      onConfirm();
    }, 3000);
  };

  return (
    <div className="card card-body mt-5">
      <h4>Reservation Summary</h4>
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
        <h5>Total Guests</h5>
        <strong>
          Adult{bookingInfo.noOfAdults > 1 ? "s " : ""} :{" "}
          {bookingInfo.noOfAdults}
        </strong>
        <br />
        <strong> Children: {bookingInfo.noOfChildren}</strong>
      </div>
      {payment > 0 ? (
        <>
          <p>
            Total Payment: <strong>${payment}</strong>
          </p>

          {isFormValid && !isBookingConfirmed ? (
            <Button variant="success" onClick={handleConfirmBooking}>
              {isProcessingPayment ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm mr-2"
                    role="status"
                    aria-hidden="true"
                  >
                    Booking Confirmed, redirecting to payment ....
                  </span>
                </>
              ) : (
                "Confirm Booking and proceed to payment"
              )}
            </Button>
          ) : isBookingConfirmed ? (
            <div className="d-flex justify-content-center align-items-center">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading</span>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <p className="text-danger">
          {" "}
          Check-Out date must be after Check-In date.
        </p>
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
