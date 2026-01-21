import React from "react";
import { FaPaperPlane, FaPlusSquare, FaCompass, FaHeart } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header__center">
        <input type="text" placeholder="검색" />
      </div>
      <div className="header__right">
        <FaPaperPlane className="icon" />
        <FaPlusSquare className="icon" />
        <FaCompass className="icon" />
        <FaHeart className="icon" />
        <button className="login-button">로그인</button>
      </div>
    </header>
  );
};

export default Header;
