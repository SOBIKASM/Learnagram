import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { classroomAPI } from "../services/api";
import "./Create.css";

const CreateAssignment = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [formData, setFormData] = useState({
    assignment_id: "",
    classroom_id: "",
    title: "",
    description: "",
    due_date: "",
    enrolled_students: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const res = await classroomAPI.getClassrooms();
        setClassrooms(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClassrooms();
  }, []);

  if (!user?.user_id?.startsWith('MTR_')) {
    return <div className="error">Access Denied: Only mentors can create assignments.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const studentIds = formData.enrolled_students.split(",").map(id => id.trim()).filter(id => id);
      await classroomAPI.createAssignment({
        ...formData,
        mentor_id: user.user_id,
        enrolled_students: studentIds,
        user_id: user.user_id
      });
      navigate("/navigation/assignments");
    } catch (err) {
      console.error(err);
      alert("Error creating assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-container">
      <h2 className="create-header">Create New Assignment</h2>
      <form className="create-form" onSubmit={handleSubmit}>
        <select
          style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#333', border: 'none', borderRadius: '4px', color: '#fff' }}
          value={formData.classroom_id}
          onChange={(e) => setFormData({ ...formData, classroom_id: e.target.value })}
          required
        >
          <option value="">Select Classroom</option>
          {classrooms.map(cls => (
            <option key={cls.classroom_id} value={cls.classroom_id}>{cls.name} ({cls.classroom_id})</option>
          ))}
        </select>
        <input
          style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#333', border: 'none', borderRadius: '4px', color: '#fff' }}
          placeholder="Assignment ID"
          value={formData.assignment_id}
          onChange={(e) => setFormData({ ...formData, assignment_id: e.target.value })}
          required
        />
        <input
          style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#333', border: 'none', borderRadius: '4px', color: '#fff' }}
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <textarea
          className="create-textarea"
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <input
          type="date"
          style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#333', border: 'none', borderRadius: '4px', color: '#fff' }}
          value={formData.due_date}
          onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
          required
        />
        <textarea
          className="create-textarea"
          placeholder="Student IDs (comma separated)"
          value={formData.enrolled_students}
          onChange={(e) => setFormData({ ...formData, enrolled_students: e.target.value })}
        />
        <button type="submit" className="create-submit-btn" disabled={loading}>
          {loading ? "Creating..." : "Create Assignment"}
        </button>
      </form>
    </div>
  );
};

export default CreateAssignment;
