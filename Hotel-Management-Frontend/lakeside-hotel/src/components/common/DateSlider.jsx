import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const DateSlider = (props) => {
  const [dateRange, setDateRange] = useState({
    startDate: undefined,
    endDate: undefined,
    key: "selection",
  });

  const handleSelect = (ranges) => {
    setDateRange(ranges?.selection);
    props.onDateChange(
      ranges?.selection?.startDate,
      ranges?.selection?.endDate
    );
    props.onFilterChange(
      ranges?.selection?.startDate,
      ranges?.selection?.endDate
    );
  };

  const clearFilter = () => {
    setDateRange({
      startDate: undefined,
      endDate: undefined,
      key: "selection",
    });
    props.onDateChange(null, null);
    props.onFilterChange(null, null);
  };

  return (
    <div className="mb-2">
      <Row className="mb-2">
        <Col md={9}>
          <h5>Filter bookings by Date</h5>
        </Col>
        <Col md={3}>
          <Button variant="secondary" size="sm" onClick={clearFilter}>
            Clear Filter
          </Button>
        </Col>
      </Row>
      <DateRangePicker ranges={[dateRange]} onChange={handleSelect} />
    </div>
  );
};

DateSlider.propTypes = {
  onDateChange: PropTypes.func,
  onFilterChange: PropTypes.func,
};

export default DateSlider;
