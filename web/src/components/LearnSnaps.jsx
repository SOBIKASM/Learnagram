import React from "react";
import "./LearnSnaps.css";

function LearnSnaps() {
  const snaps = [
    { title: "AAAA", type: "primary" },
    { title: "BBBB", type: "secondary" },
    { title: "CCCC", type: "accent" },
    { title: "DDDD", type: "primary" },
    { title: "EEEE", type: "secondary" },
  ];

  return (
    <div className="learnsnaps-container">
  
      <div className="learnsnaps-bar">
        {snaps.map((snap, index) => (
          <div className="snap-item" key={index}>
            <div className={`snap-ring ${snap.type}`}>
              <div className="snap-inner">
                {snap.title.charAt(0)}
              </div>
            </div>
            <span>{snap.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LearnSnaps;
