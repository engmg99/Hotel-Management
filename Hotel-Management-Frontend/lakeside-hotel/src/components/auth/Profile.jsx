import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { axiosDelete, axiosGet } from "../utils/APIFunctions";
import { GlobalConstants } from "../constants/global-constants";

const Profile = () => {
  const [user, setUser] = useState({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    roles: [{ id: "", name: "" }],
  });

  const [bookings, setBookings] = useState([
    {
      bookingId: "",
      room: { id: "", roomType: "" },
      checkIn: "",
      checkOut: "",
      bookingConfirmationCode: "",
    },
  ]);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  console.log("userId", userId);
  const fetchUser = useCallback(async () => {
    try {
      const userData = await axiosGet(
        GlobalConstants.GET_USER_BY_ID(userId),
        true
      );
      setUser(userData);
      console.log("userData", userData);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  }, [userId]);

  const fetchBookings = useCallback(async () => {
    try {
      const response = await axiosGet(
        GlobalConstants.GET_ALL_BOOKING_DONE_BY_USER(userId),
        true
      );
      setBookings(response);
    } catch (error) {
      console.error("Error fetching bookings:", error.message);
      setErrorMessage(error.message);
    }
  }, [userId]);

  useEffect(() => {
    // let isMounted = true;
    // const controller = new AbortController();
    fetchUser();
    // const fetchBookings = async () => {
    //   try {
    //     const response = await axiosPrivate.get(
    //       GlobalConstants.GET_ALL_BOOKING_DONE_BY_USER(userId)
    //       // {
    //       //   signal: controller.signal,
    //       // }
    //     );
    //     console.log(response.data);
    //     isMounted && setBookings(response.data);
    //     // const response = await axiosGet(
    //     //   GlobalConstants.GET_ALL_BOOKING_DONE_BY_USER(userId),
    //     //   true
    //     // );
    //     // setBookings(response);
    //   } catch (error) {
    //     console.error("Error fetching bookings:", error.message);
    //     setErrorMessage(error.message);
    //   }
    // };

    fetchBookings();

    // return () => {
    //   isMounted = false;
    //   controller.abort();
    // };
  }, [fetchUser, fetchBookings]);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmed) {
      try {
        const result = await axiosDelete(
          GlobalConstants.DELETE_USER_BY_ID(userId),
          true
        );
        if (result) {
          console.log(result);
          setMessage(result);
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("userRole");
          navigate("/");
          window.location.reload();
        }
      } catch (error) {
        setErrorMessage(error?.message);
      }
    }
  };

  return (
    <div className="container">
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
      {message && <p className="text-danger">{message}</p>}
      {user ? (
        <div
          className="card p-5 mt-5"
          style={{ backgroundColor: "whitesmoke" }}
        >
          <h4 className="card-title text-center">User Information</h4>
          <div className="card-body">
            <div className="col-md-10 mx-auto">
              <div className="card mb-3 shadow">
                <div className="row g-0">
                  <div className="col-md-2">
                    <div className="d-flex justify-content-center align-items-center mb-4">
                      <img
                        src="https://themindfulaimanifesto.org/wp-content/uploads/2020/09/male-placeholder-image.jpeg"
                        alt="Profile"
                        className="rounded-circle"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-md-10">
                    <div className="card-body">
                      <div className="form-group row">
                        <label className="col-md-2 col-form-label fw-bold">
                          ID:
                        </label>
                        <div className="col-md-10">
                          <p className="card-text">{user.id}</p>
                        </div>
                      </div>
                      <hr />

                      <div className="form-group row">
                        <label className="col-md-2 col-form-label fw-bold">
                          First Name:
                        </label>
                        <div className="col-md-10">
                          <p className="card-text">{user.firstName}</p>
                        </div>
                      </div>
                      <hr />

                      <div className="form-group row">
                        <label className="col-md-2 col-form-label fw-bold">
                          Last Name:
                        </label>
                        <div className="col-md-10">
                          <p className="card-text">{user.lastName}</p>
                        </div>
                      </div>
                      <hr />

                      <div className="form-group row">
                        <label className="col-md-2 col-form-label fw-bold">
                          Email:
                        </label>
                        <div className="col-md-10">
                          <p className="card-text">{user.email}</p>
                        </div>
                      </div>
                      <hr />

                      <div className="form-group row">
                        <label className="col-md-2 col-form-label fw-bold">
                          Roles:
                        </label>
                        <div className="col-md-10">
                          <ul className="list-unstyled">
                            {user.roles.map((role) => (
                              <li key={role.id} className="card-text">
                                {role.role}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="card-title text-center">Booking History</h4>

              {bookings.length > 0 ? (
                <table className="table table-bordered table-hover shadow">
                  <thead>
                    <tr>
                      <th scope="col">Booking ID</th>
                      <th scope="col">Room ID</th>
                      <th scope="col">Room Type</th>
                      <th scope="col">Check In Date</th>
                      <th scope="col">Check Out Date</th>
                      <th scope="col">Confirmation Code</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, index) => (
                      <tr key={index}>
                        <td>{booking.bookingId}</td>
                        <td>{booking.room.id}</td>
                        <td>{booking.room.roomType}</td>
                        <td>
                          {moment(booking.checkIn)
                            .subtract(1, "month")
                            .format("MMM Do, YYYY")}
                        </td>
                        <td>
                          {moment(booking.checkOut)
                            .subtract(1, "month")
                            .format("MMM Do, YYYY")}
                        </td>
                        <td>{booking.bookingConfirmationCode}</td>
                        <td className="text-success">On-going</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>You have not made any bookings yet.</p>
              )}

              <div className="d-flex justify-content-center">
                <div className="mx-2">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleDeleteAccount}
                  >
                    Close account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Profile;
