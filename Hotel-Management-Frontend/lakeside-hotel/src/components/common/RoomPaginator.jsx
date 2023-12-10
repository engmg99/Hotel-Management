import PropTypes from "prop-types";
const RoomPaginator = (props) => {
  const pageNumbers = Array.from({ length: props.totalPages }, (_, i) => i + 1);

  return (
    <nav>
      <ul className="pagination justify-content-center">
        {pageNumbers &&
          pageNumbers.map((pageNo) => {
            return (
              <li
                key={pageNo}
                className={`page-item ${
                  props.currentPage === pageNo ? "active" : ""
                }`}
              >
                <button className="page-link" onClick={()=>{props.onPageChange(pageNo)}}>{pageNo}</button>
              </li>
            );
          })}
      </ul>
    </nav>
  );
};
RoomPaginator.propTypes = {
  totalPages: PropTypes.number,
  currentPage: PropTypes.number,
  onPageChange: PropTypes.func,
};
export default RoomPaginator;
