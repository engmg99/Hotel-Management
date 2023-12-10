import React, { useEffect, useState } from "react";
import { deleteRoom, getAllRooms } from "../utils/APIFunctions";
import { Col, Row } from "react-bootstrap";
import RoomFilter from "../common/RoomFilter";
import RoomPaginator from "../common/RoomPaginator";
import { FaEdit, FaEye, FaPlus, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const ExistingRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoomType] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

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

  useEffect(() => {
    if (selectedRoomType === "") {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter(
        (room) => room.roomType === selectedRoomType
      );
      setFilteredRooms(filtered);
    }
    setCurrentPage(1);
  }, [rooms, selectedRoomType]);

  const calcTotalPages = (filteredRooms, roomsPerPage, rooms) => {
    const totalRooms =
      filteredRooms.length > 0 ? filteredRooms.length : rooms.length;
    return Math.ceil(totalRooms / roomsPerPage);
  };

  const lastRoomIndex = currentPage * roomsPerPage;
  const firstRoomIndex = lastRoomIndex - roomsPerPage;
  const currentRooms = filteredRooms.slice(firstRoomIndex, lastRoomIndex);

  const handlePaginationClick = (pageNo) => {
    setCurrentPage(pageNo);
  };

  const handleDelete = async (roomId) => {
    try {
      const result = await deleteRoom(roomId);
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
        <p>Loading Rooms...</p>
      ) : (
        <React.Fragment>
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
              <Col md={6} className="mb-3 mb-md-0">
                <RoomFilter data={rooms} setFilteredData={setFilteredRooms} />
              </Col>
              <Col md={6} className="d-flex justify-content-end">
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
                            handleDelete(room.id);
                          }}
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <RoomPaginator
              currentPage={currentPage}
              totalPages={calcTotalPages(filteredRooms, roomsPerPage, rooms)}
              onPageChange={() => {
                handlePaginationClick(currentPage);
              }}
            />
          </section>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ExistingRooms;
