import { useState } from "react";
import PropTypes from "prop-types";
const RoomFilter = (props) => {
  const [filter, setFilter] = useState("");

  const handleSelectChange = (e) => {
    const selectedRoomType = e.target.value;
    setFilter(selectedRoomType);
    const filteredRooms = props.data.filter((room) =>
      room.roomType.toLowerCase().includes(selectedRoomType.toLowerCase())
    );
    props.setFilteredData(filteredRooms);
  };

  const clearFilter = () => {
    setFilter("");
    props.setFilteredData(props.data);
  };

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
        <option value={""}>--Select filter--</option>
        {roomTypes &&
          roomTypes.map((type, index) => {
            return (
              <option key={index} value={String(type)}>
                {String(type)}
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
RoomFilter.propTypes = {
  data: PropTypes.array,
  setFilteredData: PropTypes.func,
};
export default RoomFilter;
