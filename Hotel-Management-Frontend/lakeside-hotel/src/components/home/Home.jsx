import { useLocation } from "react-router";
import HotelService from "../common/HotelService";
import Parallax from "../common/Parallax";
import RoomSearch from "../common/RoomSearch";
import RoomCarousel from "../hotelRoom/RoomCarousel";
import MainHeader from "../layouts/MainHeader";
import { useEffect, useState } from "react";

const Home = () => {
  const location = useLocation();
  const [message, setMessage] = useState("");
  useEffect(() => {
    setMessage((location.state && location.state.message) || null);
    return () => {
      if (location.state) {
        location.state.message = "";
      }
    };
  }, [location]);
  const currentUser = localStorage.getItem("userId");

  return (
    <section>
      {message && <h6 className="text-danger text-center">{message}</h6>}
      {currentUser && (
        <h6 className="text-success text-center">
          You are logged in as {currentUser}
        </h6>
      )}
      <MainHeader />
      <div className="container">
        <RoomSearch />
        <RoomCarousel />
        <Parallax />
        <HotelService />
        <Parallax />
      </div>
    </section>
  );
};

export default Home;
