import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaHeart, FaComment, FaPaperPlane, FaBookmark } from "react-icons/fa";
import "./Feed.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());

  const observerTarget = useRef(null);
  const observer = useRef(null);

  // 현재 사용자 정보 가져오기
  const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  };

  // 사용자가 좋아요한 게시물 목록 가져오기
  const fetchUserLikes = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    try {
      const res = await fetch(`http://localhost:8090/api/likes/user/${currentUser.userNo}`);
      if (res.ok) {
        const data = await res.json();
        setLikedPosts(new Set(data.likedPostIds));
      }
    } catch (err) {
      console.error("좋아요 목록 로딩 오류:", err);
    }
  };

  // 좋아요 토글
  const handleLike = async (postId, currentLikeCount) => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8090/api/likes/toggle?postId=${postId}&userNo=${currentUser.userNo}`, { method: "POST" });

      if (!res.ok) throw new Error("좋아요 처리 실패");

      const data = await res.json();

      // 좋아요 상태 업데이트
      setLikedPosts((prev) => {
        const newSet = new Set(prev);
        if (data.isLiked) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });

      // 게시물 좋아요 수 업데이트
      setPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? { ...post, likes: data.likeCount } : post)));
    } catch (err) {
      console.error("좋아요 처리 오류:", err);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  const fetchPosts = async (pageNum) => {
    try {
      console.log(`📥 게시물 로딩 시작: 페이지 ${pageNum}`);

      if (pageNum === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const res = await fetch(`http://localhost:8090/api/posts/pageable?page=${pageNum}&size=3`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();

      console.log(`✅ 게시물 로딩 완료: ${data.content.length}개, hasNext: ${data.hasNext}`);

      // Map backend fields to front-end expected shape
      const mapped = data.content.map((p) => ({
        id: p.postId,
        username: p.user?.nickname || p.user?.username || `user${p.userNo}`,
        userid: p.user?.userid,
        image: p.imageUrl ? `http://localhost:8090${p.imageUrl}` : "https://via.placeholder.com/400x400",
        likes: p.likeCount || p.like_count || 0,
        caption: p.content || "",
      }));

      setPosts((prevPosts) => {
        const newPosts = pageNum === 0 ? mapped : [...prevPosts, ...mapped];
        console.log(`📊 전체 게시물 수: ${newPosts.length}`);
        return newPosts;
      });
      setHasMore(data.hasNext);
    } catch (err) {
      console.error("❌ 게시물 로딩 오류:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(0);
    fetchUserLikes();
  }, []);

  useEffect(() => {
    if (page > 0) {
      console.log(`📄 페이지 변경됨: ${page}`);
      fetchPosts(page);
    }
  }, [page]);

  useEffect(() => {
    // 기존 observer 정리
    if (observer.current) {
      observer.current.disconnect();
    }

    // 새로운 observer 생성
    observer.current = new IntersectionObserver(
      (entries) => {
        console.log("👁️ Intersection 감지:", {
          isIntersecting: entries[0].isIntersecting,
          hasMore,
          loadingMore,
        });

        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          console.log("🚀 다음 페이지 로드 트리거");
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // 100px 전에 미리 로드
      },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget && hasMore) {
      console.log("🎯 Observer 타겟 등록");
      observer.current.observe(currentTarget);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loading]);

  if (loading) return <div className="feed">로딩중...</div>;
  if (error) return <div className="feed">오류: {error}</div>;

  return (
    <div className="feed">
      {posts.map((post) => {
        const isLiked = likedPosts.has(post.id);

        return (
          <div key={post.id} className="post">
            <div className="post__header">
              <div className="post__profile">
                <div className="profile-pic">{post.username[0].toUpperCase()}</div>
                <span>{post.username}</span>
              </div>
            </div>
            <div className="post__image">
              <img src={post.image} alt="Post" />
            </div>
            <div className="post__actions">
              <div className="post__left-actions">
                <FaHeart
                  className={`icon ${isLiked ? "liked" : ""}`}
                  onClick={() => handleLike(post.id, post.likes)}
                  style={{
                    cursor: "pointer",
                    color: isLiked ? "#ed4956" : "#262626",
                    fill: isLiked ? "#ed4956" : "none",
                    stroke: isLiked ? "none" : "currentColor",
                    strokeWidth: isLiked ? 0 : 2,
                    transition: "all 0.2s ease",
                  }}
                />
                <FaComment className="icon" />
                <FaPaperPlane className="icon" />
              </div>
              <FaBookmark className="icon" />
            </div>
            {post.likes > 0 && (
              <div className="post__likes">
                <span>좋아요 {post.likes}개</span>
              </div>
            )}
            <div className="post__caption">
              <span>
                <strong>{post.username}</strong> {post.caption}
              </span>
            </div>
          </div>
        );
      })}

      {/* 무한 스크롤 감지 영역 */}
      {hasMore && (
        <div ref={observerTarget} className="feed-loading-trigger" style={{ minHeight: "50px" }}>
          {loadingMore ? (
            <div className="feed-loading-more">
              <div className="spinner"></div>
              <span>게시물 로딩 중...</span>
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "#8e8e8e", padding: "20px" }}>스크롤하여 더보기</div>
          )}
        </div>
      )}

      {!hasMore && posts.length > 0 && <div className="feed-end-message">모든 게시물을 불러왔습니다.</div>}
    </div>
  );
};

export default Feed;
