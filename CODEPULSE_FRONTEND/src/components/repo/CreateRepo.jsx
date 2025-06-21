import React, { useState } from "react";
import axios from "axios";
import "./CreateRepo.css";

const CreateRepo = ({ onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // TODO: Replace with dynamic logged-in user ID
  const ownerId = "6824d62cf310111065661a2e";

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Repository name is required!");
      return;
    }

    setUploading(true);

    // Upload files to Cloudinary
    const uploadedContent = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "your_upload_preset"); // Set your Cloudinary upload preset

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/your_cloud_name/auto/upload",
          formData
        );

        uploadedContent.push({
          fileName: file.name,
          cloudinaryUrl: response.data.secure_url,
        });
      } catch (err) {
        console.error("File upload error:", err);
        alert(`Failed to upload file: ${file.name}`);
        setUploading(false);
        return;
      }
    }

    const repoData = {
      name,
      description,
      visibility: !isPrivate,
      owner: ownerId,
      content: uploadedContent,
      issues: [],
    };

    onCreate(repoData);
    setName("");
    setDescription("");
    setIsPrivate(false);
    setFiles([]);
    setUploading(false);
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

        <label>
          Upload Files
          <input type="file" multiple onChange={handleFileChange} />
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
          />
          Private
        </label>

        <button type="submit" className="create-btn" disabled={uploading}>
          {uploading ? "Uploading..." : "Create Repository"}
        </button>
      </form>
    </div>
  );
};

export default CreateRepo;
