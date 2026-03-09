import React, { useState, useEffect } from "react";
import "./Explore.css";
import axios from "axios";
import { postsAPI } from "../services/api";

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
      console.error('Comment failed:', err);
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
        <div style={{ color: '#aaa', padding: '2rem', textAlign: 'center' }}>Loading posts...</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: '#aaa', padding: '2rem', textAlign: 'center' }}>
          No posts found.
        </div>
      ) : (
        <div className="explore-feed">
          {filtered.map((post) => (
            <div className="post-card" key={post.post_id}>
              {/* Post Header */}
              <div className="post-header">
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: '#444', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#fff', fontWeight: 'bold'
                }}>
                  {post.user_id?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="post-name">{post.user_id}</div>
                  <div className="post-username" style={{ fontSize: '0.75rem', color: '#aaa' }}>
                    {post.created_at ? new Date(post.created_at).toLocaleDateString() : ''}
                  </div>
                </div>
              </div>

              {/* Caption */}
              {post.caption && (
                <div className="post-caption">{post.caption}</div>
              )}

              {/* Image */}
              {post.image_url && (
                <img src={post.image_url} alt="" className="post-image"
                  style={{ width: '100%', borderRadius: '8px', marginTop: '8px' }}
                />
              )}

              {/* Footer */}
              <div className="post-footer">
                <button
                  onClick={() => handleLike(post.post_id)}
                  className="like-btn"
                  style={{
                    background: 'none', border: 'none', color: '#fff',
                    cursor: 'pointer', fontSize: '0.9rem', padding: '4px 0'
                  }}
                >
                  {post.likes?.includes(user.user_id) ? '❤️' : '🤍'} {post.likes?.length || 0} Likes
                </button>

                {/* Comments */}
                {post.comments?.length > 0 && (
                  <div className="comments-display" style={{ marginTop: '6px' }}>
                    {post.comments.slice(0, 2).map((c, i) => (
                      <div key={i} style={{ fontSize: '0.85rem', color: '#ccc' }}>
                        <strong style={{ color: '#fff' }}>{c.user_id}</strong> {c.text}
                      </div>
                    ))}
                    {post.comments.length > 2 && (
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>
                        View all {post.comments.length} comments
                      </div>
                    )}
                  </div>
                )}

                {/* Comment Input */}
                <input
                  type="text"
                  placeholder="Add a comment..."
                  style={{
                    width: '100%', marginTop: '8px', padding: '6px 10px',
                    background: '#222', border: '1px solid #333', borderRadius: '20px',
                    color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box'
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