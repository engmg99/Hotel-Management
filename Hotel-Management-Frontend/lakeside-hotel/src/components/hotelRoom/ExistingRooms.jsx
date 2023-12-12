import React, { useEffect, useState } from "react";
import { deleteRoom, getAllRooms } from "../utils/APIFunctions";
import { Col, Row } from "react-bootstrap";
import RoomFilter from "../common/RoomFilter";
import RoomPaginator from "../common/RoomPaginator";
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const ExistingRooms = () => {
  //state variables

  // store all rooms as an array
  const [rooms, setRooms] = useState([]);
  // store the current activated page
  const [currentPage, setCurrentPage] = useState(1);
  // a variable which store the roomsPerPage
  const [roomsPerPage] = useState(8);
  // store the status of isLoading
  const [isLoading, setIsLoading] = useState(false);
  // store the filtered rooms as an array
  const [filteredRooms, setFilteredRooms] = useState([]);
  // store the success and error msg
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  //every first render, gets all the rooms
  useEffect(() => {
    fetchRooms();
  }, []);

  // method used to get all rooms from axios request
  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const result = await getAllRooms();
      setRooms(result);
      setIsLoading(false);
    } catch (error) {
      setErrorMsg(error);
    }
  };

  //after fetching the rooms i tried to set the received roomList to the filteredRooms state variable i.e. setFilteredRooms(rooms);
  //but the output was not re-rendering and the room list was not visible so to fix that issue i used a useEffect hook
  //in which rooms depency is passed which means whenever the rooms is change this useEffect will re-render and set the filteredRooms
  useEffect(() => {
    setFilteredRooms(rooms); // adding all the rooms to the filteredRoom initially
  }, [rooms]);
  const lastRoomIndex = currentPage * roomsPerPage; // 1*8=8, 2*8=16
  const firstRoomIndex = lastRoomIndex - roomsPerPage; // 8-8, 16-8=8
  const currentRooms = filteredRooms.slice(firstRoomIndex, lastRoomIndex); //slice(0,8), slice(8,16)

  //paginator logic which calculate the total number of pages based on filteredRoomList and noOfRooms per page
  const calcTotalPages = (filteredRooms, roomsPerPage) => {
    return Math.ceil(filteredRooms.length / roomsPerPage);
  };

  // this method sets the current page  on which user is and pageNo is coming from RoomPaginator component
  const handlePaginationClick = (pageNo) => {
    setCurrentPage(pageNo);
  };

  //delete the room by id
  const handleDelete = async (roomId) => {
    try {
      const result = await deleteRoom(roomId); // calling delete API from axios
      if (result === "") {
        setSuccessMsg(`Room No ${roomId} was deleted.`);
        fetchRooms();
      } else {
        console.error(`Error Deleting Room: ${result.message}`);
      }
    } catch (error) {
      setErrorMsg("Error: ", error);
    }
    setTimeout(() => {
      setSuccessMsg("");
      setErrorMsg("");
    }, 1500);
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <div className="d-flex justify-content-center mt-5">
          Loading Rooms...
        </div>
      ) : (
        <React.Fragment>
          {/* this is basically <> </> */}
          <section className="mt-5 mb-5 container">
            {successMsg && (
              <div className="alert alert-success fade show">{successMsg}</div>
            )}

            {errorMsg && (
              <div className="alert alert-danger fade show">{errorMsg}</div>
            )}
            <div className="d-flex justify-content-between mb-3 mb-5">
              <h2>Existing Rooms</h2>
            </div>
            <Row>
              {/*this Row and Col is the react bootstrap component */}
              <Col md={6} className="mb-3 mb-md-0">
                {/* Room filter component which sends the rooms list and setFilteredRooms state Function whose state will be set in this RoomFilter comp*/}
                <RoomFilter data={rooms} setFilteredData={setFilteredRooms} />
              </Col>
              <Col md={6} className="d-flex justify-content-end">
                {/* Add a Navigation link to add room */}
                <Link to={"/add-room"} className="mt-2">
                  <FaPlus />
                  Add Room
                </Link>
              </Col>
            </Row>
            <table className="table table-bordered table-hover">
              <thead>
                <tr className="text-center">
                  <th>S.No</th>
                  <th>Room Type</th>
                  <th>Room Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRooms.map((room, index) => {
                  return (
                    <tr key={index} className="text-center">
                      <td>{index + 1}</td>
                      <td>{room.roomType}</td>
                      <td>${room.price}</td>
                      <td>
                        <Link to={`/edit-room/${room.id}`}>
                          <span className="btn btn-info btn-sm">
                            <FaEye />
                          </span>
                          <span className="btn btn-warning btn-sm mx-3">
                            <FaEdit />
                          </span>
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            //correct way add a arrow function
                            handleDelete(room.id);
                          }}
                          //onClick={handleDelete(room.id)} // this is the wrong way as this will be invoked on every re-render
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* RoomPaginator component in which we're passing the current page 1 is Default and totalNoOfPages which are further calculated*/}
            <RoomPaginator
              currentPage={currentPage}
              totalPages={calcTotalPages(filteredRooms, roomsPerPage)}
              onPageChange={handlePaginationClick}
            />
          </section>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ExistingRooms;
