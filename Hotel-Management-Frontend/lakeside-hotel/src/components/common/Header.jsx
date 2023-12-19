import PropTypes from "prop-types";

const Header = (props) => {
  return (
    <header className="header">
      <div className="container">
        <h1 className="header-title text-center mt-5">{props.title}</h1>
      </div>
      {/* <div className="overlay"></div> */}
    </header>
  );
};
Header.propTypes = {
  title: PropTypes.string,
};
export default Header;
