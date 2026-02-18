import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PostModal from "./PostModal";
import "./Profile.css";

const Profile = () => {
  const { userid } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("posts"); // posts, saved
  const [loading, setLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);

  useEffect(() => {
    loadUserProfile();
    loadUserPosts();
  }, [userid]);

  // user가 설정된 후 팔로우 정보 로드
  useEffect(() => {
    if (user && user.userNo) {
      loadFollowCounts();
      checkFollowStatus();
    }
  }, [user, isOwnProfile]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      
      // userid로 사용자 정보 조회
      const response = await axios.get(`http://localhost:8090/api/auth/user/${userid}`);
      
      if (response.data.success) {
        const fetchedUser = response.data.user;
        setUser(fetchedUser);
        setIsOwnProfile(currentUser.userid === fetchedUser.userid);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("프로필 로딩 오류:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8090/api/posts/user/${userid}`);
      console.log("게시물 데이터:", response.data);
      setPosts(response.data);
    } catch (error) {
      console.error("게시물 로딩 오류:", error);
      setPosts([]);
    }
  };

  // 팔로우 카운트 로딩
  const loadFollowCounts = async () => {
    if (!user || !user.userNo) return;
    
    try {
      const response = await axios.get(`http://localhost:8090/api/follows/counts/${user.userNo}`);
      setFollowerCount(response.data.followerCount);
      setFollowingCount(response.data.followingCount);
    } catch (error) {
      console.error("팔로우 수 로딩 오류:", error);
    }
  };

  // 팔로우 상태 확인
  const checkFollowStatus = async () => {
    if (!user || !user.userNo || isOwnProfile) return;
    
    try {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (!currentUser.userNo) return;

      const response = await axios.get(`http://localhost:8090/api/follows/status?followerUserNo=${currentUser.userNo}&followingUserNo=${user.userNo}`);
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error("팔로우 상태 확인 오류:", error);
    }
  };

  // 팔로우 핸들러
  const handleFollow = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (!currentUser.userNo) {
        alert("로그인이 필요합니다.");
        return;
      }

      const response = await axios.post(`http://localhost:8090/api/follows/follow?followerUserNo=${currentUser.userNo}&followingUserNo=${user.userNo}`);

      setIsFollowing(true);
      setFollowerCount(response.data.followerCount);
    } catch (error) {
      console.error("팔로우 오류:", error);
      alert("팔로우 처리 중 오류가 발생했습니다.");
    }
  };

  // 언팔로우 핸들러
  const handleUnfollow = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (!currentUser.userNo) return;

      const response = await axios.post(`http://localhost:8090/api/follows/unfollow?followerUserNo=${currentUser.userNo}&followingUserNo=${user.userNo}`);

      setIsFollowing(false);
      setFollowerCount(response.data.followerCount);
      setShowUnfollowModal(false);
    } catch (error) {
      console.error("언팔로우 오류:", error);
      alert("언팔로우 처리 중 오류가 발생했습니다.");
    }
  };

  // 좋아요 업데이트 핸들러
  const handleLikeUpdate = (postId, newLikeCount) => {
    setPosts((prevPosts) => prevPosts.map((post) => (post.postId === postId ? { ...post, likeCount: newLikeCount } : post)));

    if (selectedPost && selectedPost.postId === postId) {
      setSelectedPost({ ...selectedPost, likeCount: newLikeCount });
    }
  };

  const getProfileInitial = () => {
    if (user?.nickname) {
      return user.nickname.charAt(0).toUpperCase();
    }
    return "U";
  };

  if (loading) {
    return <div className="profile-loading">로딩 중...</div>;
  }

  if (!user) {
    return <div className="profile-error">사용자를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-header-avatar">
          {user.profileImg ? (
            <img src={user.profileImg} alt="프로필" className="profile-avatar-image" />
          ) : (
            <div className="profile-avatar-placeholder">
              <span className="profile-avatar-initial">{getProfileInitial()}</span>
            </div>
          )}
        </div>

        <div className="profile-header-info">
          <div className="profile-header-top">
            <h2 className="profile-username">{user.userid}</h2>
            {isOwnProfile ? (
              <div className="profile-actions">
                <button className="profile-edit-button">프로필 편집</button>
                <button className="profile-settings-button">
                  <svg aria-label="설정" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M3.5 6.5h17a1.5 1.5 0 0 0 0-3h-17a1.5 1.5 0 0 0 0 3Zm17 4h-17a1.5 1.5 0 0 0 0 3h17a1.5 1.5 0 0 0 0-3Zm0 7h-17a1.5 1.5 0 0 0 0 3h17a1.5 1.5 0 0 0 0-3Z"></path>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="profile-actions">
                {isFollowing ? (
                  <button className="profile-following-button" onClick={() => setShowUnfollowModal(true)}>
                    팔로우 중
                  </button>
                ) : (
                  <button className="profile-follow-button" onClick={handleFollow}>
                    팔로우
                  </button>
                )}
                <button className="profile-message-button">메시지</button>
              </div>
            )}
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat-count">{posts.length}</span>
              <span className="profile-stat-label">게시물</span>
            </div>
            <div className="profile-stat" style={{ cursor: "pointer" }}>
              <span className="profile-stat-count">{followerCount}</span>
              <span className="profile-stat-label">팔로워</span>
            </div>
            <div className="profile-stat" style={{ cursor: "pointer" }}>
              <span className="profile-stat-count">{followingCount}</span>
              <span className="profile-stat-label">팔로잉</span>
            </div>
          </div>

          <div className="profile-bio">
            <div className="profile-fullname">{user.username || user.nickname}</div>
            {user.description && <div className="profile-description">{user.description}</div>}
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button className={`profile-tab ${activeTab === "posts" ? "active" : ""}`} onClick={() => setActiveTab("posts")}>
          <svg aria-label="게시물" fill="currentColor" height="12" viewBox="0 0 24 24" width="12">
            <rect fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect>
            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.015" x2="9.015" y1="3" y2="21"></line>
            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14.985" x2="14.985" y1="3" y2="21"></line>
            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="9.015" y2="9.015"></line>
            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="14.985" y2="14.985"></line>
          </svg>
          <span>게시물</span>
        </button>
        {isOwnProfile && (
          <button className={`profile-tab ${activeTab === "saved" ? "active" : ""}`} onClick={() => setActiveTab("saved")}>
            <svg aria-label="저장됨" fill="currentColor" height="12" viewBox="0 0 24 24" width="12">
              <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
            </svg>
            <span>저장됨</span>
          </button>
        )}
      </div>

      <div className="profile-content">
        {activeTab === "posts" && (
          <div className="profile-posts-grid">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.postId} className="profile-post-item" onClick={() => setSelectedPost(post)}>
                  <img src={`http://localhost:8090${post.imageUrl}`} alt={post.content} className="profile-post-image" />
                  <div className="profile-post-overlay">
                    <div className="profile-post-stat">
                      <svg aria-label="좋아요" fill="currentColor" height="18" viewBox="0 0 48 48" width="18">
                        <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                      </svg>
                      {post.likeCount || 0}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="profile-empty-state">
                <div className="empty-state-icon">
                  <svg aria-label="카메라" fill="currentColor" height="62" viewBox="0 0 96 96" width="62">
                    <circle cx="48" cy="48" fill="none" r="47" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                    <ellipse cx="48.002" cy="49.524" fill="none" rx="10.444" ry="10.476" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></ellipse>
                    <path d="M63.994 69A8.02 8.02 0 0 0 72 60.968V39.456a8.023 8.023 0 0 0-8.01-8.035h-1.749a4.953 4.953 0 0 1-4.591-3.242C56.61 25.696 54.859 25 52.469 25h-8.983c-2.39 0-4.141.695-5.181 3.178a4.954 4.954 0 0 1-4.592 3.242H32.01a8.024 8.024 0 0 0-8.012 8.035v21.512A8.02 8.02 0 0 0 32.007 69Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <h2>게시물 없음</h2>
              </div>
            )}
          </div>
        )}

        {activeTab === "saved" && (
          <div className="profile-posts-grid">
            <div className="profile-empty-state">
              <div className="empty-state-icon">
                <svg aria-label="저장" fill="currentColor" height="62" viewBox="0 0 96 96" width="62">
                  <polygon fill="none" points="43.5 47.5 20.5 71 20.5 12 75.5 12 75.5 71 52.5 47.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
                </svg>
              </div>
              <h2>저장된 게시물 없음</h2>
            </div>
          </div>
        )}
      </div>

      {/* 게시물 상세 모달 */}
      {selectedPost && <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} onLikeUpdate={handleLikeUpdate} />}

      {/* 언팔로우 확인 모달 */}
      {showUnfollowModal && (
        <div className="unfollow-modal-overlay" onClick={() => setShowUnfollowModal(false)}>
          <div className="unfollow-modal" onClick={(e) => e.stopPropagation()}>
            <div className="unfollow-modal-content">
              <div className="unfollow-modal-avatar">{user.profileImg ? <img src={user.profileImg} alt={user.username} /> : <div className="unfollow-modal-avatar-placeholder">{getProfileInitial()}</div>}</div>
              <p className="unfollow-modal-text">{user.nickname || user.username}님을 언팔로우하시겠습니까?</p>
            </div>
            <button className="unfollow-modal-confirm" onClick={handleUnfollow}>
              언팔로우
            </button>
            <button className="unfollow-modal-cancel" onClick={() => setShowUnfollowModal(false)}>
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
