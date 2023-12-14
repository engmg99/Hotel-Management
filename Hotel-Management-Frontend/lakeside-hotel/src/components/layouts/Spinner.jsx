import loading from "../../assets/loading.gif";

const Spinner = () => {
  return (
    <div
      className="text-center"
      style={{
        position: "absolute",
        top: "40%",
        left: "50%",
      }}
    >
      <img src={loading} alt="loading"></img>
    </div>
  );
};

export default Spinner;
