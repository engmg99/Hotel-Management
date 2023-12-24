import { useLocation } from "react-router";
import Header from "../common/Header";

const BookingSuccess = () => {
  const location = useLocation();
  const message = location.state?.message;
  const error = location.state?.error;
  return (
    <div className="container">
      <Header title="Booking Success" />
      <div className="mt-5">
        {message ? (
          <div>
            {" "}
            <h3 className="text-success">Booking Success!</h3>
            <p className="text-success">{message.toString()}</p>
          </div>
        ) : error ? (
          <div>
            <h3 className="text-danger">Error Booking Room!</h3>
            <p className="text-danger">{error.toString()}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BookingSuccess;
