import { useState } from "react";
import PropTypes from "prop-types";

//here we're receiving the rooms list and setFilteredRooms state Function, we need to set the rooms based on selected roomType
const RoomFilter = (props) => {
  //state variable
  const [filter, setFilter] = useState("");

  //method used to make the selected roomType as filter and set the roomtype applied with filter to the props state function
  const handleSelectChange = (e) => {
    const selectedRoomType = e.target.value; // selected RoomType
    setFilter(selectedRoomType);
    const filteredRooms = props.data.filter((room) =>
      room.roomType.toLowerCase().includes(selectedRoomType.toLowerCase())
    );
    props.setFilteredData(filteredRooms);
  };

  //this method is used to remove all the filters and setFilteredData to the roomList which contain all rooms
  const clearFilter = () => {
    setFilter("");
    props.setFilteredData(props.data);
  };

  //creating the distinct roomTypes array
  const roomTypes = ["", ...new Set(props.data.map((room) => room.roomType))];

  return (
    <div className="input-group mb-3">
      <span className="input-group-text" id="room-type-filter">
        Filter Rooms By Type
      </span>
      <select
        name=""
        id=""
        className="form-select"
        value={filter}
        onChange={handleSelectChange}
      >
        <option value={""}>--Select Filter--</option>
        {roomTypes &&
          roomTypes.map((roomType, index) => {
            return (
              <option key={index} value={String(roomType)}>
                {String(roomType)}
              </option>
            );
          })}
      </select>
      <button className="btn btn-hotel" type="button" onClick={clearFilter}>
        Clear Filters
      </button>
    </div>
  );
};
//validating Props received
RoomFilter.propTypes = {
  data: PropTypes.array,
  setFilteredData: PropTypes.func,
};
export default RoomFilter;
