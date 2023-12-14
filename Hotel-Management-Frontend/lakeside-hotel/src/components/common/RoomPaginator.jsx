import PropTypes from "prop-types";

//here we received the totalPages, currentPage and a onPage chagne func as props
// we need to return the set the currentPage as active and return the pageNo if user changes it
const RoomPaginator = (props) => {
  //creating a number array from totalPages and it'll work as no to display
  const pageNumbers = Array.from({ length: props.totalPages }, (_, i) => i + 1); //if totalPage=3, [1,2,3]

  return (
    <nav>
      <ul className="pagination justify-content-center">
        {pageNumbers &&
          pageNumbers.map((pageNo) => {
            return (
              <li
                key={pageNo}
                className={`page-item ${
                  props.currentPage === pageNo ? "active" : "" //set the current page as active
                }`}
              >
                <button
                  className="page-link"
                  style={{ zIndex: "auto" }} // this number was overlapping over the footer hence used zIndex
                  onClick={() => {
                    props.onPageChange(pageNo); // when user change the pageNo that no is sent to the Parent thro this func
                  }}
                >
                  {pageNo}
                </button>
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
