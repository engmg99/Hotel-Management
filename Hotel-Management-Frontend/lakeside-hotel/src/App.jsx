import React, { useState } from "react";
import "./App.css";
import AddRoom from "./components/hotelRoom/AddRoom";
import ExistingRooms from "./components/hotelRoom/ExistingRooms";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
import EditRoom from "./components/hotelRoom/EditRoom";
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";

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
      <main>
        <Router>
          <Navbar
            appMode={appModeDarkOrLight}
            headingTitle="Lakeside Hotel"
            toggleMode={toggleMode}
          />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/add-room" element={<AddRoom />}></Route>
            <Route path="/edit-room/:roomId" element={<EditRoom />}></Route>
            <Route path="/existing-rooms" element={<ExistingRooms />}></Route>
          </Routes>
        </Router>
        <Footer />
      </main>
    </React.Fragment>
  );
}

export default App;
