import moment from "moment";
import React, { useState } from "react";
import { axiosGet } from "../utils/APIFunctions";
import { GlobalConstants } from "../constants/global-constants";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  Row,
  Spinner,
} from "react-bootstrap";
import RoomTypeSelector from "./RoomTypeSelector";
import RoomSearchResults from "./RoomSearchResults";

const RoomSearch = () => {
  const resetSearchQuery = {
    checkInDate: "",
    checkOutDate: "",
    roomType: "",
  };
  const [searchQuery, setSearchQuery] = useState(resetSearchQuery);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault;

    setTimeout(() => {
      setErrorMsg("");
    }, 2000);

    const checkIn = moment(searchQuery.checkInDate);
    const checkOut = moment(searchQuery.checkOutDate);
    if (!checkIn.isValid() || !checkOut.isValid()) {
      setErrorMsg("Please, enter valid date range");
      return;
    }
    if (!searchQuery.roomType) {
      setErrorMsg("Please, select a room type");
      return;
    }
    setIsLoading(true);
    try {
      const result = await axiosGet(
        GlobalConstants.GET_ALL_AVAILABLE_ROOMS_BY_DATE(
          searchQuery.checkInDate,
          searchQuery.checkOutDate,
          searchQuery.roomType
        )
      );
      setAvailableRooms(result);
      setErrorMsg("");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMsg(error?.message);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery({
      ...searchQuery,
      [e.target.name]: e.target.value,
    });
  };

  const clearSearch = () => {
    setSearchQuery(resetSearchQuery);
    setAvailableRooms([]);
  };

  //calculates the from which date, the dates to be disabled in calender
  const calcMinimumCheckOutDate = () => {
    return moment(searchQuery.checkInDate).add(1, "days").format("YYYY-MM-DD");
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <React.Fragment>
      <Container className="mt-5 mb-5 py-5 shadow">
        {errorMsg && (
          <div className="alert alert-danger fade show">
            {errorMsg.toString()}
          </div>
        )}
        <Row className="justify-content-center">
          <Col xs={12} md={3}>
            <Form.Group>
              <Form.Label htmlFor="checkInDate">Check-In Date:</Form.Label>
              <FormControl
                required
                type="date"
                id="checkInDate"
                name="checkInDate"
                value={searchQuery.checkInDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={handleInputChange}
              />
              <Form.Control.Feedback type="invalid">
                Please enter valid date
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col xs={12} md={3}>
            <Form.Group>
              <Form.Label htmlFor="checkOutDate">Check-Out Date:</Form.Label>
              <FormControl
                required
                type="date"
                id="checkOutDate"
                name="checkOutDate"
                value={searchQuery.checkOutDate}
                min={calcMinimumCheckOutDate()}
                onChange={handleInputChange}
              />
              <Form.Control.Feedback type="invalid">
                Please enter valid date
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col xs={12} md={3}>
            <Form.Group>
              <Form.Label htmlFor="roomType">Room Type:</Form.Label>
              <div className="d-flex">
                <RoomTypeSelector
                  handleRoomInputChange={handleInputChange}
                  newRoom={searchQuery}
                  disableAddRoomType={true}
                />
                <Button
                  className="px-2"
                  variant="secondary"
                  type="submit"
                  size="sm"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </Form.Group>
          </Col>
        </Row>
        {availableRooms ? (
          <RoomSearchResults
            results={availableRooms}
            onClearSearch={clearSearch}
          />
        ) : (
          <p>No Rooms Available for selected dates.</p>
        )}
      </Container>
    </React.Fragment>
  );
};

export default RoomSearch;
