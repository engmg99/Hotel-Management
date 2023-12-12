import React, { useRef, useState } from "react";
import { addNewRoom } from "../utils/APIFunctions";
import RoomTypeSelector from "../common/RoomTypeSelector";
import { Link } from "react-router-dom";
import { FaBackward } from "react-icons/fa";

const AddRoom = () => {
  // newRoom state variable to store new room data
  const [newRoom, setNewRoom] = useState({
    roomPhoto: null,
    roomType: "",
    price: "",
  });

  // imgPreview state variable to store the URl of selected image
  const [imgPreview, setImgPreview] = useState("");

  // successMsg state variable to store success msg after submiting form
  const [successMsg, setSuccessMsg] = useState("");

  // errorMsg state variable to store error msg after submiting form
  const [errorMsg, setErrorMsg] = useState("");

  // fileInput ref variable used to store a value and it doesn't cause a re-render
  const fileInput = useRef(null);

  // method to handle room data values
  const handleRoomInputChange = (e) => {
    const name = e.target.name; // fieldName
    let value = e.target.value; // fieldValue
    //convert the value to Int if field is price
    if (name === "price") {
      !isNaN(value) ? parseInt(value) : (value = "");
    }
    setNewRoom({ ...newRoom, [name]: value }); // set room data in state variable
  };

  //method used to handle the selected Image
  const handleImageChange = (e) => {
    const selectedImg = e.target.files[0];
    setNewRoom({ ...newRoom, roomPhoto: selectedImg });
    setImgPreview(URL.createObjectURL(selectedImg));
    fileInput.current.files[0].name; // set the selected fileName value in ref variable
  };

  //method for add new room submit request
  const handleSubmit = async (e) => {
    // if this is not added then after clicking submit button the form will refresh automatically i.e. defaultBehaviour
    e.preventDefault();
    try {
      const success = await addNewRoom(newRoom); //calling axios method created in APIFunction file
      if (success !== undefined) {
        setSuccessMsg("New Room Added Successfully");
        resetForm();
      } else {
        setErrorMsg("Error while adding room");
      }
    } catch (error) {
      setErrorMsg(error.message);
    }
    // this below timeOut will hide the Success and Error Popups in 3sec
    setTimeout(() => {
      setSuccessMsg("");
      setErrorMsg("");
    }, 3000);
  };

  const resetForm = () => {
    setNewRoom({
      roomPhoto: null,
      roomType: "",
      price: "",
    });
    setImgPreview("");
    setErrorMsg("");
    fileInput.current.value = null;
  };

  return (
    <React.Fragment>
      <section className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <h2 className="mt-5 mb-2">Add New Room</h2>

            {/* show the success messgae popup, successMsg variable coming from State */}
            {successMsg && (
              <div className="alert alert-success fade show">{successMsg}</div>
            )}

            {/* show the error messgae popup, errorMsg variable coming from State */}
            {errorMsg && (
              <div className="alert alert-danger fade show">{errorMsg}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="roomType" className="form-label">
                  Room Type
                </label>
                <div>
                  {/* RoomTypeSelector a dropdown component created as a separate component  in which we passed
                  handleRoomInputChange function
                  newRoom state variable consisting of new room data*/}
                  <RoomTypeSelector
                    handleRoomInputChange={handleRoomInputChange}
                    newRoom={newRoom}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Room Price
                </label>
                <input
                  className="form-control"
                  required
                  id="price"
                  name="price"
                  type="number"
                  value={newRoom.price}
                  onChange={handleRoomInputChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="roomPhoto" className="form-label">
                  Room Photo
                </label>

                {/* here below Input type is file and it is uncontrolled component so to hanlde its value we've to useRef */}
                <input
                  className="form-control"
                  required
                  id="roomPhoto"
                  name="roomPhoto"
                  type="file"
                  ref={fileInput}
                  onChange={handleImageChange}
                />

                {imgPreview && (
                  <img
                    src={imgPreview}
                    alt="Preview Room Photo"
                    style={{ maxWidth: "400px", maxHeight: "400px" }}
                    className="mt-3"
                  />
                )}
              </div>

              <div className="d-gird gap-2 d-md-flex mt-2">
                {/* Added a Link from react-router-dom */}
                <Link
                  to={"/existing-rooms"}
                  className="btn btn-outline-info ml-5"
                >
                  <FaBackward />
                  {/* This is used from React Icons */}
                </Link>
                <button className="btn btn-outline-primary ml-5">
                  Add Room
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default AddRoom;
