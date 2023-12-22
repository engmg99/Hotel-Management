import { parseISO } from "date-fns";
import PropTypes from "prop-types";
import { useState } from "react";
import DateSlider from "../common/DateSlider";
import { Col, Row } from "react-bootstrap";

// const bookingTableColumns = [
//   "Booking ID",
//   "Room Id",
//   "Check-In Date",
//   "Check-Out Date",
//   "Guest Name",
//   "Guest Email",
//   "Adults",
//   "Children",
//   "Total Guests",
//   "Confirmation Code",
// ];

const BookingTable = (props) => {
  const [filteredBookings, setFilteredBookings] = useState(props.roomBookings);

  const filterRoomBooking = (startDate, endDate) => {
    let filtered = props.roomBookings;
    if (startDate && endDate) {
      filtered = filtered.filter((bookedRoom) => {
        const bookedRoomStartDate = parseISO(bookedRoom.checkInDate);
        const bookedRoomEndDate = parseISO(bookedRoom.checkOutDate);
        return (
          bookedRoomStartDate >= startDate &&
          bookedRoomEndDate <= endDate &&
          bookedRoomEndDate > startDate
        );
      });
    }
    console.log(filtered);
    setFilteredBookings(filtered);
  };

  return (
    <div className="bg-white p-4">
      <Row>
        <Col md={5}>
          <DateSlider
            onDateChange={filterRoomBooking}
            onFilterChange={filterRoomBooking}
          />
        </Col>
        <Col md={7}>
          <div
            className="scrollable-div mt-5"
            style={{ height: "300px", overflow: "scroll" }}
          >
            <div className="card-deck">
              {filteredBookings &&
                filteredBookings.map((data, index) => {
                  return (
                    <div className="card" key={index}>
                      <div className="card-body">
                        <h5 className="card-title">
                          Booking ID: {data.bookingId}
                        </h5>
                        <p className="card-text">Room ID: {data?.room?.id}</p>
                        <p className="card-text">
                          Check-in Date: {data.checkInDate}
                        </p>
                        <p className="card-text">
                          Check-out Date: {data.checkOutDate}
                        </p>
                        <p className="card-text">
                          Room Type: {data?.room?.roomType}
                        </p>
                        <p className="card-text">
                          Guest Name: {data.guestName}
                        </p>
                        <p className="card-text">
                          Guest Email: {data.guestEmail}
                        </p>
                        <p className="card-text">
                          No. of Adults: {data.noOfAdults}
                        </p>
                        <p className="card-text">
                          No. of Children: {data.noOfChildren}
                        </p>
                        <p className="card-text">
                          Total Guests: {data.totalGuests}
                        </p>
                        <p className="card-text">
                          Confirmation Code: {data.bookingConfirmationCode}
                        </p>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            props.cancelRoomBooking(data.bookingId);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          {filteredBookings.length === 0 && (
            <p> No Bookings Available for selected Dates</p>
          )}
        </Col>
      </Row>
    </div>
  );
};
BookingTable.propTypes = {
  roomBookings: PropTypes.array,
  cancelRoomBooking: PropTypes.func,
};
export default BookingTable;
