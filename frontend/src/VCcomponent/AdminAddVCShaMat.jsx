import React, { useRef, useState } from "react";
import axios from "axios";
import AdminHeader from "../Components/AdminHeader";

export default function AdminAddVCShaMat() {
  const apiBase = "http://localhost:5000";
  const correctRef = useRef(null);
  const optionsRef = useRef(null);

  const [title, setTitle] = useState("");
  const [taskNumber, setTaskNumber] = useState("");

  // ✅ dropdown (single)
  const [level, setLevel] = useState("easy");

  const [correctImage, setCorrectImage] = useState(null);
  const [correctPreview, setCorrectPreview] = useState("");

  const [optionImages, setOptionImages] = useState([]);
  const [optionPreviews, setOptionPreviews] = useState([]);

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onPickCorrect = (file) => {
    setCorrectImage(file || null);
    if (correctPreview) URL.revokeObjectURL(correctPreview);
    setCorrectPreview(file ? URL.createObjectURL(file) : "");
  };

  const onPickOptions = (files) => {
    const arr = Array.from(files || []);
    setOptionImages(arr);

    optionPreviews.forEach((u) => URL.revokeObjectURL(u));
    setOptionPreviews(arr.map((f) => URL.createObjectURL(f)));
  };

  const resetForm = () => {
    setTitle("");
    setTaskNumber("");
    setLevel("easy");

    setCorrectImage(null);
    if (correctPreview) URL.revokeObjectURL(correctPreview);
    setCorrectPreview("");

    setOptionImages([]);
    optionPreviews.forEach((u) => URL.revokeObjectURL(u));
    setOptionPreviews([]);

    if (correctRef.current) correctRef.current.value = "";
    if (optionsRef.current) optionsRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (!correctImage) {
      setIsError(true);
      setMessage("Please upload the correct image.");
      return;
    }
    if (!taskNumber) {
      setIsError(true);
      setMessage("Task number is required.");
      return;
    }
    if (optionImages.length < 2) {
      setIsError(true);
      setMessage("Upload at least 2 option images (distractors).");
      return;
    }

    const fd = new FormData();
    fd.append("title", title || "Shadow Match");
    fd.append("task_number", String(taskNumber));

    // ✅ send ONE selected level in array format
    fd.append("levels[]", level);

    fd.append("correct_image", correctImage);
    optionImages.forEach((f) => fd.append("option_images[]", f));

    try {
      setSubmitting(true);
      const res = await axios.post(`${apiBase}/api/vc_sha_mat/add`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsError(false);
      setMessage(`${res.data.message} ✅ activity_id: ${res.data.activity_id}`);
      resetForm();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Error adding Shadow Match.";
      setIsError(true);
      setMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div><AdminHeader/></div>
          <div style={{ padding: 24, maxWidth: 760, margin: "0 auto" }}>
      <h2>Admin - Add Shadow Match</h2>

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
            placeholder="e.g., Find the Animal"
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

        {/* ✅ Dropdown Level */}
        <div style={{ marginBottom: 12 }}>
          <label>Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          >
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Correct Image (backend will generate shadow)</label>
          <input
            ref={correctRef}
            type="file"
            accept="image/*"
            onChange={(e) => onPickCorrect(e.target.files?.[0] || null)}
            required
            style={{ display: "block", marginTop: 6 }}
          />

          {correctPreview && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>
                Correct Preview
              </div>
              <img
                src={correctPreview}
                alt="correct preview"
                style={{
                  width: 280,
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "1px solid #ddd",
                  display: "block",
                }}
                draggable={false}
              />
            </div>
          )}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Option Images (Distractors) — upload 2 to 5</label>
          <input
            ref={optionsRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => onPickOptions(e.target.files)}
            required
            style={{ display: "block", marginTop: 6 }}
          />

          {optionPreviews.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>
                Options Preview
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 90px)", gap: 8 }}>
                {optionPreviews.map((u, i) => (
                  <img
                    key={i}
                    src={u}
                    alt={`opt-${i}`}
                    style={{
                      width: 90,
                      height: 70,
                      objectFit: "cover",
                      borderRadius: 10,
                      border: "1px solid #ddd",
                      background: "#fff",
                    }}
                    draggable={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "10px 14px",
            opacity: submitting ? 0.7 : 1,
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Adding..." : "Add Shadow Match"}
        </button>
      </form>
    </div>
    </div>

  );
}