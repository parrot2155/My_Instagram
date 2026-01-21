import React from "react";
import { FaHome, FaPaperPlane, FaSearch, FaCompass, FaPlay, FaHeart, FaPlusSquare, FaUser, FaCog } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <h1 onClick={() => (window.location.href = "/")}>Instagram</h1>
      </div>
      <nav className="sidebar__nav">
        <div className="nav-item">
          <FaHome className="nav-icon" />
          <span>홈</span>
        </div>
        <div className="nav-item">
          <FaSearch className="nav-icon" />
          <span>검색</span>
        </div>
        <div className="nav-item">
          <FaCompass className="nav-icon" />
          <span>탐색</span>
        </div>
        <div className="nav-item">
          <FaPlay className="nav-icon" />
          <span>릴스</span>
        </div>
        <div className="nav-item">
          <FaPaperPlane className="nav-icon" />
          <span>메시지</span>
        </div>
        <div className="nav-item">
          <FaHeart className="nav-icon" />
          <span>알림</span>
        </div>
        <div className="nav-item">
          <FaPlusSquare className="nav-icon" />
          <span>만들기</span>
        </div>
        <div className="nav-item">
          <FaUser className="nav-icon" />
          <span>프로필</span>
        </div>
      </nav>
      <div className="sidebar__settings">
        <div className="nav-item">
          <FaCog className="nav-icon" />
          <span>설정</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
