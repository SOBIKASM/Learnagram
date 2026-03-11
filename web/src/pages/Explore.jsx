import React, { useState, useEffect } from "react";
import "./Explore.css";
import axios from "axios";
import { postsAPI } from "../services/api";
import { IoTrashBinOutline } from "react-icons/io5";

const trendingTags = ["Data Structures", "AI", "Web Dev", "DBMS", "Cyber Security", "Java", "Python"];

function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:7001/api/posts/explore', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : res.data.posts || [];
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (post_id) => {
    try {
      await postsAPI.likePost(post_id, user.user_id);
      fetchPosts();
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const handleComment = async (post_id, text) => {
    if (!text.trim()) return;
    try {
      await postsAPI.commentOnPost(post_id, user.user_id, text);
      fetchPosts();
    } catch (err) {
      console.error('Answer failed:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await postsAPI.deletePost(postId, user.user_id);
      fetchPosts();
    } catch (err) {
      console.error('Delete post failed:', err);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await postsAPI.deleteComment(postId, commentId, user.user_id);
      fetchPosts();
    } catch (err) {
      console.error('Delete comment failed:', err);
    }
  };

  const filtered = posts.filter(p => {
    const matchesSearch = p.caption?.toLowerCase().includes(search.toLowerCase()) ||
      p.user_id?.toLowerCase().includes(search.toLowerCase());
    const matchesTag = activeTag
      ? p.caption?.toLowerCase().includes(activeTag.toLowerCase())
      : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="explore-container">

      {/* Search */}
      <div className="explore-search">
        <input
          type="text"
          placeholder="Search posts, users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Trending Tags */}
      <div className="trending-tags">
        {trendingTags.map((tag, i) => (
          <div
            key={i}
            className={`tag ${activeTag === tag ? 'active' : ''}`}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            style={{ cursor: 'pointer', opacity: activeTag && activeTag !== tag ? 0.5 : 1 }}
          >
            {tag}
          </div>
        ))}
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div style={{ color: '#8e8e8e', padding: '2rem', textAlign: 'center' }}>Loading posts...</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: '#8e8e8e', padding: '2rem', textAlign: 'center' }}>
          No posts found.
        </div>
      ) : (
        <div className="explore-feed" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filtered.map((post) => (
            <div className="post-card" key={post.post_id} style={{ background: '#fff', borderRadius: '8px', border: '1px solid #dbdbdb', overflow: 'hidden', padding: '12px' }}>
              {/* Post Header */}
              <div className="post-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', position: 'relative' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: '#efefef', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#262626', fontWeight: 'bold',
                  fontSize: '0.9rem', border: '1px solid #dbdbdb'
                }}>
                  {post.user_id?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="post-name" style={{ fontWeight: '600', fontSize: '0.9rem', color: '#262626' }}>{post.user_id}</div>
                  <div className="post-username" style={{ fontSize: '0.75rem', color: '#8e8e8e' }}>
                    {post.created_at ? new Date(post.created_at).toLocaleDateString() : ''}
                  </div>
                </div>
                {(user.user_id === post.user_id || user.user_id?.startsWith('MTR_')) && (
                  <button
                    onClick={() => handleDeletePost(post.post_id)}
                    style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', position: 'absolute', right: 0 }}
                  >
                    <IoTrashBinOutline size={18} />
                  </button>
                )}
              </div>

              {/* Image */}
              {post.image_url && (
                <img src={post.image_url} alt="" className="post-image"
                  style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }}
                />
              )}

              {/* Caption */}
              {post.caption && (
                <div className="post-caption" style={{ fontSize: '0.9rem', color: '#262626', marginBottom: '10px' }}>
                  <strong>{post.user_id}</strong> {post.caption}
                </div>
              )}

              {/* Footer */}
              <div className="post-footer" style={{ borderTop: '1px solid #efefef', paddingTop: '10px' }}>
                <button
                  onClick={() => handleLike(post.post_id)}
                  className="like-btn"
                  style={{
                    background: 'none', border: 'none', padding: '0',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>
                    {post.likes?.includes(user.user_id) ? '❤️' : '🤍'}
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#262626' }}>
                    {post.likes?.length || 0} Likes
                  </span>
                </button>

                {/* Answers Display */}
                {post.comments && post.comments.length > 0 && (
                  <div className="comments-display" style={{ marginTop: '8px' }}>
                    {post.comments.slice(0, 5).map((c, i) => (
                      <div key={i} style={{ fontSize: '0.85rem', color: '#262626', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>
                          <strong style={{ color: '#262626' }}>{c.user_id}</strong> {c.text}
                        </span>
                        {(c.user_id === user.user_id || post.user_id === user.user_id || user.user_id?.startsWith('MTR_')) && (
                          <button
                            onClick={() => handleDeleteComment(post.post_id, c._id)}
                            style={{ background: 'none', border: 'none', color: '#8e8e8e', cursor: 'pointer', fontSize: '0.8rem' }}
                          >
                            <IoTrashBinOutline />
                          </button>
                        )}
                      </div>
                    ))}
                    {post.comments.length > 5 && (
                      <div style={{ fontSize: '0.8rem', color: '#8e8e8e', marginTop: '4px' }}>
                        View all {post.comments.length} answers
                      </div>
                    )}
                  </div>
                )}

                {/* Answer Input */}
                <input
                  type="text"
                  placeholder="Give answer..."
                  style={{
                    width: '100%', marginTop: '10px', padding: '8px 0',
                    background: 'transparent', border: 'none', borderTop: '1px solid #efefef',
                    color: '#262626', fontSize: '0.85rem'
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleComment(post.post_id, e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Explore;