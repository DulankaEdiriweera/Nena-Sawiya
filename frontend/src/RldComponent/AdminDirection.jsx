// src/RldDirection/AdminDirectionForm.jsx
import React, { useState } from "react";
import axios from "axios";

const ZONES = {
  easy: ["left", "right"],
  medium: ["left", "right", "top"],
  hard: ["left", "right", "top", "bottom"],
};

const ZONE_LABELS = {
  left: "Left — වමට",
  right: "Right — දකුණට",
  top: "Top — උඩ",
  bottom: "Bottom — යට",
};

const ZONE_COLORS = {
  left: { bg: "#eef2ff", border: "#c7d2fe", text: "#4338ca" },
  right: { bg: "#f0faf4", border: "#a8dbbe", text: "#1a7a4a" },
  top: { bg: "#fffbeb", border: "#f0d080", text: "#92650a" },
  bottom: { bg: "#fdf3f2", border: "#e8b4b0", text: "#c0392b" },
};

const emptyOption = (zone) => ({
  image: null,
  preview: null,
  correct_zone: zone,
});

const AdminDirectionForm = () => {
  const [level, setLevel] = useState("easy");
  const [sceneImage, setSceneImage] = useState(null);
  const [scenePreview, setScenePreview] = useState(null);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(ZONES.easy.map(emptyOption));
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleLevelChange = (val) => {
    setLevel(val);
    setOptions(ZONES[val].map(emptyOption));
  };

  const handleSceneImage = (file) => {
    if (!file) return;
    setSceneImage(file);
    setScenePreview(URL.createObjectURL(file));
  };

  const updateImage = (i, file) => {
    if (!file) return;
    const updated = [...options];
    updated[i] = {
      ...updated[i],
      image: file,
      preview: URL.createObjectURL(file),
    };
    setOptions(updated);
  };

  const resetForm = (currentLevel) => {
    setSceneImage(null);
    setScenePreview(null);
    setQuestion("");
    setOptions(ZONES[currentLevel].map(emptyOption));
    setFormKey((k) => k + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sceneImage) {
      setMessage("Please upload the scene image.");
      setIsError(true);
      return;
    }
    for (let i = 0; i < options.length; i++) {
      if (!options[i].image) {
        setMessage(
          `Please upload an image for option ${i + 1} (${ZONE_LABELS[options[i].correct_zone]}).`,
        );
        setIsError(true);
        return;
      }
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("level", level);
    formData.append("question", question);
    formData.append("scene_image", sceneImage);
    formData.append(
      "options",
      JSON.stringify(options.map((o) => ({ correct_zone: o.correct_zone }))),
    );
    options.forEach((o, i) => formData.append(`option_image_${i}`, o.image));

    try {
      const res = await axios.post(
        "http://localhost:5000/api/rld_direction_bp/add_direction_set",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      setMessage(res.data.message || "Direction set saved successfully.");
      setIsError(false);
      resetForm(level);
    } catch (err) {
      setMessage(
        err.response?.data?.error || "An error occurred. Please try again.",
      );
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Sinhala:wght@400;500;600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .adf-wrap {
          min-height: 100vh;
          background: #f4f4f8;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 40px 16px;
          font-family: 'DM Sans', sans-serif;
        }

        .adf-card {
          width: 100%;
          max-width: 680px;
          background: #ffffff;
          border: 1px solid #e2e2ee;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          overflow: hidden;
        }

        /* ── Page header ── */
        .adf-page-header {
          padding: 28px 32px 24px;
          border-bottom: 1px solid #ebebf5;
        }

        .adf-page-tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #9999bb;
          margin-bottom: 4px;
        }

        .adf-page-title {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 2px;
        }

        .adf-page-sub {
          font-size: 13px;
          color: #9999bb;
        }

        /* ── Form body ── */
        .adf-body {
          padding: 28px 32px 32px;
        }

        /* ── Alert ── */
        .adf-alert {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 24px;
          border: 1px solid;
        }

        .adf-alert.error  { background: #fdf3f2; border-color: #e8b4b0; color: #c0392b; }
        .adf-alert.success { background: #f0faf4; border-color: #a8dbbe; color: #1a7a4a; }

        .adf-alert-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          margin-top: 4px;
          flex-shrink: 0;
        }

        .adf-alert.error .adf-alert-dot   { background: #c0392b; }
        .adf-alert.success .adf-alert-dot { background: #27ae60; }

        /* ── Field ── */
        .adf-field { margin-bottom: 20px; }

        .adf-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6666aa;
          margin-bottom: 6px;
        }

        .adf-hint {
          font-size: 11px;
          font-weight: 400;
          color: #aaaacc;
          text-transform: none;
          letter-spacing: 0;
          margin-left: 6px;
        }

        .adf-select,
        .adf-input {
          width: 100%;
          border: 1px solid #e2e2ee;
          border-radius: 8px;
          padding: 10px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1a1a2e;
          background: #fff;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
        }

        .adf-select:focus,
        .adf-input:focus {
          border-color: #8888cc;
          box-shadow: 0 0 0 3px rgba(100,100,200,0.08);
        }

        .adf-sinhala {
          font-family: 'Noto Serif Sinhala', serif;
          font-size: 14px;
          line-height: 1.9;
        }

        /* ── File upload zone ── */
        .adf-upload-zone {
          border: 1px dashed #c8c8e8;
          border-radius: 8px;
          padding: 14px 16px;
          background: #f7f7fb;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          position: relative;
        }

        .adf-upload-zone:hover { border-color: #8888cc; background: #f4f4ff; }

        .adf-upload-zone input[type="file"] {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }

        .adf-upload-inner {
          display: flex;
          align-items: center;
          gap: 12px;
          pointer-events: none;
        }

        .adf-upload-preview {
          width: 48px;
          height: 48px;
          border-radius: 6px;
          object-fit: cover;
          border: 1px solid #e2e2ee;
          flex-shrink: 0;
        }

        .adf-upload-placeholder {
          width: 48px;
          height: 48px;
          border-radius: 6px;
          background: #ebebf5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .adf-upload-placeholder svg {
          width: 20px; height: 20px;
          color: #aaaacc;
        }

        .adf-upload-text {
          font-size: 13px;
          color: #6666aa;
          font-weight: 500;
        }

        .adf-upload-text span {
          display: block;
          font-size: 11px;
          color: #aaaacc;
          font-weight: 400;
          margin-top: 2px;
        }

        /* ── Section divider ── */
        .adf-section-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 28px 0 20px;
        }

        .adf-section-divider-line { flex: 1; height: 1px; background: #ebebf5; }

        .adf-section-divider-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #aaaacc;
          white-space: nowrap;
        }

        /* ── Option block ── */
        .adf-option-block {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border: 1px solid #e2e2ee;
          border-radius: 10px;
          margin-bottom: 10px;
          background: #fff;
        }

        .adf-zone-badge {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 4px 10px;
          border-radius: 20px;
          white-space: nowrap;
          flex-shrink: 0;
          border: 1px solid;
        }

        .adf-option-upload {
          flex: 1;
          position: relative;
        }

        /* ── Submit ── */
        .adf-submit-btn {
          width: 100%;
          padding: 14px;
          background: #1a1a2e;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          margin-top: 28px;
          transition: background 0.2s, transform 0.15s;
        }

        .adf-submit-btn:hover:not(:disabled) {
          background: #2d2d50;
          transform: translateY(-1px);
        }

        .adf-submit-btn:disabled { background: #aaaacc; cursor: not-allowed; }

        @media (max-width: 480px) {
          .adf-page-header, .adf-body { padding-left: 20px; padding-right: 20px; }
          .adf-option-block { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="adf-wrap">
        <div className="adf-card">
          {/* Header */}
          <div className="adf-page-header">
            <p className="adf-page-tag">Admin Panel</p>
            <p className="adf-page-title">Direction Game — Add Set</p>
            <p className="adf-page-sub">
              Create a drag-and-drop direction activity for students.
            </p>
          </div>

          <div className="adf-body">
            {/* Alert */}
            {message && (
              <div className={`adf-alert ${isError ? "error" : "success"}`}>
                <div className="adf-alert-dot" />
                {message}
              </div>
            )}

            <form key={formKey} onSubmit={handleSubmit}>
              {/* Difficulty level */}
              <div className="adf-field">
                <label className="adf-label">Difficulty Level</label>
                <select
                  value={level}
                  onChange={(e) => handleLevelChange(e.target.value)}
                  className="adf-select"
                >
                  <option value="easy">Easy — 2 options (Left, Right)</option>
                  <option value="medium">
                    Medium — 3 options (Left, Right, Top)
                  </option>
                  <option value="hard">
                    Hard — 4 options (Left, Right, Top, Bottom)
                  </option>
                </select>
              </div>

              {/* Scene image */}
              <div className="adf-field">
                <label className="adf-label">
                  Scene Image
                  <span className="adf-hint">e.g. a house, a room</span>
                </label>
                <div className="adf-upload-zone">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSceneImage(e.target.files[0])}
                  />
                  <div className="adf-upload-inner">
                    {scenePreview ? (
                      <img
                        src={scenePreview}
                        className="adf-upload-preview"
                        alt="scene"
                      />
                    ) : (
                      <div className="adf-upload-placeholder">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="3" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>
                    )}
                    <div className="adf-upload-text">
                      {sceneImage
                        ? sceneImage.name
                        : "Click to upload scene image"}
                      <span>
                        {sceneImage ? "Click to replace" : "PNG, JPG, WEBP"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question / instruction */}
              <div className="adf-field">
                <label className="adf-label">
                  Question / Instruction
                  <span className="adf-hint">Sinhala</span>
                </label>
                <input
                  type="text"
                  value={question}
                  required
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="ගාඩිය ගෙදරට වමට ඇදගෙන යන්න..."
                  className="adf-input adf-sinhala"
                />
              </div>

              {/* Option images divider */}
              <div className="adf-section-divider">
                <div className="adf-section-divider-line" />
                <span className="adf-section-divider-label">
                  Option Images — {options.length} zones
                </span>
                <div className="adf-section-divider-line" />
              </div>

              {/* Option blocks */}
              {options.map((opt, i) => {
                const colors = ZONE_COLORS[opt.correct_zone];
                return (
                  <div key={i} className="adf-option-block">
                    <span
                      className="adf-zone-badge"
                      style={{
                        background: colors.bg,
                        borderColor: colors.border,
                        color: colors.text,
                      }}
                    >
                      {ZONE_LABELS[opt.correct_zone]}
                    </span>
                    <div className="adf-option-upload">
                      <div className="adf-upload-zone">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => updateImage(i, e.target.files[0])}
                        />
                        <div className="adf-upload-inner">
                          {opt.preview ? (
                            <img
                              src={opt.preview}
                              className="adf-upload-preview"
                              alt={`option ${i + 1}`}
                            />
                          ) : (
                            <div className="adf-upload-placeholder">
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              >
                                <rect
                                  x="3"
                                  y="3"
                                  width="18"
                                  height="18"
                                  rx="3"
                                />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <path d="M21 15l-5-5L5 21" />
                              </svg>
                            </div>
                          )}
                          <div className="adf-upload-text">
                            {opt.image
                              ? opt.image.name
                              : `Upload image for option ${i + 1}`}
                            <span>
                              {opt.image
                                ? "Click to replace"
                                : "PNG, JPG, WEBP"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="adf-submit-btn"
              >
                {loading ? "Saving…" : "Save Direction Set"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDirectionForm;
