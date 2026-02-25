import React from "react";
import LearnSnaps from "../components/LearnSnaps";
import "./Home.css";

function Home() {
  const posts = [
    {
      id: 1,
      user: {
        id: 101,
        name: "Sobika S M",
        username: "sobika_sm",
        profile_pic: "/assets/profile3.jpg"
      },
      caption: "Can someone explain paging in OS with a simple example?",
      media: {
        type: "image",
        src: "/assets/post.jpg"
      },
      likes: 12,
      comments: [
        {
          user: {
            name: "Prof. Kumar",
            username: "kumar_prof"
          },
          comment:
            "Paging divides memory into fixed-size blocks called pages."
        }
      ],
      timestamp: "2026-02-11T14:30:00Z"
    },
    {
      id: 2,
      user: {
        id: 102,
        name: "Arun Kumar",
        username: "arun_23",
        profile_pic: "/assets/profile2.jpg"
      },
      caption: "Sharing my DBMS handwritten notes 📚",
      media: {
        type: "image",
        src: "/assets/post.jpg"
      },
      likes: 25,
      comments: [],
      timestamp: "2026-02-10T10:15:00Z"
    },
    {
      id: 3,
      user: {
        id: 103,
        name: "Divya",
        username: "divya_codes",
        profile_pic: "/assets/profile1.jpg"
      },
      caption: "Anyone preparing for tomorrow's CN test? 😭",
      media: {
        type: "text",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit..."
      },
      likes: 5,
      comments: [
        {
          user: { name: "Rahul" },
          comment: "Yes! Let’s revise together."
        }
      ],
      timestamp: "2026-02-11T09:00:00Z"
    }
  ];

  return (
    <div className="home-container">
      <LearnSnaps />

      <div className="posts-section">
        {posts.map((post) => (
          <div className="post-card" key={post.id}>

            {/* Header */}
            <div className="post-header">
              <img
                src={post.user.profile_pic}
                alt=""
                className="profile-pic"
              />
              <div>
                <div className="post-name">{post.user.name}</div>
                <div className="post-username">
                  @{post.user.username}
                </div>
              </div>
            </div>

            {/* Caption */}
            <div className="post-caption">
              {post.caption}
            </div>

            {/* Media */}
            {post.media.type === "image" && (
              <img
                src={post.media.src}
                alt=""
                className="post-image"
              />
            )}

            {post.media.type === "text" && (
              <div className="post-text">
                {post.media.content}
              </div>
            )}

            {/* Footer */}
            <div className="post-footer">
              ❤️ {post.likes} Likes
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;