import React from 'react';
import './Profile.css';
import { IoGridOutline, IoBookmarkOutline, IoPersonCircleOutline } from "react-icons/io5";

const userData = {
  username: "learnagram_student",
  fullName: "Learnagram",
  bio: "📚 Computer Science & Engineering | Class of 2026\n💻 Learning React & Instagram UI\n✨ 'Code is like humor. When you have to explain it, it’s bad.'",
  postsCount: 42,
  followers: "1.2k",
  following: 850,
  avatar: "/logo.png"
};

function Profile() {
  return (
    <div className="profile-container">
      {/* Header Section */}
      <header className="profile-header">
        <div className="avatar-section">
          <img src={userData.avatar} alt="profile" className="profile-photo" />
        </div>

        <section className="info-section">
          <div className="user-settings">
            <h2 className="username">{userData.username}</h2>
            <button className="edit-btn">Edit Profile</button>
            <button className="archive-btn">View Archive</button>
          </div>

          <div className="stats">
            <span><strong>{userData.postsCount}</strong> posts</span>
            <span><strong>{userData.followers}</strong> followers</span>
            <span><strong>{userData.following}</strong> following</span>
          </div>

          <div className="bio">
            <span className="full-name">{userData.fullName}</span>
            <pre className="bio-text">{userData.bio}</pre>
          </div>
        </section>
      </header>

      {/* Tabs Section */}
      <div className="profile-tabs">
        <div className="tab active"><IoGridOutline /> POSTS</div>
        <div className="tab"><IoBookmarkOutline /> SAVED</div>
        <div className="tab"><IoPersonCircleOutline /> TAGGED</div>
      </div>

      {/* Post Grid Section */}
      <div className="post-grid">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="grid-item">
            <div className="overlay"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;