import React, { useState, useEffect } from "react";
import "./PostModal.css";

const PostModal = ({ post, onClose, onLikeUpdate }) => {
  const [liked, setLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(post?.likeCount || 0);

  if (!post) return null;

  // 현재 사용자 정보 가져오기
  const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  };

  // 좋아요 상태 확인
  useEffect(() => {
    const checkLikeStatus = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) return;

      try {
        const res = await fetch(`http://localhost:8090/api/likes/check?postId=${post.postId}&userNo=${currentUser.userNo}`);
        if (res.ok) {
          const data = await res.json();
          setLiked(data.isLiked);
          setLocalLikeCount(data.likeCount);
        }
      } catch (err) {
        console.error("좋아요 상태 확인 오류:", err);
      }
    };

    checkLikeStatus();
  }, [post.postId]);

  const handleOverlayClick = (e) => {
    if (e.target.className === "post-modal-overlay") {
      onClose();
    }
  };

  const handleLike = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8090/api/likes/toggle?postId=${post.postId}&userNo=${currentUser.userNo}`, { method: "POST" });

      if (!res.ok) throw new Error("좋아요 처리 실패");

      const data = await res.json();
      setLiked(data.isLiked);
      setLocalLikeCount(data.likeCount);

      // 부모 컴포넌트에 좋아요 업데이트 알림
      if (onLikeUpdate) {
        onLikeUpdate(post.postId, data.likeCount);
      }
    } catch (err) {
      console.error("좋아요 처리 오류:", err);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "방금 전";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;

    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="post-modal-overlay" onClick={handleOverlayClick}>
      <div className="post-modal-content">
        <button className="post-modal-close" onClick={onClose}>
          <svg aria-label="닫기" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="3" y2="21"></line>
            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="21" y2="3"></line>
          </svg>
        </button>

        <div className="post-modal-body">
          {/* 좌측: 이미지 */}
          <div className="post-modal-image-section">
            <img src={`http://localhost:8090${post.imageUrl}`} alt={post.content} className="post-modal-image" />
          </div>

          {/* 우측: 정보 */}
          <div className="post-modal-info-section">
            {/* 헤더: 사용자 정보 */}
            <div className="post-modal-header">
              <div className="post-modal-user">
                {post.user?.profileImg ? <img src={post.user.profileImg} alt={post.user.userid} className="post-modal-user-avatar" /> : <div className="post-modal-user-avatar-placeholder">{post.user?.userid?.charAt(0).toUpperCase() || "U"}</div>}
                <div className="post-modal-user-info">
                  <span className="post-modal-username">{post.user?.userid}</span>
                  {post.location && <span className="post-modal-location">{post.location}</span>}
                </div>
              </div>
              <button className="post-modal-menu-button">
                <svg aria-label="더보기" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
                  <circle cx="12" cy="12" r="1.5"></circle>
                  <circle cx="6" cy="12" r="1.5"></circle>
                  <circle cx="18" cy="12" r="1.5"></circle>
                </svg>
              </button>
            </div>

            {/* 본문: 게시물 내용 */}
            <div className="post-modal-content-area">
              <div className="post-modal-caption">
                <div className="post-modal-caption-user">{post.user?.profileImg ? <img src={post.user.profileImg} alt={post.user.userid} className="post-modal-caption-avatar" /> : <div className="post-modal-caption-avatar-placeholder">{post.user?.userid?.charAt(0).toUpperCase() || "U"}</div>}</div>
                <div className="post-modal-caption-text">
                  <span className="post-modal-caption-username">{post.user?.userid}</span> {post.content}
                  <div className="post-modal-caption-date">{formatDate(post.regDate)}</div>
                </div>
              </div>

              {/* 댓글 영역 (임시) */}
              <div className="post-modal-comments">
                <div className="post-modal-no-comments">댓글이 아직 없습니다.</div>
              </div>
            </div>

            {/* 푸터: 액션 버튼 & 댓글 입력 */}
            <div className="post-modal-footer">
              <div className="post-modal-actions">
                <div className="post-modal-action-buttons">
                  <button className={`post-modal-action-button ${liked ? "liked" : ""}`} onClick={handleLike}>
                    {liked ? (
                      <svg aria-label="좋아요 취소" fill="#ed4956" height="24" viewBox="0 0 48 48" width="24">
                        <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                      </svg>
                    ) : (
                      <svg aria-label="좋아요" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
                        <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                      </svg>
                    )}
                  </button>
                  <button className="post-modal-action-button">
                    <svg aria-label="댓글 달기" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
                      <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                  </button>
                  <button className="post-modal-action-button">
                    <svg aria-label="게시물 공유" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
                      <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
                      <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
                    </svg>
                  </button>
                </div>
                <button className="post-modal-action-button">
                  <svg aria-label="저장" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
                    <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
                  </svg>
                </button>
              </div>

              <div className="post-modal-likes">
                <span className="post-modal-likes-count">좋아요 {localLikeCount}개</span>
              </div>

              <div className="post-modal-timestamp">{formatDate(post.regDate)}</div>

              {/* 댓글 입력 */}
              <div className="post-modal-comment-form">
                <textarea className="post-modal-comment-input" placeholder="댓글 달기..." rows="1" />
                <button className="post-modal-comment-submit" disabled>
                  게시
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
