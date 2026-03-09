import React, { useState, useEffect } from "react";
import LearnSnaps from "../components/LearnSnaps";
import { postsAPI } from '../services/api';
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [followStatus, setFollowStatus] = useState({});
  const [requests, setRequests] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const token = localStorage.getItem('token');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getHomePosts(user.user_id);
      setPosts(Array.isArray(response.data) ? response.data : response.data?.posts || []);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get(
        `http://localhost:7001/api/users/suggestions/${user.user_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `http://localhost:7001/api/users/requests/${user.user_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchSuggestions();
    fetchRequests();
  }, []);

  const handleFollow = async (target_user_id) => {
    try {
      const res = await axios.post(
        'http://localhost:7001/api/users/follow',
        { from_user_id: user.user_id, to_user_id: target_user_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFollowStatus(prev => ({ ...prev, [target_user_id]: res.data.status }));
    } catch (err) {
      console.error('Follow failed:', err);
    }
  };

  const handleAccept = async (requester_id) => {
    try {
      await axios.post(
        'http://localhost:7001/api/users/accept',
        { user_id: user.user_id, requester_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(prev => prev.filter(r => r.user_id !== requester_id));
    } catch (err) {
      console.error('Accept failed:', err);
    }
  };

  const handleDecline = async (requester_id) => {
    try {
      await axios.post(
        'http://localhost:7001/api/users/decline',
        { user_id: user.user_id, requester_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(prev => prev.filter(r => r.user_id !== requester_id));
    } catch (err) {
      console.error('Decline failed:', err);
    }
  };

  const handleLike = async (postId) => {
    try {
      await postsAPI.likePost(postId, user.user_id);
      fetchPosts();
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const handleComment = async (postId, text) => {
    if (!text) return;
    try {
      await postsAPI.commentOnPost(postId, user.user_id, text);
      fetchPosts();
    } catch (err) {
      console.error('Comment failed:', err);
    }
  };

  const getFollowLabel = (target_user_id, isPrivate) => {
    const status = followStatus[target_user_id];
    if (status === 'following') return 'Following';
    if (status === 'requested') return 'Requested';
    return isPrivate ? 'Request' : 'Follow';
  };

  const getFollowButtonClass = (target_user_id) => {
    const status = followStatus[target_user_id];
    if (status === 'following' || status === 'requested') return 'following';
    return 'follow';
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: isMobile ? '0' : '28px', 
      justifyContent: 'center',
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: isMobile ? '10px' : '20px'
    }}>
      {/* LEFT — Main Feed */}
      <div className="home-container" style={{ 
        flex: 1, 
        maxWidth: isMobile ? '100%' : '600px',
        padding: isMobile ? '0' : '0',
        margin: '0 auto'
      }}>
        <LearnSnaps />
        <div className="posts-section">
          {loading ? (
            <div className="loading">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="no-posts">No posts yet. Follow someone to see their posts!</div>
          ) : (
            posts.map((post) => (
              <div className="post-card" key={post.post_id}>
                <div className="post-header">
                  <img 
                    src={post.profile_pic || `https://ui-avatars.com/api/?name=${post.username}&background=random`} 
                    alt="" 
                    className="profile-pic" 
                  />
                  <div>
                    <div className="post-name">{post.username || "User"}</div>
                    <div className="post-username">@{post.user_id}</div>
                  </div>
                </div>
                
                {post.image_url && (
                  <img src={post.image_url} alt="" className="post-image" />
                )}
                
                <div className="post-caption">
                  <strong>{post.username || "User"}</strong> {post.caption}
                </div>
                
                <div className="post-footer">
                  <button onClick={() => handleLike(post.post_id)} className="like-btn">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {post.likes?.length || 0} likes
                  </button>
                  
                  <div className="comments-display">
                    {post.comments?.map((c, i) => (
                      <div key={i} className="comment-item">
                        <strong>{c.user_id}</strong> {c.text}
                      </div>
                    ))}
                  </div>
                  
                  <div className="comment-input-area">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleComment(post.post_id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT — Suggestions Panel - Hidden on mobile */}
      {!isMobile && (
        <div className="suggestions-panel">
          {/* Current User */}
          <div className="current-user">
            <div className="current-user-avatar">
              {user.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="current-user-info">
              <div className="username">{user.username}</div>
              <div className="user-id">{user.user_id}</div>
            </div>
          </div>

          {/* Follow Requests */}
          {requests.length > 0 && (
            <div className="follow-requests">
              <div className="section-header">Follow Requests</div>
              {requests.map((req) => (
                <div key={req.user_id} className="request-item">
                  <div className="request-user">
                    <div className="request-avatar">
                      {req.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="request-info">
                      <div className="name">{req.username}</div>
                      <div className="handle">{req.user_id}</div>
                    </div>
                  </div>
                  <div className="request-actions">
                    <button onClick={() => handleAccept(req.user_id)} className="accept-btn">
                      Accept
                    </button>
                    <button onClick={() => handleDecline(req.user_id)} className="decline-btn">
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Suggestions */}
          <div className="suggestions-list">
            <div className="section-header">Suggested For You</div>
            {suggestions.length === 0 ? (
              <div className="no-suggestions">No suggestions available.</div>
            ) : (
              suggestions.map((s) => (
                <div key={s.user_id} className="suggestion-item">
                  <div className="suggestion-user">
                    <div className="suggestion-avatar">
                      {s.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="suggestion-info">
                      <div className="name">
                        {s.username}
                        {s.isPrivate && <span className="private-badge">🔒</span>}
                      </div>
                      <div className="handle">{s.name || s.user_id}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFollow(s.user_id)}
                    disabled={!!followStatus[s.user_id]}
                    className={`follow-btn ${getFollowButtonClass(s.user_id)}`}
                  >
                    {getFollowLabel(s.user_id, s.isPrivate)}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;