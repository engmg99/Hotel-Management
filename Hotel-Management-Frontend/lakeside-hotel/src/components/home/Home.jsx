import HotelService from "../common/HotelService";
import Parallax from "../common/Parallax";
import RoomSearch from "../common/RoomSearch";
import RoomCarousel from "../hotelRoom/RoomCarousel";
import MainHeader from "../layouts/MainHeader";

const Home = () => {
  return (
    <section>
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
