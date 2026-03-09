import React, { useState, useEffect } from "react";
import "./Notification.css";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:7001/api/classrooms/notifications/${user.user_id}`);
        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading) return <div className="loading">Loading notifications...</div>;

  return (
    <div className="notification-container">
      <h2 className="notification-header">Notifications</h2>
      <div className="notification-list">
        {notifications.length === 0 ? (
          <div style={{ color: '#aaa', textAlign: 'center', marginTop: '20px' }}>No new notifications.</div>
        ) : (
          notifications.map((note, index) => (
            <div key={index} className="notification-card">
              <h3 className="notification-title">{note.type.toUpperCase()}</h3>
              <p className="notification-message">{note.content}</p>
              <small style={{ color: '#888' }}>{new Date(note.createdAt).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;