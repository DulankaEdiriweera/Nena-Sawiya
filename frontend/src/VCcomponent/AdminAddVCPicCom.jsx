import React, { useState } from "react";
import axios from "axios";

export default function AdminAddVCPicCom() {
  const [title, setTitle] = useState("");
  const [taskNumber, setTaskNumber] = useState("");
  const [level, setLevel] = useState("easy");
  const [optionsCount, setOptionsCount] = useState(4);
  const [image, setImage] = useState(null);

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage("Please upload an image.");
      setIsError(true);
      return;
    }

    const formData = new FormData();
    formData.append("title", title || "VC Picture Completion");
    formData.append("task_number", taskNumber);
    formData.append("options_count", optionsCount);

    // levels[] (send ONE main level)
    formData.append("levels[]", level);

    formData.append("image", image);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/vc_pic_com/add",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage(`${res.data.message} ✅ activity_id: ${res.data.activity_id}`);
      setIsError(false);

      setTitle("");
      setTaskNumber("");
      setLevel("easy");
      setOptionsCount(4);
      setImage(null);
    } catch (err) {
      console.error(err);
      setMessage("Error adding picture completion activity.");
      setIsError(true);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 650, margin: "0 auto" }}>
      <h2>Admin - Add Picture Completion</h2>

      {message && (
        <div
          style={{
            padding: 10,
            marginTop: 12,
            borderRadius: 8,
            border: "1px solid",
            borderColor: isError ? "#ff9a9a" : "#9aff9a",
            background: isError ? "#ffeaea" : "#eaffea",
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: 10 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Task Number</label>
          <input
            type="number"
            value={taskNumber}
            onChange={(e) => setTaskNumber(e.target.value)}
            style={{ width: "100%", padding: 10 }}
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Level (Auto Grid)</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            style={{ width: "100%", padding: 10 }}
          >
            <option value="easy">easy </option>
            <option value="medium">medium </option>
            <option value="hard">hard </option>
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Options Count</label>
          <input
            type="number"
            min={2}
            max={8}
            value={optionsCount}
            onChange={(e) => setOptionsCount(Number(e.target.value))}
            style={{ width: "100%", padding: 10 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            required
          />
        </div>

        <button type="submit" style={{ padding: "10px 14px" }}>
          Add Activity
        </button>
      </form>
    </div>
  );
}