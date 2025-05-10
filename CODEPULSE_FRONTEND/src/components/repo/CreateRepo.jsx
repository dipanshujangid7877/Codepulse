import React, { useState } from "react";
import "./CreateRepo.css";

const CreateRepo = ({ onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  // Temporary hardcoded owner ID (replace with logged-in user's ID dynamically)
  const ownerId = "662f3f3fd0ea1570205d5e97";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Repository name is required!");
      return;
    }

    const repoData = {
      name,
      description,
      visibility: !isPrivate,      // correct field expected by backend
      owner: ownerId,              // ensure owner is included to prevent 404
      content: [],
      issues: [],
    };

    onCreate(repoData);
    setName("");
    setDescription("");
    setIsPrivate(false);
  };

  return (
    <div className="create-repo-container">
      <h2>Create a New Repository</h2>
      <form onSubmit={handleSubmit} className="repo-form">
        <label>
          Repository Name<span className="required">*</span>
          <input
            type="text"
            value={name}
            placeholder="e.g. my-awesome-repo"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Description (Optional)
          <textarea
            value={description}
            placeholder="Describe your repository"
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
          />
          Private
        </label>

        <button type="submit" className="create-btn">
          Create Repository
        </button>
      </form>
    </div>
  );
};

export default CreateRepo;
