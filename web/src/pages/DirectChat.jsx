import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { io } from "socket.io-client";
import axios from "axios";

function DirectChat() {
  const { other_id } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('token');

  // Create a consistent room key (alphabetical so both users get same room)
  const roomKey = [user.user_id, other_id].sort().join('_');

  useEffect(() => {
    // Connect socket
    socketRef.current = io("http://localhost:7001");
    socketRef.current.emit("join_dm", roomKey);

    socketRef.current.on("receive_dm", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Fetch history + other user info
    const init = async () => {
      try {
        const [historyRes, userRes] = await Promise.all([
          axios.get(`http://localhost:7001/api/dm/${user.user_id}/${other_id}`,
            { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`http://localhost:7001/api/users/${other_id}`,
            { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setMessages(historyRes.data.messages || []);
        setOtherUser(userRes.data.user);
      } catch (err) {
        console.error('Failed to load chat:', err);
      } finally {
        setLoading(false);
      }
    };
    init();

    return () => socketRef.current.disconnect();
  }, [other_id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const messageData = {
      sender_id: user.user_id,
      receiver_id: other_id,
      content: input
    };

    // Emit via socket for real-time
    socketRef.current.emit("send_dm", { ...messageData, roomKey });

    // Save to DB
    try {
      await axios.post('http://localhost:7001/api/dm/send', messageData,
        { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.error('Failed to save message:', err);
    }

    setInput("");
  };

  if (loading) return <div style={{ color: '#fff', padding: '2rem' }}>Loading chat...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '90vh', padding: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
        <Link to="/navigation/messages" style={{ color: '#fff' }}>
          <IoChevronBack size={24} />
        </Link>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%', background: '#444',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
        }}>
          {otherUser?.username?.[0]?.toUpperCase() || '?'}
        </div>
        <div>
          <div style={{ color: '#fff', fontWeight: 'bold' }}>{otherUser?.username || other_id}</div>
          <div style={{ color: '#aaa', fontSize: '0.8rem' }}>@{other_id}</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px', background: '#1a1a1a', borderRadius: '8px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            marginBottom: '10px',
            display: 'flex',
            justifyContent: msg.sender_id === user.user_id ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              padding: '8px 12px', borderRadius: '16px', maxWidth: '70%',
              background: msg.sender_id === user.user_id ? '#3b82f6' : '#333',
              color: '#fff'
            }}>
              {msg.content}
              <div style={{ fontSize: '0.65rem', color: '#ccc', marginTop: '2px', textAlign: 'right' }}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <input
          type="text"
          placeholder="Message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          style={{ flex: 1, padding: '10px', background: '#333', border: 'none', borderRadius: '20px', color: '#fff' }}
        />
        <button
          onClick={sendMessage}
          style={{ padding: '10px 20px', background: '#3b82f6', border: 'none', borderRadius: '20px', color: '#fff', cursor: 'pointer' }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default DirectChat;