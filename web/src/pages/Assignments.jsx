import React, { useState } from "react";
import "./Assignment.css";

const Assignment = () => {
  const assignments = [
    {
      id: 1,
      subject: "Data Structures",
      assNo: "Assignment 1",
      assignedBy: "Prof. Sharma"
    },
    {
      id: 2,
      subject: "DBMS",
      assNo: "Assignment 2",
      assignedBy: "Dr. Meena"
    },{
      id: 3,
      subject: "OS",
      assNo: "Assignment 2",
      assignedBy: "Dr. Howl Pendragron"
    }
  ];

  const [files, setFiles] = useState({});
  const [submitted, setSubmitted] = useState({});

  const handleFileChange = (id, file) => {
    setFiles(prev => ({ ...prev, [id]: file }));
  };

  const handleSubmit = (id) => {
    if (!files[id]) {
      alert("Choose file first");
      return;
    }
    setSubmitted(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="assignment-container">

      {assignments.map((item) => (
        <div key={item.id} className="assignment-card">

          {/* Left Side */}
          <div className="assignment-info">
            <h4>
              {item.subject} : {item.assNo}
            </h4>
            <p className="assigned-by">
              by {item.assignedBy}
            </p>

            {submitted[item.id] && (
              <span className="submitted-tag">Submitted</span>
            )}
          </div>

          {/* Right Side */}
          <div className="assignment-actions">

            <label className="choose-btn">
              Choose
              <input
                type="file"
                onChange={(e) =>
                  handleFileChange(item.id, e.target.files[0])
                }
              />
            </label>

            <button
              className="submit-btn"
              onClick={() => handleSubmit(item.id)}
            >
              Submit
            </button>

          </div>

        </div>
      ))}

    </div>
  );
};

export default Assignment;