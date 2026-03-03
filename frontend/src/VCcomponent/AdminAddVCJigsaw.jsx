import React, { useRef, useState } from "react";
import axios from "axios";
import AdminHeader from "../Components/AdminHeader";

export default function AdminAddVCJigsaw() {
  const apiBase = "http://localhost:5000";

  const fileRef = useRef(null);

  const [title, setTitle] = useState("");
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(4);
  const [taskNumber, setTaskNumber] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [abilityLevels, setAbilityLevels] = useState(["Weak"]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleAbility = (lvl) => {
    setAbilityLevels((prev) =>
      prev.includes(lvl) ? prev.filter((x) => x !== lvl) : [...prev, lvl]
    );
  };

  const onPickImage = (file) => {
    setImage(file || null);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (file) setPreviewUrl(URL.createObjectURL(file));
    else setPreviewUrl("");
  };

  const resetForm = () => {
    setTitle("");
    setRows(3);
    setCols(4);
    setTaskNumber("");
    setAbilityLevels(["Weak"]);
    setImage(null);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");

    // clear file input value
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (!image) {
      setMessage("Please upload an image.");
      setIsError(true);
      return;
    }

    if (!taskNumber) {
      setMessage("Task number is required.");
      setIsError(true);
      return;
    }

    if (!abilityLevels.length) {
      setMessage("Select at least one ability level (Weak/Average/High).");
      setIsError(true);
      return;
    }

    const formData = new FormData();
    formData.append("title", title || "VC Jigsaw Puzzle");
    formData.append("rows", String(rows));
    formData.append("cols", String(cols));
    formData.append("task_number", String(taskNumber));
    abilityLevels.forEach((a) => formData.append("ability_levels[]", a));
    formData.append("image", image);

    try {
      setSubmitting(true);

      const res = await axios.post(`${apiBase}/api/vc_jigsaw/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(`${res.data.message} ✅ puzzle_id: ${res.data.puzzle_id}`);
      setIsError(false);
      resetForm();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Error adding VC jigsaw.";
      setMessage(msg);
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div><AdminHeader/></div>
      <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h2>Admin - Add VC Jigsaw</h2>

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
            placeholder="e.g., Princess Puzzle"
          />
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label>Rows</label>
            <input
              type="number"
              min={2}
              max={8}
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              style={{ width: "100%", padding: 10 }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Cols</label>
            <input
              type="number"
              min={2}
              max={8}
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
              style={{ width: "100%", padding: 10 }}
            />
          </div>
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
          <label>Ability Levels</label>
          <div style={{ marginTop: 6 }}>
            {["Weak", "Average", "High"].map((lvl) => (
              <label key={lvl} style={{ marginRight: 12 }}>
                <input
                  type="checkbox"
                  checked={abilityLevels.includes(lvl)}
                  onChange={() => toggleAbility(lvl)}
                />{" "}
                {lvl}
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Upload Image</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => onPickImage(e.target.files?.[0] || null)}
            required
            style={{ display: "block", marginTop: 6 }}
          />

          {previewUrl && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>
                Preview
              </div>
              <img
                src={previewUrl}
                alt="preview"
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

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "10px 14px",
            opacity: submitting ? 0.7 : 1,
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Adding..." : "Add Jigsaw"}
        </button>
      </form>

      {/* <div style={{ marginTop: 16, fontSize: 13, opacity: 0.8 }}>
        Note: After the backend fix, the system saves a processed <b>base.png</b>{" "}
        and slices pieces from it, so the board and reference will match exactly.
      </div> */}
    </div>

    </div>
    
  );
}