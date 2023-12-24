import { useLocation } from "react-router";
import HotelService from "../common/HotelService";
import Parallax from "../common/Parallax";
import RoomSearch from "../common/RoomSearch";
import RoomCarousel from "../hotelRoom/RoomCarousel";
import MainHeader from "../layouts/MainHeader";

const Home = () => {
  const location = useLocation();
  const message = location.state && location.state.message;
  const currentUser = localStorage.getItem("userId");

  return (
    <section>
      {message && <p className="text-warning px-5">{message}</p>}
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
