import { useParams } from "react-router";
import BookingForm from "./BookingForm";
import { useState } from "react";
import { axiosGet } from "../utils/APIFunctions";
import { GlobalConstants } from "../constants/global-constants";
import { Col, Row, Container } from "react-bootstrap";
import {
  FaCar,
  FaCocktail,
  FaParking,
  FaTshirt,
  FaTv,
  FaUtensils,
  FaWifi,
} from "react-icons/fa";
import RoomCarousel from "../hotelRoom/RoomCarousel";

const Checkout = () => {
  const [existingRoom, setExistingRoom] = useState({
    roomPhoto: null,
    roomType: "",
    price: "",
  });

  // route params
  const { roomId } = useParams(); // gets the current room id which user wants to book

  // method gets the current roomId info
  const getRoomPriceById = async (roomId) => {
    try {
      const response = await axiosGet(GlobalConstants.GET_ROOM_BY_ID(roomId));
      setExistingRoom(response);
    } catch (error) {
      throw new Error(error);
    }
  };

  // fetch data
  // useEffect(() => {
  //   getRoomPriceById(roomId);
  // }, [roomId]);

  getRoomPriceById(roomId); // calls the above method and gets the Room Price

  return (
    <div className="mt-5 mb-5">
      <Container>
        <Row>
          <Col md={4}>
            <div style={{ borderRadius: "20px" }}>
              <img
                src={`data:image/jpeg;base64,${existingRoom.roomPhoto}`}
                alt="Room Photo"
                width="100%"
                height="220px"
              />
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>Room Type:</th>
                    <td>{existingRoom?.roomType}</td>
                  </tr>
                  <tr>
                    <th>Price Per Night:</th>
                    <td>${existingRoom?.price}</td>
                  </tr>
                  <tr>
                    <th>Room Service:</th>
                    <td>
                      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                        <li>
                          <FaWifi />
                          &nbsp;Wifi
                        </li>
                        <li>
                          <FaTv />
                          &nbsp;Netflix Premium
                        </li>
                        <li>
                          <FaUtensils />
                          &nbsp;Breakfast
                        </li>
                        <li>
                          <FaCocktail />
                          &nbsp;Mini bar refreshment
                        </li>
                        <li>
                          <FaCar />
                          &nbsp;Car Service
                        </li>
                        <li>
                          <FaParking />
                          &nbsp;Parking Space
                        </li>
                        <li>
                          <FaTshirt />
                          &nbsp;Laundry
                        </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Col>
          <BookingForm roomId={roomId} room={existingRoom} />
        </Row>
        <Row>
          <RoomCarousel />
        </Row>
      </Container>
    </div>
  );
};

export default Checkout;
