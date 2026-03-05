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
      setClassrooms(response.data);
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
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="classroom-list-container">
      <div className="classroom-header">
        <h2 className="gradient-text">Live & Upcoming Classes</h2>
        <button 
          className="create-btn"
          onClick={() => setShowCreateModal(true)}
        >
          + Create Classroom
        </button>
      </div>

      <div className="class-grid">
        {classrooms.map((cls) => (
          <div key={cls._id} className="class-card-wrapper">
            <Link
              to={`/navigation/classroom/${cls._id}`}
              className="class-card"
            >
              <h3>{cls.name}</h3>
              <p>👨‍🏫 Created by: {cls.createdBy?.name || 'Unknown'}</p>
              <p>👥 {cls.members?.length || 0} members</p>
              {cls.description && <p className="description">{cls.description}</p>}
            </Link>
            {!cls.members?.includes(user?.id) && (
              <button 
                className="join-btn"
                onClick={() => handleJoinClassroom(cls._id)}
              >
                Join Class
              </button>
            )}
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create New Classroom</h3>
            <form onSubmit={handleCreateClassroom}>
              <input
                type="text"
                placeholder="Classroom Name"
                value={newClassroom.name}
                onChange={(e) => setNewClassroom({...newClassroom, name: e.target.value})}
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={newClassroom.description}
                onChange={(e) => setNewClassroom({...newClassroom, description: e.target.value})}
                rows="3"
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="create-btn">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassroomList;