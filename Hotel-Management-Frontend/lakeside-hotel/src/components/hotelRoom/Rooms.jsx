import { useEffect, useState } from "react";
import RoomCard from "./RoomCard";
import { getAllRooms } from "../utils/APIFunctions";
import Spinner from "../layouts/Spinner";
import { Col, Row } from "react-bootstrap";
import RoomFilter from "../common/RoomFilter";
import RoomPaginator from "../common/RoomPaginator";
const Rooms = () => {
  // store all rooms as an array
  const [rooms, setRooms] = useState([]);
  // store the current activated page
  const [currentPage, setCurrentPage] = useState(1);
  // a variable which store the roomsPerPage
  const [roomsPerPage] = useState(8);
  // store the status of isLoading
  const [isLoading, setIsLoading] = useState(false);
  // store the filtered rooms as an array
  // store the filtered rooms as an array
  const [filteredRooms, setFilteredRooms] = useState([]);
  // store the success and error msg
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const result = await getAllRooms();
      // setSuccessMsg("Rooms Fetched Successfully");
      setIsLoading(false);
      setRooms(result);
      setFilteredRooms(result);
    } catch (error) {
      setIsLoading(false);
      setErrorMsg(error);
      console.log("**error**", error);
    }
    setTimeout(() => {
      setSuccessMsg("");
      setErrorMsg("");
    }, 1000);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  // fetching data by using useEFfect is a BAD practice so below is the another approach
  // useEffect(() => {
  //   setFilteredRooms(rooms); // adding all the rooms to the filteredRoom initially
  // }, [rooms]);

  // GOOD Practice calling this function directly in UI rather than using useEffect
  const renderRooms = () => {
    const lastRoomIndex = currentPage * roomsPerPage; // 1*8=8, 2*8=16
    const firstRoomIndex = lastRoomIndex - roomsPerPage; // 8-8, 16-8=8
    const filteredRoomData = filteredRooms.slice(firstRoomIndex, lastRoomIndex); //slice(0,8), slice(8,16)
    return filteredRoomData.map((room) => {
      return <RoomCard key={room.id} room={room} />;
    });
  };

  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  const handlePageChange = (pageNo) => {
    setCurrentPage(pageNo);
  };

  return (
    <section>
      {successMsg && (
        <div className="alert alert-success fade show">{successMsg}</div>
      )}
      {errorMsg && (
        <div className="alert alert-danger fade show">{errorMsg}</div>
      )}
      <Row>
        <Col md={6}>
          <RoomFilter data={rooms} setFilteredData={setFilteredRooms} />
        </Col>
        <Col md={6} className="d-flex justify-content-end">
          <RoomPaginator
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Col>
      </Row>
      {!filteredRooms.length > 0 ? (
        <span className="center-page">No Rooms Found</span>
      ) : (
        renderRooms()
      )}
    </section>
  );
};

export default Rooms;
