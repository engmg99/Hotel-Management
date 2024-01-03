import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { FaBackward } from "react-icons/fa";
import RoomTypeSelector from "../common/RoomTypeSelector";
import { GlobalConstants } from "../constants/global-constants";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const EditRoom = () => {
  //state variable

  //used to store the roomData coming from backend, make sure to map property name with backend data correctly
  const [room, setRoom] = useState({
    roomPhoto: null,
    roomType: "",
    price: "",
  });
  const [imgPreview, setImgPreview] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // fileInput ref variable used to store a selected Img name as value and it doesn't cause a re-render
  const fileInput = useRef(null);
  const axiosPrivateHook = useAxiosPrivate();

  // as we're are navigating to this page from ExistingRoom so roomId as request param is passed and we'll receive it here using useParams()
  const { roomId } = useParams();

  // this effect mthod has the roomId as dependency so for every roomId change this method will run and cause re-render
  useEffect(() => {
    fetchRooms(roomId);
  }, [roomId]); // whenever this roomId is changes this function will run

  //get the room data by Id
  const fetchRooms = async (roomId) => {
    try {
      const roomData = await axiosPrivateHook.get(
        GlobalConstants.GET_ROOM_BY_ID(roomId)
      );
      setRoom(roomData?.data);
      setImgPreview("data:image/png;base64," + roomData?.data?.roomPhoto);
      //**IMP** here we'll receive the base64Encoded img, so to display it we have appended it with some base config "data:image/png;base64,"
    } catch (error) {
      console.error(error);
    }
  };

  //handle the roomdata input change
  const handleRoomInputChange = (e) => {
    const { name, value } = e.target; // fieldName & fieldValue
    setRoom({ ...room, [name]: value });
  };

  //handle the new image which needs to be updated
  const handleImageChange = async (e) => {
    const selectedImg = e.target.files[0];
    fileInput.current.files[0].name;
    setRoom({ ...room, roomPhoto: selectedImg }); // added the selected img in roomData
    setImgPreview(URL.createObjectURL(selectedImg)); // as image is selected from UI only so no need to convert to base64
  };

  // handle the updated data of room
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // by using this we can get the Data in backend by @RequestBody Attribute
      // const data = {
      //     roomType: roomData.roomType,
      //     price: roomData.roomPrice
      // }
      // by this we'll accept it using @RequestParam
      const formData = new FormData();
      formData.append("photo", room.roomPhoto);
      formData.append("roomType", room.roomType);
      formData.append("roomPrice", room.price);
      const response = await axiosPrivateHook.post(
        GlobalConstants.EDIT_ROOM_BY_ID(roomId),
        formData
      ); // calling updateRoom api from axios
      if (response.status === 200) {
        setSuccessMsg("Room Updated Successfully");
        const updatedRoomData = await axiosPrivateHook.get(
          GlobalConstants.GET_ROOM_BY_ID(roomId)
        ); // if success get the lastest data of that room
        setRoom(updatedRoomData?.data);
        setImgPreview(
          "data:image/png;base64," + updatedRoomData?.data?.roomPhoto
        ); // received img is of type base64encoded hence appended
        setErrorMsg("");
      } else {
        setErrorMsg("Error updating room");
      }
    } catch (error) {
      setErrorMsg(error?.response?.data);
    }
    setTimeout(() => {
      setSuccessMsg("");
      setErrorMsg("");
    }, 3000);
  };

  // if we want to convert the Image Selected from UI to base64 we can do it by below func
  // const base64 = await convertBase64(selectedImg);
  // const convertBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const fileReader = new FileReader();
  //     fileReader.readAsDataURL(file);

  //     fileReader.onload = () => {
  //       resolve(fileReader.result);
  //     };

  //     fileReader.onerror = (error) => {
  //       reject(error);
  //     };
  //   });
  // };

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
