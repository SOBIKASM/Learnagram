import React, { useState } from "react";
import "./Create.css";

const Create = () => {
  const [postText, setPostText] = useState("");
  const [image, setImage] = useState(null);
  const [visibility, setVisibility] = useState("Public");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ postText, image, visibility });
    alert("Post Created!");
    setPostText("");
    setImage(null);
    setVisibility("Public");
  };

  return (
    <div className="create-container">
      <h2 className="create-header">Create Post</h2>
      <form className="create-form" onSubmit={handleSubmit}>
        <textarea
          className="create-textarea"
          placeholder="What's on your mind?"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="create-file-input"
        />

        {image && (
          <div className="image-preview">
            <img src={image} alt="Preview" />
          </div>
        )}

        <div className="visibility-select">
          <label>
            Visibility:
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </label>
        </div>

        <button type="submit" className="create-submit-btn">
          Post
        </button>
      </form>
    </div>
  );
};

export default Create;