import React, { useState } from "react";
import "./App.css";
import AddRoom from "./components/hotelRoom/AddRoom";
import ExistingRooms from "./components/hotelRoom/ExistingRooms";
import Home from "./components/home/Home";
import EditRoom from "./components/hotelRoom/EditRoom";
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import RoomListing from "./components/hotelRoom/RoomListing";
import Admin from "./components/admin/Admin";
import Checkout from "./components/roomBookings/Checkout";
import BookingSuccess from "./components/roomBookings/BookingSuccess";
import Bookings from "./components/roomBookings/Bookings";
import FindRoomBooking from "./components/roomBookings/FindRoomBooking";
import Login from "./components/auth/Login";
import Registration from "./components/auth/Registration";
import Profile from "./components/auth/Profile";
import Logout from "./components/auth/Logout";
import RequireAuth from "./components/auth/RequiredAuth";
import PageNotFound from "./components/common/PageNotFound";
import Layout from "./components/layouts/Layout";
import { Route, Routes } from "react-router";

function App() {
  const [appModeDarkOrLight, setAppMode] = useState("light");

  const toggleMode = () => {
    if (appModeDarkOrLight === "light") {
      setAppMode("dark");
      document.body.style.backgroundColor = "#042743";
    } else {
      setAppMode("light");
      document.body.style.backgroundColor = "white";
    }
  };

  return (
    <React.Fragment>
      {/* <Router> */}
      <Navbar
        appMode={appModeDarkOrLight}
        headingTitle="Lakeside Hotel"
        toggleMode={toggleMode}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />}></Route>
          <Route path="/add-room" element={<AddRoom />}></Route>
          <Route path="/edit-room/:roomId" element={<EditRoom />}></Route>
          <Route path="/existing-rooms" element={<ExistingRooms />}></Route>
          <Route path="/manage-bookings" element={<Bookings />}></Route>
          <Route path="/browse-all-rooms" element={<RoomListing />}></Route>
          <Route path="/booking-success" element={<BookingSuccess />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Registration />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/logout" element={<Logout />}></Route>

          {/* Protected Routes */}
          <Route element={<RequireAuth />}>
            <Route path="/find-booking" element={<FindRoomBooking />}></Route>
            <Route path="/book-room/:roomId" element={<Checkout />}></Route>
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<Admin />}></Route>

          {/* Mising Routes */}
          <Route path="*" element={<PageNotFound />}></Route>
        </Route>
      </Routes>
      {/* </Router> */}
      <Footer />
      {/* </main> */}
    </React.Fragment>
  );
}

export default App;
