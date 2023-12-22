import { useEffect, useState } from "react";
import { axiosGet } from "../utils/APIFunctions";
import { GlobalConstants } from "../constants/global-constants";
import { Card, Carousel, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

const RoomCarousel = () => {
  const [rooms, setRooms] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllRooms = async () => {
    setIsLoading(true);
    try {
      const rooms = await axiosGet(GlobalConstants.GET_ALL_ROOMS);
      if (rooms) {
        setRooms(rooms);
      }
      setErrorMsg("");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMsg(error?.message);
    }
  };

  useEffect(() => {
    fetchAllRooms();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }
  if (errorMsg.length > 0) {
    return (
      <div className="alert alert-danger fade show">{errorMsg.toString()}</div>
    );
  }

  return (
    <section className="mt-5 mb-5 bg-light shadow">
      <Container>
        <Link
          to={"/browse-all-rooms"}
          className="hotel-color text-center"
          style={{ textDecoration: "none" }}
        >
          <h5>Browse All Rooms</h5>
        </Link>
        <Carousel>
          {rooms &&
            [...Array(Math.ceil(rooms.length / 4))].map((_, index) => {
              return (
                <Carousel.Item key={index}>
                  <Row>
                    {rooms.slice(index * 4, index * 4 + 4).map((room) => (
                      <Col
                        key={room.id}
                        className="mb-3 mt-3"
                        md={6}
                        xs={12}
                        lg={3}
                      >
                        <Card>
                          <Link to={`/book-room/${room.id}`}>
                            <Card.Img
                              variant="top"
                              src={`data:image/png;base64,${room.roomPhoto}`}
                              alt="Room Photo"
                              className="w-100"
                              style={{ height: "200px" }}
                            />
                          </Link>
                          <Card.Body>
                            <Card.Title className="hotel-color">
                              {room?.roomType}
                            </Card.Title>
                            <Card.Title className="room-price">
                              ${room?.price} per night
                            </Card.Title>
                            <Link
                              className="btn btn-sm btn-hotel"
                              to={`/book-room/${room.id}`}
                            >
                              View
                            </Link>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Carousel.Item>
              );
            })}
        </Carousel>
      </Container>
    </section>
  );
};

export default RoomCarousel;
