import React, { useRef, useState } from "react";
import { addNewRoom } from "../utils/APIFunctions";
import RoomTypeSelector from "../common/RoomTypeSelector";
import { Link } from "react-router-dom";
import { FaBackward } from "react-icons/fa";

const AddRoom = () => {
  const [newRoom, setNewRoom] = useState({
    photo: null,
    roomType: "",
    price: "",
  });
  const [imgPreview, setImgPreview] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInput = useRef(null);

  const handleRoomInputChange = (e) => {
    const name = e.target.name; // fieldName
    let value = e.target.value; // fieldValue
    if (name === "price") {
      if (!isNaN(value)) {
        parseInt(value);
      } else {
        value = "";
      }
    }
    setNewRoom({ ...newRoom, [name]: value });
  };

  const handleImageChange = (e) => {
    const selectedImg = e.target.files[0];
    setNewRoom({ ...newRoom, photo: selectedImg });
    setImgPreview(URL.createObjectURL(selectedImg));
    fileInput.current.files[0].name;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(newRoom.photo, newRoom.roomType, newRoom.price);
      const success = await addNewRoom(
        newRoom.photo,
        newRoom.roomType,
        newRoom.price
      );
      // console.log("success: " + success);
      if (success !== undefined) {
        setSuccessMsg("New Room Added Successfully");
        resetForm();
      } else {
        setErrorMsg("Error while adding room");
      }
    } catch (error) {
      setErrorMsg(error.message);
    }
    setTimeout(() => {
      setSuccessMsg("");
      setErrorMsg("");
    }, 3000);
  };

  const resetForm = () => {
    setNewRoom({
      photo: null,
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

            {successMsg && (
              <div className="alert alert-success fade show">{successMsg}</div>
            )}

            {errorMsg && (
              <div className="alert alert-danger fade show">{errorMsg}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="roomType" className="form-label">
                  Room Type
                </label>

                <div>
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
                <label htmlFor="photo" className="form-label">
                  Room Photo
                </label>

                <input
                  className="form-control"
                  required
                  id="photo"
                  name="photo"
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
                <Link
                  to={"/existing-rooms"}
                  className="btn btn-outline-info ml-5"
                >
                  <FaBackward />
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
