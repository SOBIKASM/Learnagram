import React, { useState, useEffect, useRef } from "react";
import "./Classroom.css";
import { useParams } from "react-router-dom";
import { classroomAPI } from "../services/classroomAPI";
import { useAuth } from "../context/AuthContext";

const Classroom = () => {
  const { classId } = useParams();
  const { user } = useAuth();
  const [classroom, setClassroom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [handRaised, setHandRaised] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchClassroomData();
  }, [classId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchClassroomData = async () => {
    try {
      setLoading(true);
      const response = await classroomAPI.getClassroom(classId);
      setClassroom(response.data);
      
      // Format participants from members list
      const formattedParticipants = response.data.members.map(member => ({
        id: member._id,
        name: member.name,
        role: member._id === response.data.createdBy ? "Host" : "Student",
        mic: true,
        camera: true,
        hand: false
      }));
      
      setParticipants(formattedParticipants);
      
      // Fetch messages
      const messagesResponse = await classroomAPI.getMessages(classId);
      setMessages(messagesResponse.data);
      
      setError(null);
    } catch (err) {
      console.error("Error fetching classroom:", err);
      setError("Failed to load classroom");
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleHand = async () => {
    try {
      await classroomAPI.toggleHand(classId);
      setHandRaised(!handRaised);
      setParticipants(prev =>
        prev.map(p =>
          p.id === user?.id ? { ...p, hand: !handRaised } : p
        )
      );
    } catch (err) {
      console.error("Error toggling hand:", err);
    }
  };

  const muteAll = async () => {
    try {
      await classroomAPI.muteAll(classId);
      setParticipants(prev =>
        prev.map(p =>
          p.role === "Student" ? { ...p, mic: false } : p
        )
      );
    } catch (err) {
      console.error("Error muting all:", err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const response = await classroomAPI.sendMessage(classId, input);
      setMessages([...messages, response.data]);
      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (loading) return <div className="loading">Loading classroom...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!classroom) return <div className="error">Classroom not found</div>;

  return (
    <div className="classroom-container">
      {/* Sidebar */}
      <div className="participants">
        <h3>{classroom.name}</h3>
        <p className="classroom-description">{classroom.description}</p>
        <p>👥 Participants: {participants.length}</p>

        <ul className="participants-list">
          {participants.map(person => (
            <li key={person.id} className="participant-item">
              <div className="participant-info">
                <span className="participant-name">{person.name}</span>
                {person.role === "Host" && (
                  <span className="host-tag"> 👑</span>
                )}
                {person.hand && (
                  <span className="hand-tag"> ✋</span>
                )}
              </div>
              <div className="participant-status">
                <span>{person.mic ? "🎤" : "🔇"}</span>
                <span>{person.camera ? "📷" : "🚫"}</span>
              </div>
            </li>
          ))}
        </ul>

        {user?.id === classroom.createdBy && (
          <button className="mute-btn" onClick={muteAll}>
            Mute All Students
          </button>
        )}
      </div>

      {/* Main Area */}
      <div className="classroom-main">
        {/* Video Section */}
        <div className="video-section">
          <div className="video-placeholder">
            <div className="live-indicator">🔴 LIVE</div>
            <div className="video-message">
              {classroom.name} - Live Session
            </div>
          </div>

          <div className="video-controls">
            <button 
              onClick={toggleHand} 
              className={handRaised ? "hand-raised" : ""}
            >
              ✋ {handRaised ? "Lower Hand" : "Raise Hand"}
            </button>
          </div>
        </div>

        {/* Files Section */}
        <div className="files-section">
          <h4>📁 Shared Files</h4>
          {classroom.files?.length > 0 ? (
            classroom.files.map(file => (
              <div key={file._id} className="file-item">
                <span className="file-icon">📎</span>
                <span className="file-name">{file.name}</span>
              </div>
            ))
          ) : (
            <p className="no-files">No files shared yet</p>
          )}
        </div>

        {/* Chat Section */}
        <div className="chat-section">
          <div className="chat-messages">
            {messages.map(msg => (
              <div 
                key={msg._id} 
                className={`chat-message ${msg.sender?._id === user?.id ? 'own-message' : ''}`}
              >
                <strong>{msg.sender?.name || 'Unknown'}:</strong>
                <span>{msg.text}</span>
                <small className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </small>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;