import { useParams } from "react-router";
import BookingForm from "./BookingForm";
import { useState } from "react";
import { axiosGet } from "../utils/APIFunctions";
import { GlobalConstants } from "../constants/global-constants";

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
      <BookingForm roomId={roomId} room={existingRoom} />
    </div>
  );
};

export default Checkout;
