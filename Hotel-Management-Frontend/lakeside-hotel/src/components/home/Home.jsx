import HotelService from "../common/HotelService";
import Parallax from "../common/Parallax";
import MainHeader from "../layouts/MainHeader";

const Home = () => {
  return (
    <section>
      <MainHeader />
      <section className="container">
        <Parallax />
        <HotelService />
        <Parallax />
      </section>
    </section>
  );
};

export default Home;
