import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Assignment.css";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [activeTab, setActiveTab] = useState("pending");
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(
          `http://localhost:7001/api/classrooms/my-assignments/${user.user_id}`
        );
        const data = await response.json();
        setAssignments(Array.isArray(data) ? data : data.assignments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const handleFileChange = (id, file) => {
    setFiles(prev => ({ ...prev, [id]: file }));
  };

  const handleSubmit = (id) => {
    if (!files[id]) { alert("Choose a file first"); return; }
    setSubmitted(prev => ({ ...prev, [id]: true }));
    alert("Assignment submitted successfully!");
  };

  const getDaysLeft = (due_date) => {
    const diff = new Date(due_date) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const pendingAssignments = assignments.filter(a => !submitted[a.assignment_id]);
  const submittedAssignments = assignments.filter(a => submitted[a.assignment_id]);

  const displayList = activeTab === "pending" ? pendingAssignments : submittedAssignments;

  if (loading) return <div className="loading">Loading assignments...</div>;

  return (
    <div className="assignment-container">

      {/* Header */}
      <div className="assignment-page-header">
        <div>
          <h2 className="assignment-title">Assignments</h2>
          <p className="assignment-subtitle">Manage your coursework and deadlines</p>
        </div>
        {user?.user_id?.startsWith('MTR_') && (
          <Link to="/navigation/assignments/create" className="create-assignment-btn">
            + Create Assignment
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="assignment-stats">
        <div className="stat-card stat-pending">
          <div className="stat-number">{pendingAssignments.length}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card stat-submitted">
          <div className="stat-number">{submittedAssignments.length}</div>
          <div className="stat-label">Submitted</div>
        </div>
        <div className="stat-card stat-total">
          <div className="stat-number">{assignments.length}</div>
          <div className="stat-label">Total</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="assignment-tabs">
        <button
          className={`assignment-tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Assignments
        </button>
        <button
          className={`assignment-tab ${activeTab === 'submitted' ? 'active' : ''}`}
          onClick={() => setActiveTab('submitted')}
        >
          Submitted
        </button>
      </div>

      {/* Assignment Cards */}
      {displayList.length === 0 ? (
        <div className="no-assignments">
          {activeTab === 'pending' ? 'No pending assignments 🎉' : 'No submitted assignments yet.'}
        </div>
      ) : (
        displayList.map((item) => {
          const daysLeft = getDaysLeft(item.due_date);
          const isUrgent = daysLeft <= 2;

          return (
            <div key={item.assignment_id} className="assignment-card">
              <div className="assignment-card-top">
                <div className="assignment-card-left">
                  <div className="assignment-card-header">
                    <h4 className="assignment-name">{item.title}</h4>
                    {submitted[item.assignment_id] && (
                      <span className="submitted-badge">✓ Submitted</span>
                    )}
                  </div>
                  <p className="assignment-class">{item.classroom_id}</p>

                  <div className="assignment-meta">
                    {daysLeft > 0 ? (
                      <span className={`days-left ${isUrgent ? 'urgent' : ''}`}>
                        ⏰ {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                      </span>
                    ) : (
                      <span className="days-left overdue">⚠ Overdue</span>
                    )}
                    {item.points && (
                      <span className="points-badge">🏆 {item.points} points</span>
                    )}
                  </div>

                  <p className="assignment-description">{item.description}</p>
                  <p className="assignment-due">
                    Due: {item.due_date ? new Date(item.due_date).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    }) : 'No due date'}
                  </p>
                </div>
              </div>

              {!submitted[item.assignment_id] && (
                <div className="assignment-actions">
                  <label className="choose-file-btn">
                    {files[item.assignment_id]
                      ? `📄 ${files[item.assignment_id].name}`
                      : '📎 Choose File'}
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileChange(item.assignment_id, e.target.files[0])}
                    />
                  </label>
                  <button
                    className="submit-assignment-btn"
                    onClick={() => handleSubmit(item.assignment_id)}
                  >
                    Submit Assignment
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Assignments;