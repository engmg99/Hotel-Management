import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { getRoomById, updateRoom } from "../utils/APIFunctions";
import { Link } from "react-router-dom";
import { FaBackward } from "react-icons/fa";
import RoomTypeSelector from "../common/RoomTypeSelector";

const EditRoom = () => {
  const [room, setRoom] = useState({
    roomPhoto: null,
    roomType: "",
    price: "",
  });
  const [imgPreview, setImgPreview] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInput = useRef(null);

  const { roomId } = useParams(); // roomId as request param

  const handleRoomInputChange = (e) => {
    const { name, value } = e.target; // fieldName & fieldValue
    setRoom({ ...room, [name]: value });
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomData = await getRoomById(roomId);
        // console.log(JSON.stringify(roomData));
        setRoom(roomData);
        setImgPreview("data:image/png;base64," + roomData.roomPhoto);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRooms();
  }, [roomId]); // whenever this roomId is changes this function will run

  const handleImageChange = async (e) => {
    const selectedImg = e.target.files[0];
    fileInput.current.files[0].name;
    setRoom({ ...room, roomPhoto: selectedImg });
    const base64 = await convertBase64(selectedImg);
    setImgPreview(base64);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //   console.log(roomId + " " + JSON.stringify(room));
      const response = await updateRoom(roomId, room);
      //   console.log("response: " + JSON.stringify(response));
      if (response.status === 200) {
        setSuccessMsg("Room Updated Successfully");
        const updatedRoomData = await getRoomById(roomId);
        setRoom(updatedRoomData);
        setImgPreview(updatedRoomData.roomPhoto);
        setErrorMsg("");
      } else {
        setErrorMsg("Error updating room");
      }
    } catch (error) {
      setErrorMsg(error.message);
    }
    setTimeout(() => {
      setSuccessMsg("");
      setErrorMsg("");
    }, 3000);
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <React.Fragment>
      <section className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <h2 className="mt-5 mb-2">Edit Room</h2>

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
                    newRoom={room}
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
                  value={room.price}
                  onChange={handleRoomInputChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="roomPhoto" className="form-label">
                  Room Photo
                </label>

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

              <div className="d-gird d-md-flex mt-2">
                <Link
                  to={"/existing-rooms"}
                  className="btn btn-outline-info ml-5"
                >
                  <FaBackward />
                </Link>
                <button className="btn btn-outline-primary ml-5 mx-2">
                  Edit Room
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default EditRoom;
