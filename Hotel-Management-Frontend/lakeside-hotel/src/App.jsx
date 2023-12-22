import React, { useState } from "react";
import "./App.css";
import AddRoom from "./components/hotelRoom/AddRoom";
import ExistingRooms from "./components/hotelRoom/ExistingRooms";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
      <main className="mainClass">
        <Router>
          <Navbar
            appMode={appModeDarkOrLight}
            headingTitle="Lakeside Hotel"
            toggleMode={toggleMode}
          />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/add-room" element={<AddRoom />}></Route>
            <Route path="/book-room/:roomId" element={<Checkout />}></Route>
            <Route path="/edit-room/:roomId" element={<EditRoom />}></Route>
            <Route path="/existing-rooms" element={<ExistingRooms />}></Route>
            <Route path="/manage-bookings" element={<Bookings />}></Route>
            <Route path="/find-booking" element={<FindRoomBooking />}></Route>
            <Route path="/browse-all-rooms" element={<RoomListing />}></Route>
            <Route path="/admin" element={<Admin />}></Route>
            <Route path="/booking-success" element={<BookingSuccess />}></Route>
          </Routes>
        </Router>
        <Footer />
      </main>
    </React.Fragment>
  );
}

export default App;
