import React, { useEffect, useState } from "react";
import { FaHeart, FaComment, FaPaperPlane, FaBookmark } from "react-icons/fa";
import "./Feed.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:8090/api/posts");
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        // Map backend fields to front-end expected shape
        const mapped = data.map((p) => ({
          id: p.postId,
          username: p.user?.nickname || p.user?.username || `user${p.userNo}`,
          image: p.imageUrl || p.image_url || "https://via.placeholder.com/400x400",
          likes: p.likeCount || p.like_count || 0,
          caption: p.content || "",
        }));
        setPosts(mapped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="feed">로딩중...</div>;
  if (error) return <div className="feed">오류: {error}</div>;

  return (
    <div className="feed">
      {posts.map((post) => (
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
              <FaHeart className="icon" />
              <FaComment className="icon" />
              <FaPaperPlane className="icon" />
            </div>
            <FaBookmark className="icon" />
          </div>
          <div className="post__likes">
            <span>{post.likes} likes</span>
          </div>
          <div className="post__caption">
            <span>
              <strong>{post.username}</strong> {post.caption}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
