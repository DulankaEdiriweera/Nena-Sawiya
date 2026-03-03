import { useState } from "react";
import axios from "axios";
import AdminHeader from "../../Components/AdminHeader";

const BASE = "http://localhost:5000";

const emptyQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  correct: 0,
  mark: 1,
});

export default function AdminAddMemoryGame() {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("EASY");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addQuestion = () => setQuestions([...questions, emptyQuestion()]);

  const removeQuestion = (idx) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const updateQuestion = (qIdx, field, value, optIdx = null) => {
    const updated = questions.map((q, i) => {
      if (i !== qIdx) return q;
      if (field === "options") {
        const newOpts = [...q.options];
        newOpts[optIdx] = value;
        return { ...q, options: newOpts };
      }
      return { ...q, [field]: value };
    });
    setQuestions(updated);
  };

  const validate = () => {
    if (!title.trim()) return "ක්‍රීඩා නමක් ඇතුළු කරන්න";
    if (!image) return "පින්තූරයක් තෝරන්න";
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) return `ප්‍රශ්නය ${i + 1} හිස් ය`;
      if (q.options.some((o) => !o.trim())) return `ප්‍රශ්නය ${i + 1} හි විකල්ප හිස් ය`;
    }
    return null;
  };

  const submit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("level", level);
      fd.append("image", image);
      fd.append("questions", JSON.stringify(
        questions.map((q) => ({
          question: q.question,
          options: q.options,
          correct: parseInt(q.correct),
          mark: parseInt(q.mark),
        }))
      ));
      await axios.post(`${BASE}/api/vd_memory/add`, fd);
      setSuccess(true);
      setTitle(""); setLevel("EASY"); setImage(null);
      setImagePreview(null); setQuestions([emptyQuestion()]);
    } catch (e) {
      setError(e.response?.data?.error || "දෝෂයක් ඇතිවිය. නැවත උත්සාහ කරන්න.");
    }
    setLoading(false);
  };

  const levelConfig = {
    EASY: { label: "පහසු 🌟", color: "bg-emerald-400 border-emerald-500", text: "text-emerald-700" },
    MEDIUM: { label: "මධ්‍යම 🔥", color: "bg-amber-400 border-amber-500", text: "text-amber-700" },
    HARD: { label: "දුෂ්කර 🏆", color: "bg-rose-400 border-rose-500", text: "text-rose-700" },
  };

  return (
    <div>
      <div><AdminHeader/></div>
      <div
      className="min-h-screen p-6"
      style={{
        background: "linear-gradient(135deg, #e0f2fe 0%, #fce7f3 50%, #fef9c3 100%)",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
        .card { background: white; border-radius: 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.10); }
        .btn-primary { background: linear-gradient(135deg, #6366f1, #ec4899); color: white; border-radius: 16px; font-weight: 800; font-size: 1.1rem; padding: 14px 32px; border: none; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; box-shadow: 0 4px 16px rgba(99,102,241,0.3); }
        .btn-primary:hover { transform: scale(1.04); box-shadow: 0 6px 24px rgba(99,102,241,0.4); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .input-field { width: 100%; border: 2.5px solid #e0e7ff; border-radius: 14px; padding: 12px 16px; font-size: 1rem; font-family: 'Nunito', sans-serif; font-weight: 700; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
        .input-field:focus { border-color: #6366f1; }
        .correct-badge { background: #d1fae5; color: #065f46; border-radius: 10px; padding: 2px 10px; font-size: 0.75rem; font-weight: 800; }
      `}</style>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div style={{ fontSize: "3.5rem" }}>🎨</div>
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "2rem", color: "#4f46e5", margin: "8px 0 4px" }}>
            නව ක්‍රීඩාවක් එකතු කරන්න
          </h1>
          <p style={{ color: "#9ca3af", fontWeight: 700 }}>දෘශ්‍ය වෙනස් කිරීමේ ක්‍රීඩාව</p>
        </div>

        {success && (
          <div className="card p-5 mb-6 text-center" style={{ background: "#f0fdf4", border: "2px solid #86efac" }}>
            <div style={{ fontSize: "2.5rem" }}>🎉</div>
            <p style={{ color: "#16a34a", fontWeight: 800, fontSize: "1.1rem" }}>ක්‍රීඩාව සාර්ථකව එකතු කරන ලදී!</p>
            <button onClick={() => setSuccess(false)} style={{ marginTop: 8, color: "#6366f1", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>
              තවත් ක්‍රීඩාවක් එකතු කරන්න →
            </button>
          </div>
        )}

        {error && (
          <div className="card p-4 mb-5" style={{ background: "#fff1f2", border: "2px solid #fca5a5" }}>
            <p style={{ color: "#dc2626", fontWeight: 700, margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        <div className="card p-8 space-y-6">
          {/* Title */}
          <div>
            <label style={{ display: "block", fontWeight: 800, color: "#374151", marginBottom: 6 }}>
              🎮 ක්‍රීඩා නම
            </label>
            <input
              className="input-field"
              placeholder="උදා: සත්ත්ව ලෝකය"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Level */}
          <div>
            <label style={{ display: "block", fontWeight: 800, color: "#374151", marginBottom: 8 }}>
              📊 මට්ටම
            </label>
            <div style={{ display: "flex", gap: 12 }}>
              {Object.entries(levelConfig).map(([key, cfg]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setLevel(key)}
                  style={{
                    flex: 1, padding: "12px 8px", borderRadius: 16, border: `3px solid`,
                    borderColor: level === key ? cfg.color.split(" ")[1].replace("border-", "") : "#e5e7eb",
                    background: level === key ? cfg.color.split(" ")[0].replace("bg-", "") : "white",
                    fontWeight: 800, cursor: "pointer", transition: "all 0.2s",
                    transform: level === key ? "scale(1.05)" : "scale(1)",
                    boxShadow: level === key ? "0 4px 16px rgba(0,0,0,0.15)" : "none",
                    color: level === key ? "white" : "#6b7280",
                  }}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label style={{ display: "block", fontWeight: 800, color: "#374151", marginBottom: 8 }}>
              🖼️ ක්‍රීඩා පින්තූරය
            </label>
            <div
              style={{
                border: "3px dashed #c7d2fe", borderRadius: 18, padding: 20, textAlign: "center",
                background: imagePreview ? "transparent" : "#f5f3ff", cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onClick={() => document.getElementById("img-upload").click()}
            >
              {imagePreview ? (
                <div style={{ position: "relative" }}>
                  <img src={imagePreview} alt="preview" style={{ maxHeight: 200, borderRadius: 14, margin: "0 auto", display: "block" }} />
                  <p style={{ color: "#6366f1", fontWeight: 700, marginTop: 8, fontSize: "0.85rem" }}>
                    වෙනස් කිරීමට ක්ලික් කරන්න
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: "3rem" }}>📷</div>
                  <p style={{ color: "#6366f1", fontWeight: 800 }}>පින්තූරයක් ඇතුළු කිරීමට ක්ලික් කරන්න</p>
                  <p style={{ color: "#9ca3af", fontSize: "0.8rem", fontWeight: 600 }}>JPG, PNG, GIF · 5MB දක්වා</p>
                </div>
              )}
              <input id="img-upload" type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
            </div>
          </div>

          {/* Questions */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <label style={{ fontWeight: 800, color: "#374151", fontSize: "1rem" }}>
                ❓ ප්‍රශ්න ({questions.length})
              </label>
              <button
                type="button"
                onClick={addQuestion}
                style={{ background: "#ede9fe", color: "#6d28d9", border: "none", borderRadius: 12, padding: "8px 16px", fontWeight: 800, cursor: "pointer" }}
              >
                + ප්‍රශ්නයක් එකතු කරන්න
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {questions.map((q, qIdx) => (
                <div
                  key={qIdx}
                  style={{
                    border: "2.5px solid #e0e7ff", borderRadius: 20, padding: 20,
                    background: "#fafafa", position: "relative",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontWeight: 800, color: "#6366f1", fontSize: "0.95rem" }}>
                      ප්‍රශ්නය {qIdx + 1}
                    </span>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIdx)}
                        style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 10, padding: "4px 12px", fontWeight: 800, cursor: "pointer", fontSize: "0.8rem" }}
                      >
                        ඉවත් කරන්න ✕
                      </button>
                    )}
                  </div>

                  <input
                    className="input-field"
                    placeholder="ප්‍රශ්නය ඇතුළු කරන්න"
                    value={q.question}
                    onChange={(e) => updateQuestion(qIdx, "question", e.target.value)}
                    style={{ marginBottom: 12 }}
                  />

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <input
                          type="radio"
                          name={`correct-${qIdx}`}
                          checked={parseInt(q.correct) === oIdx}
                          onChange={() => updateQuestion(qIdx, "correct", oIdx)}
                          style={{ width: 20, height: 20, accentColor: "#10b981", cursor: "pointer", flexShrink: 0 }}
                          title="නිවැරදි පිළිතුර"
                        />
                        <input
                          className="input-field"
                          placeholder={`විකල්පය ${String.fromCharCode(65 + oIdx)}`}
                          value={opt}
                          onChange={(e) => updateQuestion(qIdx, "options", e.target.value, oIdx)}
                          style={{
                            borderColor: parseInt(q.correct) === oIdx ? "#10b981" : "#e0e7ff",
                            background: parseInt(q.correct) === oIdx ? "#f0fdf4" : "white",
                          }}
                        />
                        {parseInt(q.correct) === oIdx && <span className="correct-badge">✓ නිවැරදි</span>}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <label style={{ fontWeight: 700, color: "#6b7280", fontSize: "0.85rem" }}>ලකුණු:</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={q.mark}
                      onChange={(e) => updateQuestion(qIdx, "mark", e.target.value)}
                      className="input-field"
                      style={{ width: 80, padding: "8px 12px" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary" onClick={submit} disabled={loading} style={{ width: "100%" }}>
            {loading ? "⏳ සුරකිනවා..." : "💾 ක්‍රීඩාව සුරකින්න"}
          </button>
        </div>
      </div>
    </div>

    </div>
    
  );
}

