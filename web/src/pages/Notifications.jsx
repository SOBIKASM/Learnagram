import React from "react";
import "./Notification.css";

const notifications = [
  { id: 1, title: "New Assignment", message: "Math assignment 3 is due tomorrow!" },
  { id: 2, title: "Message", message: "Your study group has a new message." },
  { id: 3, title: "Curriculum Update", message: "New video lecture uploaded for Physics." },
  { id: 4, title: "Event", message: "Join the live Q&A session at 5 PM." },
];

const Notification = () => {
  return (
    <div className="notification-container">
      <h2 className="notification-header">Notifications</h2>
      <div className="notification-list">
        {notifications.map((note) => (
          <div key={note.id} className="notification-card">
            <h3 className="notification-title">{note.title}</h3>
            <p className="notification-message">{note.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;