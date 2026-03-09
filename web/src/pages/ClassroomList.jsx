import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { classroomAPI } from "../services/classroomAPI";
import { useAuth } from "../context/AuthContext";
import "./ClassroomList.css";

const ClassroomList = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassroom, setNewClassroom] = useState({ name: '', description: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetchClassrooms();
  }, []);
  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const response = await classroomAPI.getClassrooms();
      setClassrooms(response.data.classrooms || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching classrooms:", err);
      setError("Failed to load classrooms");
    } finally {
      setLoading(false);
    }
  };
  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    try {
      const response = await classroomAPI.createClassroom(newClassroom);
      setClassrooms([...classrooms, response.data]);
      setShowCreateModal(false);
      setNewClassroom({ name: '', description: '' });
    } catch (err) {
      console.error("Error creating classroom:", err);
      setError("Failed to create classroom");
    }
  };

  const handleJoinClassroom = async (classId) => {
    try {
      await classroomAPI.joinClassroom(classId);
      // Refresh the list to show updated member count
      fetchClassrooms();
    } catch (err) {
      console.error("Error joining classroom:", err);
      setError("Failed to join classroom");
    }
  };

  if (loading) return <div className="loading">Loading classrooms...</div>;

  return (
    <div className="classroom-list-container">
      <div className="classroom-header">
        <h2 className="gradient-text">Your Classrooms</h2>
        {user?.user_id?.startsWith('MTR_') && (
          <Link to="/navigation/classroom/create" className="create-btn" style={{ textDecoration: 'none' }}>
            + Create Classroom
          </Link>
        )}
      </div>

      <div className="class-grid">
        {classrooms.length === 0 ? (
          <div className="no-classrooms" style={{ color: '#aaa' }}>No classrooms found.</div>
        ) : (
          classrooms.map((cls) => (
            <div key={cls.classroom_id} className="class-card-wrapper">
              <Link
                to={`/navigation/classroom/${cls.classroom_id}`}
                className="class-card"
                style={{ textDecoration: 'none' }}
              >
                <h3>{cls.name}</h3>
                <p>👨‍🏫 Mentor: {cls.mentor_id}</p>
                <p>👥 Students: {cls.student_ids?.length || 0}</p>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>ID: {cls.classroom_id}</p>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClassroomList;