// import React from "react";
import { Container } from "react-bootstrap";
import Header from "../common/Header";
import BookingTable from "./BookingTable";
import { GlobalConstants } from "../constants/global-constants";
import { useEffect, useState } from "react";
import Spinner from "../layouts/Spinner";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Bookings = () => {
  const [roomBookings, setRoomBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const axiosPrivateHook = useAxiosPrivate();

  const getAllRoomBookings = async () => {
    setIsLoading(true);
    try {
      const result = await axiosPrivateHook.get(
        GlobalConstants.GET_ALL_BOOKING
      );
      console.log(result?.data);
      setRoomBookings(result?.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setErrorMsg(error?.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllRoomBookings();
  }, []);

  const cancelRoomBooking = async (bookingId) => {
    setIsLoading(true);
    try {
      await axiosPrivateHook.delete(
        GlobalConstants.CANCEL_ROOM_BOOKING_BY_ID(bookingId)
      );
      const roomBookingList = await axiosPrivateHook.get(
        GlobalConstants.GET_ALL_BOOKING
      );
      setRoomBookings(roomBookingList?.data);
      setIsLoading(false);
    } catch (error) {
      setErrorMsg(error?.response?.data);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container style={{ backgroundColor: "white", marginBottom: "5rem" }}>
      {errorMsg && (
        <div className="alert alert-danger fade show">
          {errorMsg.toString()}
        </div>
      )}
      <Header title="Room Bookings" />
      <BookingTable
        roomBookings={roomBookings}
        cancelRoomBooking={cancelRoomBooking}
      />
    </Container>
  );
};

export default Bookings;
