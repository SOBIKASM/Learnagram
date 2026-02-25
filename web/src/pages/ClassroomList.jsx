import React from "react";
import { Link } from "react-router-dom";
import "./ClassroomList.css";

const classroomJSON = [
  {
    id: "ds1class",
    title: "Data Structures - Unit 1",
    instructor: "Prof. Sharma",
    time: "10:00 AM"
  },
  {
    id: "dbmsclass",
    title: "Database Management Systems",
    instructor: "Dr. Meena",
    time: "12:00 PM"
  },
  {
    id: "aiintro",
    title: "Introduction to AI",
    instructor: "Prof. Arjun",
    time: "2:00 PM"
  }
];

const ClassroomList = () => {
  return (
    <div className="classroom-list-container">
      <h2 className="gradient-text">Live & Upcoming Classes</h2>

      <div className="class-grid">
        {classroomJSON.map((cls) => (
          <Link
            key={cls.id}
            to={`/navigation/classroom/${cls.id}`}
            className="class-card"
          >
            <h3>{cls.title}</h3>
            <p>👨‍🏫 {cls.instructor}</p>
            <p>⏰ {cls.time}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ClassroomList;