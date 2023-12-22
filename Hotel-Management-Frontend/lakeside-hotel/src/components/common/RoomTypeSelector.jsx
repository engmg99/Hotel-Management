import { useEffect, useState } from "react";
import { axiosGet } from "../utils/APIFunctions";
import PropTypes from "prop-types";
import { GlobalConstants } from "../constants/global-constants";

// as this component is called from AddRoom with some data so we'll handle that by adding props in function
const RoomTypeSelector = (props) => {
  // state variables
  const [roomTypes, setRoomTypes] = useState([""]);
  const [showNewRoomTypeInput, setShowNewRoomTypeInput] = useState(false);
  const [newRoomType, setNewRoomType] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  //get all the roomTypes from backend API
  //this method run only on first render as empty array is passed
  useEffect(() => {
    //axios get method which get all existing room types and set it in the state variable
    // Get all the room types from DB
    axiosGet(GlobalConstants.GET_ALL_ROOM_TYPES).then((data) => {
      setRoomTypes(data);
    });
  }, []);

  //handle the input data of new room type added
  const handleNewRoomTypeInputChange = (e) => {
    setNewRoomType(e.target.value);
  };

  // handle the newly added roomType
  const handleAddNewRoomType = () => {
    if (newRoomType !== "") {
      setRoomTypes([...roomTypes, newRoomType]); // add the new Room type in roomTypes list and also set it
      props.newRoom.roomType = newRoomType; // set the newRoomType to the roomData received from Parent in props
      setNewRoomType(""); // after setting it, clear the field value and hide it
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
        {/* dropdown with value as received from props roomData */}
        <select
          className="form-control"
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
          <div className="input-group mt-2">
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

//Props validation
RoomTypeSelector.propTypes = {
  newRoom: PropTypes.object,
  handleRoomInputChange: PropTypes.func,
};

export default RoomTypeSelector;
