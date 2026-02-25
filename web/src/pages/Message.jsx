import React, { useState } from "react";
import "./Message.css";
import { IoCreateOutline, IoChevronBack } from "react-icons/io5";
import LearnSnaps from "../components/LearnSnaps";

const chatsData = [
  {
    id: 1,
    name: "Prof. Arun",
    message: "Sent you the syllabus PDF",
    time: "2m",
    active: true,
    unread: true,
    avatar: "https://via.placeholder.com/50",
  },
  {
    id: 2,
    name: "Study Group: AI",
    message: "Who's finished Assignment 3?",
    time: "15m",
    active: true,
    unread: true,
    avatar: "https://via.placeholder.com/50",
  },
  {
    id: 3,
    name: "Sneha (B.Tech)",
    message: "Thanks for the notes!",
    time: "1h",
    active: false,
    unread: false,
    avatar: "https://via.placeholder.com/50",
  },
  {
    id: 4,
    name: "Library Desk",
    message: "Your book is due tomorrow.",
    time: "3h",
    active: false,
    unread: false,
    avatar: "https://via.placeholder.com/50",
  },
];

function Message() {
  const [search, setSearch] = useState("");

  const filteredChats = chatsData.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="message-container">
      {/* HEADER */}
      <div className="message-header">
        <div className="header-left">
          <IoChevronBack className="back-icon" />
          <h2 className="username">learnagram_user</h2>
        </div>
        <IoCreateOutline className="create-msg-icon" />
      </div>

      {/* SEARCH BAR */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LIVE UPDATES SECTION */}
      <div className="message-stories">
        <h3 className="section-title">Live Updates</h3>
        <LearnSnaps />
      </div>

      {/* CHAT LIST */}
      <div className="chat-list">
        <div className="list-header">
          <h3>Conversations</h3>
          <span className="requests-btn">Requests</span>
        </div>

        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${chat.unread ? "unread" : ""}`}
          >
            <div className={`avatar-wrapper ${chat.unread ? "unread-ring" : ""}`}>
              <img
                src={chat.avatar}
                alt="img"
                className="chat-profile"
              />
              {chat.active && <div className="active-dot"></div>}
            </div>

            <div className="chat-info">
              <span className="chat-name">{chat.name}</span>
              <div className="chat-meta">
                <span className="last-msg">{chat.message}</span>
                <span className="dot">•</span>
                <span className="time">{chat.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Message;
