import { useEffect, useState } from "react";
import { getRoomTypes } from "../utils/APIFunctions";
import PropTypes from "prop-types";

const RoomTypeSelector = (props) => {
  const [roomTypes, setRoomTypes] = useState([""]);
  const [showNewRoomTypeInput, setShowNewRoomTypeInput] = useState(false);
  const [newRoomType, setNewRoomType] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  //get all the roomTypes from backend API
  useEffect(() => {
    getRoomTypes().then((data) => {
      setRoomTypes(data);
    });
  }, []);

  const handleNewRoomTypeInputChange = (e) => {
    setNewRoomType(e.target.value);
  };

  const handleAddNewRoomType = () => {
    if (newRoomType !== "") {
      setRoomTypes([...roomTypes, newRoomType]);
      props.newRoom.roomType = newRoomType;
      setNewRoomType("");
      setShowNewRoomTypeInput(false);
    } else {
      setErrorMsg("Value cannot be empty.");
    }
    setTimeout(() => {
      setErrorMsg("");
    }, 1000);
  };
  return (
    <>
      <div>
        {errorMsg && (
          <div className="alert alert-danger fade show">{errorMsg}</div>
        )}
        <select
          className="form-control mb-2"
          name="roomType"
          id="roomType"
          value={props.newRoom.roomType}
          required
          onChange={(e) => {
            if (e.target.value === "Add New Room Type") {
              props.newRoom.roomType = "";
              setShowNewRoomTypeInput(true);
            } else {
              props.handleRoomInputChange(e);
              setShowNewRoomTypeInput(false);
            }
          }}
        >
          <option value={""}>--Select a room type--</option>
          <option value={"Add New Room Type"}>Add New Room Type</option>
          {roomTypes.length > 0 &&
            roomTypes.map((type, index) => {
              return (
                <option key={index} value={type}>
                  {type}
                </option>
              );
            })}
        </select>
        {showNewRoomTypeInput && (
          <div className="input-group">
            <input
              className="form-control"
              type="text"
              placeholder="Enter a new room type"
              onChange={handleNewRoomTypeInputChange}
            />
            <button
              className="btn btn-hotel"
              type="button"
              onClick={handleAddNewRoomType}
            >
              Add
            </button>
          </div>
        )}
      </div>
    </>
  );
};
RoomTypeSelector.propTypes = {
  newRoom: PropTypes.object,
  handleRoomInputChange: PropTypes.func,
};
export default RoomTypeSelector;
