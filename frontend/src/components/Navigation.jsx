import React from "react";
import { FaHome, FaSearch, FaPlusSquare, FaPlay, FaUser } from "react-icons/fa";
import "./Navigation.css";

const Navigation = () => {
  return (
    <nav className="navigation">
      <FaHome className="nav-icon" />
      <FaSearch className="nav-icon" />
      <FaPlusSquare className="nav-icon" />
      <FaPlay className="nav-icon" />
      <FaUser className="nav-icon" />
    </nav>
  );
};

export default Navigation;
