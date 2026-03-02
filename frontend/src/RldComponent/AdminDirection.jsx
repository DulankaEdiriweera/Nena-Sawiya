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
  left: {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
  },
  right: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
  },
  top: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
  },
  bottom: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" },
};

const emptyOption = (zone) => ({
  image: null,
  preview: null,
  correct_zone: zone,
});

const UploadZone = ({ preview, fileName, label, onChange }) => (
  <div className="relative border border-dashed border-indigo-200 rounded-lg px-4 py-3.5 bg-slate-50 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
    <input
      type="file"
      accept="image/*"
      onChange={onChange}
      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
    />
    <div className="flex items-center gap-3 pointer-events-none">
      {preview ? (
        <img
          src={preview}
          alt="preview"
          className="w-12 h-12 rounded-md object-cover border border-slate-200 flex-shrink-0"
        />
      ) : (
        <div className="w-12 h-12 rounded-md bg-slate-200 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-slate-400"
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
      <div>
        <p className="text-sm font-medium text-indigo-500">
          {fileName ?? label}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          {fileName ? "Click to replace" : "PNG, JPG, WEBP"}
        </p>
      </div>
    </div>
  </div>
);

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
        .dm-sans { font-family: 'DM Sans', sans-serif; }
        .sinhala { font-family: 'Noto Serif Sinhala', serif; line-height: 1.9; }
        .focus-ring:focus { border-color: #8888cc; box-shadow: 0 0 0 3px rgba(100,100,200,0.08); }
      `}</style>

      <div className="dm-sans min-h-screen bg-slate-100 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-8 py-7 border-b border-slate-100">
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-1">
              Admin Panel
            </p>
            <p className="text-xl font-bold text-slate-900 mb-0.5">
              Direction Game — Add Set
            </p>
            <p className="text-sm text-slate-400">
              Create a drag-and-drop direction activity for students.
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-7 pb-8">
            {/* Alert */}
            {message && (
              <div
                className={`flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm font-medium mb-6 border ${
                  isError
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-green-50 border-green-200 text-green-700"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    isError ? "bg-red-600" : "bg-green-500"
                  }`}
                />
                {message}
              </div>
            )}

            <form key={formKey} onSubmit={handleSubmit}>
              {/* Difficulty Level */}
              <div className="mb-5">
                <label className="block text-xs font-bold tracking-widest uppercase text-indigo-400 mb-1.5">
                  Difficulty Level
                </label>
                <select
                  value={level}
                  onChange={(e) => handleLevelChange(e.target.value)}
                  className="focus-ring dm-sans w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 bg-white outline-none"
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

              {/* Scene Image */}
              <div className="mb-5">
                <label className="block text-xs font-bold tracking-widest uppercase text-indigo-400 mb-1.5">
                  Scene Image
                  <span className="text-xs font-normal text-slate-400 normal-case tracking-normal ml-1.5">
                    e.g. a house, a room
                  </span>
                </label>
                <UploadZone
                  preview={scenePreview}
                  fileName={sceneImage?.name}
                  label="Click to upload scene image"
                  onChange={(e) => handleSceneImage(e.target.files[0])}
                />
              </div>

              {/* Question / Instruction */}
              <div className="mb-5">
                <label className="block text-xs font-bold tracking-widest uppercase text-indigo-400 mb-1.5">
                  Question / Instruction
                  <span className="text-xs font-normal text-slate-400 normal-case tracking-normal ml-1.5">
                    Sinhala
                  </span>
                </label>
                <input
                  type="text"
                  value={question}
                  required
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="ගාඩිය ගෙදරට වමට ඇදගෙන යන්න..."
                  className="focus-ring sinhala w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 bg-white outline-none"
                />
              </div>

              {/* Section Divider */}
              <div className="flex items-center gap-3 my-7">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-xs font-bold tracking-widest uppercase text-slate-400 whitespace-nowrap">
                  Option Images — {options.length} zones
                </span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {/* Option Blocks */}
              {options.map((opt, i) => {
                const colors = ZONE_COLORS[opt.correct_zone];
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3.5 py-3 border border-slate-200 rounded-xl mb-2.5 bg-white"
                  >
                    <span
                      className={`text-xs font-bold tracking-wide px-2.5 py-1 rounded-full border whitespace-nowrap flex-shrink-0 ${colors.bg} ${colors.border} ${colors.text}`}
                    >
                      {ZONE_LABELS[opt.correct_zone]}
                    </span>
                    <div className="flex-1">
                      <UploadZone
                        preview={opt.preview}
                        fileName={opt.image?.name}
                        label={`Upload image for option ${i + 1}`}
                        onChange={(e) => updateImage(i, e.target.files[0])}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`dm-sans w-full py-3.5 rounded-lg text-sm font-bold tracking-wide text-white border-none mt-7 transition-all ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-slate-900 cursor-pointer hover:bg-slate-700 hover:-translate-y-px"
                }`}
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
