import React from "react";
import "./App.css";
import AddRoom from "./components/hotelRoom/AddRoom";
import ExistingRooms from "./components/hotelRoom/ExistingRooms";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
import EditRoom from "./components/hotelRoom/EditRoom";

function App() {
  return (
    <React.Fragment>
      <main>
        <Router>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/add-room" element={<AddRoom />}></Route>
            <Route path="/edit-room/:roomId" element={<EditRoom />}></Route>
            <Route path="/existing-rooms" element={<ExistingRooms />}></Route>
          </Routes>
        </Router>
      </main>
    </React.Fragment>
  );
}

export default App;
