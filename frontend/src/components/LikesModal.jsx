import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LikesModal.css";

const LikesModal = ({ postId, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikeUsers = async () => {
      try {
        const res = await fetch(`http://localhost:8090/api/likes/post/${postId}/users`);
        if (!res.ok) throw new Error("좋아요 목록을 불러올 수 없습니다.");

        const data = await res.json();
        setUsers(data.users);
      } catch (err) {
        console.error("좋아요 목록 로딩 오류:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLikeUsers();
  }, [postId]);

  // 사용자 프로필 페이지로 이동
  const handleUserClick = (userid) => {
    navigate(`/profile/${userid}`);
    onClose(); // 모달 닫기
  };

  // 오버레이 클릭 시 모달 닫기
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="likes-modal-overlay" onClick={handleOverlayClick}>
      <div className="likes-modal" onClick={(e) => e.stopPropagation()}>
        <div className="likes-modal__header">
          <h3>좋아요</h3>
          <button className="likes-modal__close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="likes-modal__content">
          {loading ? (
            <div className="likes-modal__loading">
              <div className="spinner"></div>
              <p>로딩 중...</p>
            </div>
          ) : error ? (
            <div className="likes-modal__error">
              <p>{error}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="likes-modal__empty">
              <p>아직 좋아요가 없습니다.</p>
            </div>
          ) : (
            <ul className="likes-modal__users">
              {users.map((user) => (
                <li key={user.userNo} className="likes-modal__user-item">
                  <div className="likes-modal__user-info" onClick={() => handleUserClick(user.userid)}>
                    <div className="likes-modal__profile-pic">{user.profileImg ? <img src={`http://localhost:8090${user.profileImg}`} alt={user.username} /> : <div className="likes-modal__profile-placeholder">{(user.nickname || user.username || "U")[0].toUpperCase()}</div>}</div>
                    <div className="likes-modal__user-details">
                      <div className="likes-modal__username">{user.nickname || user.username}</div>
                      <div className="likes-modal__userid">@{user.userid}</div>
                    </div>
                  </div>
                  <button className="likes-modal__follow-btn">팔로우</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikesModal;
