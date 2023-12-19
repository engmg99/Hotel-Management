import { Container } from "react-bootstrap";

const Parallax = () => {
  return (
    <div className="parallax mb-6">
      <Container className="text-center px-5 py-5 justify-content-center">
        <div className="animated-texts bounceIn">
          <h1>
            Welcome to <span className="">Lakeside Hotel</span>
          </h1>
          <h3>Experience the Best Hospitality in Town</h3>
        </div>
      </Container>
    </div>
  );
};

export default Parallax;
