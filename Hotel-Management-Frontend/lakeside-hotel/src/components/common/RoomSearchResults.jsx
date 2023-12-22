import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Row } from "react-bootstrap";
import RoomCard from "../hotelRoom/RoomCard";
import RoomPaginator from "./RoomPaginator";

const RoomSearchResults = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const resultPerPage = 3;
  const totalResults = props?.results.length;
  const totalPages = Math.ceil(totalResults / resultPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * resultPerPage;
  const endIndex = startIndex + resultPerPage;
  const renderRooms = () => {
    const paginatedResult = props.results.slice(startIndex, endIndex);
    return paginatedResult.map((room) => {
      return <RoomCard key={room.id} room={room} />;
    });
  };
  return (
    <div>
      {props.results.length > 0 ? (
        <React.Fragment>
          <h5 className="text-center mt-5">Search Result</h5>
          <Row>{renderRooms()}</Row>
          <Row>
            {totalResults > resultPerPage && (
              <RoomPaginator
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
            <Button variant="secondary" onClick={props.onClearSearch}>
              Clear Search
            </Button>
          </Row>
        </React.Fragment>
      ) : (
        <p></p>
      )}
    </div>
  );
};

RoomSearchResults.propTypes = {
  results: PropTypes.array,
  onClearSearch: PropTypes.func,
};

export default RoomSearchResults;
