import "./Explore.css";

const trendingTags = [
  "Data Structures",
  "AI",
  "Web Dev",
  "DBMS",
  "Cyber Security",
  "Java",
  "Python"
];

const exploreCards = [
  { id: 1, title: "React Assignment 3", subject: "Web Dev" },
  { id: 2, title: "AI Mini Project", subject: "Artificial Intelligence" },
  { id: 3, title: "DBMS Lab Record", subject: "Database" },
  { id: 4, title: "DSA Practice Sheet", subject: "Data Structures" },
  { id: 5, title: "Cyber Security Quiz", subject: "Security" },
  { id: 6, title: "Java OOP Task", subject: "Java" }
];

function Explore() {
  return (
    <div className="explore-container">

      {/* Search */}
      <div className="explore-search">
        <input type="text" placeholder="Search subjects, assignments..." />
      </div>

      {/* Trending Tags */}
      <div className="trending-tags">
        {trendingTags.map((tag, index) => (
          <div key={index} className="tag">{tag}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="explore-grid">
        {exploreCards.map(card => (
          <div key={card.id} className="explore-card">
            <h4>{card.title}</h4>
            <p>{card.subject}</p>
            <button>View</button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Explore;