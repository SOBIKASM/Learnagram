import React, { useState } from "react";
import "./Classroom.css";
import { useParams } from "react-router-dom";

const Classroom = () => {
  const { classId } = useParams();

  // 🔥 MULTI-CLASS JSON STRUCTURE
  const classroomJSON = {
    ds1class: {
      className: "Data Structures - Live Session",
      host: "Prof. Sharma",
      participants: [
        { id: 1, name: "Prof. Sharma", role: "Host", mic: true, camera: true, hand: false },
        { id: 2, name: "Ananya", role: "Student", mic: false, camera: false, hand: false },
        { id: 3, name: "Rahul", role: "Student", mic: false, camera: false, hand: false },
        { id: 4, name: "You", role: "Student", mic: true, camera: true, hand: false }
      ],
      files: [
        { id: 1, name: "DS_Trees.pdf" },
        { id: 2, name: "Stack_Assignment.docx" }
      ],
      messages: [
        { id: 1, user: "Prof. Sharma", text: "Today we discuss Trees." }
      ]
    },

    dbmsclass: {
      className: "DBMS - ER Models",
      host: "Dr. Meena",
      participants: [
        { id: 1, name: "Dr. Meena", role: "Host", mic: true, camera: true, hand: false },
        { id: 2, name: "Karthik", role: "Student", mic: false, camera: false, hand: false },
        { id: 3, name: "You", role: "Student", mic: true, camera: true, hand: false }
      ],
      files: [
        { id: 1, name: "ER_Diagrams.pdf" }
      ],
      messages: [
        { id: 1, user: "Dr. Meena", text: "We will design ER models today." }
      ]
    }
  };

  const selectedClass = classroomJSON[classId];

  if (!selectedClass) {
    return <h2 style={{ padding: "40px" }}>Class Not Found</h2>;
  }

  const [participants, setParticipants] = useState(selectedClass.participants);
  const [messages, setMessages] = useState(selectedClass.messages);
  const [input, setInput] = useState("");

  const toggleHand = () => {
    setParticipants(prev =>
      prev.map(p =>
        p.name === "You" ? { ...p, hand: !p.hand } : p
      )
    );
  };

  const muteAll = () => {
    setParticipants(prev =>
      prev.map(p =>
        p.role === "Student" ? { ...p, mic: false } : p
      )
    );
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([
      ...messages,
      { id: messages.length + 1, user: "You", text: input }
    ]);

    setInput("");
  };

  return (
    <div className="classroom-container">

      {/* Sidebar */}
      <div className="participants">
        <h3>{selectedClass.className}</h3>
        <p>👥 Attendance: {participants.length}</p>

        <ul>
          {participants.map(person => (
            <li key={person.id}>
              {person.name}
              {person.role === "Host" && (
                <span className="host-tag"> (Host)</span>
              )}
              {person.hand && (
                <span className="hand-tag"> ✋</span>
              )}
              <div className="status">
                {person.mic ? "🎤" : "🔇"}
                {person.camera ? " 📷" : " 🚫"}
              </div>
            </li>
          ))}
        </ul>

        <button className="mute-btn" onClick={muteAll}>
          Mute All Students
        </button>
      </div>

      {/* Main Area */}
      <div className="classroom-main">

        {/* Video Section */}
        <div className="video-section">
          <div className="video-placeholder">
            🎥 Live Class Streaming
          </div>

          <div className="video-controls">
            <button onClick={toggleHand}>✋ Raise Hand</button>
          </div>
        </div>

        {/* Files Section */}
        <div className="files-section">
          <h4>Shared Files</h4>
          {selectedClass.files.map(file => (
            <div key={file.id} className="file-item">
              📎 {file.name}
            </div>
          ))}
        </div>

        {/* Chat Section */}
        <div className="chat-section">
          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className="chat-message">
                <strong>{msg.user}:</strong> {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Classroom;