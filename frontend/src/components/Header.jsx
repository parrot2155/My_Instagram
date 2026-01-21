import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane, FaPlusSquare, FaCompass, FaHeart } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

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
        <button className="login-button" onClick={handleLogin}>
          로그인
        </button>
      </div>
    </header>
  );
};

export default Header;
