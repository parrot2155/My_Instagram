import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane, FaPlusSquare, FaCompass, FaHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    console.log("[Header] user 상태:", user);
  }, [user]);

  useEffect(() => {
    // 외부 클릭 감지
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    await logout();
    setShowProfileMenu(false);
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate(`/profile/${user.userid}`);
    setShowProfileMenu(false);
  };

  const getProfileInitial = () => {
    if (user?.nickname) {
      return user.nickname.charAt(0).toUpperCase();
    }
    return "U";
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

        {user ? (
          <div className="profile-container" ref={menuRef}>
            <div className="profile-circle" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              {user.profileImg ? <img src={user.profileImg} alt="프로필" className="profile-image" /> : <span className="profile-initial">{getProfileInitial()}</span>}
            </div>

            {showProfileMenu && (
              <div className="profile-menu">
                <div className="profile-menu-header">
                  <div className="profile-menu-avatar">{user.profileImg ? <img src={user.profileImg} alt="프로필" /> : <span className="profile-initial">{getProfileInitial()}</span>}</div>
                  <div className="profile-menu-info">
                    <div className="profile-menu-nickname">{user.nickname}</div>
                    <div className="profile-menu-userid">@{user.userid}</div>
                  </div>
                </div>
                <div className="profile-menu-divider"></div>
                <button className="profile-menu-item" onClick={handleProfileClick}>
                  마이페이지
                </button>
                <button className="profile-menu-item" onClick={handleLogout}>
                  로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="login-button" onClick={handleLogin}>
            로그인
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
