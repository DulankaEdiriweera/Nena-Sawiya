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
    if (!title.trim()) return "Please enter a game name";
    if (!image) return "Please select an image";
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) return `Question ${i + 1} is empty`;
      if (q.options.some((o) => !o.trim())) return `Question ${i + 1} has empty options`;
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
      setError(e.response?.data?.error || "An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div><AdminHeader/></div>
      <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');`}</style>
      
      <div className="min-h-screen p-6" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #fdf2ff 100%)" }}>
        <div className="max-w-2xl mx-auto">

          {/* Page Header */}
          <div className="rounded-2xl p-6 mb-6 text-white text-center shadow-lg" style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
            <div className="text-4xl mb-2">🎨</div>
            <h1 className="text-2xl font-bold">Add Memory Game</h1>
            <p className="text-sm mt-1" style={{ color: "#ddd6fe" }}>Visual difference identification activity</p>
          </div>

          {success && (
            <div className="rounded-2xl p-5 mb-6 text-center" style={{ background: "#f0fdf4", border: "2px solid #86efac" }}>
              <div className="text-3xl">🎉</div>
              <p className="font-bold text-green-700 text-lg mt-1">Game added successfully!</p>
              <button onClick={() => setSuccess(false)} className="mt-2 font-bold text-sm" style={{ color: "#6366f1", background: "none", border: "none", cursor: "pointer" }}>
                Add another game →
              </button>
            </div>
          )}

          {error && (
            <div className="rounded-2xl p-4 mb-5" style={{ background: "#fff1f2", border: "2px solid #fca5a5" }}>
              <p className="font-bold text-red-600 m-0">⚠️ {error}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow p-6 space-y-5" style={{ border: "1.5px solid #ede9fe" }}>

            {/* Title */}
            <div>
              <label className="block font-bold mb-1" style={{ color: "#374151" }}>🎮 Game Name</label>
              <input
                placeholder="e.g. Animal World"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl p-3 focus:outline-none"
                style={{ border: "2px solid #ddd6fe", fontFamily: "'Poppins', sans-serif" }}
              />
            </div>

            {/* Level */}
            <div>
              <label className="block font-bold mb-2" style={{ color: "#374151" }}>📊 Difficulty Level</label>
              <div className="flex gap-3">
                {[
                  ["EASY", "🌟 Easy", "#d1fae5", "#065f46"],
                  ["MEDIUM", "🔥 Medium", "#fef9c3", "#713f12"],
                  ["HARD", "🏆 Hard", "#fee2e2", "#7f1d1d"]
                ].map(([key, label, bg, col]) => (
                  <button key={key} type="button" onClick={() => setLevel(key)}
                    className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all"
                    style={{
                      background: level === key ? bg : "#f9fafb",
                      color: level === key ? col : "#9ca3af",
                      border: `2px solid ${level === key ? col : "#e5e7eb"}`,
                      transform: level === key ? "scale(1.04)" : "scale(1)"
                    }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image upload */}
            <div>
              <label className="block font-bold mb-2" style={{ color: "#374151" }}>🖼️ Game Image</label>
              <div
                className="rounded-xl p-5 text-center cursor-pointer transition"
                style={{ border: "3px dashed #c4b5fd", background: imagePreview ? "transparent" : "#faf5ff" }}
                onClick={() => document.getElementById("img-upload").click()}>
                {imagePreview ? (
                  <div>
                    <img src={imagePreview} alt="preview" className="rounded-xl mx-auto" style={{ maxHeight: 200, display: "block" }} />
                    <p className="font-bold mt-2 text-sm" style={{ color: "#6366f1" }}>Click to change</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-5xl">📷</div>
                    <p className="font-bold mt-2" style={{ color: "#7c3aed" }}>Click to upload image</p>
                    <p className="text-gray-400 text-sm">JPG, PNG, GIF · up to 5MB</p>
                  </div>
                )}
                <input id="img-upload" type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </div>
            </div>

            {/* Questions */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="font-bold" style={{ color: "#374151" }}>❓ Questions ({questions.length})</label>
                <button type="button" onClick={addQuestion}
                  className="font-bold px-4 py-2 rounded-xl text-sm"
                  style={{ background: "#ede9fe", color: "#6d28d9", border: "none", cursor: "pointer" }}>
                  + Add Question
                </button>
              </div>

              <div className="space-y-4">
                {questions.map((q, qIdx) => (
                  <div key={qIdx} className="rounded-2xl p-5" style={{ border: "2px solid #ede9fe", background: "#fafafa" }}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-sm" style={{ color: "#6366f1" }}>Question {qIdx + 1}</span>
                      {questions.length > 1 && (
                        <button type="button" onClick={() => removeQuestion(qIdx)}
                          className="text-sm font-bold px-3 py-1 rounded-lg"
                          style={{ background: "#fee2e2", color: "#dc2626", border: "none", cursor: "pointer" }}>
                          Remove ✕
                        </button>
                      )}
                    </div>

                    <input
                      placeholder="Enter question text"
                      value={q.question}
                      onChange={(e) => updateQuestion(qIdx, "question", e.target.value)}
                      className="w-full rounded-xl p-3 focus:outline-none mb-3"
                      style={{ border: "2px solid #ddd6fe", fontFamily: "'Poppins', sans-serif" }}
                    />

                    <div className="space-y-2 mb-3">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-3">
                          <input type="radio" name={`correct-${qIdx}`}
                            checked={parseInt(q.correct) === oIdx}
                            onChange={() => updateQuestion(qIdx, "correct", oIdx)}
                            style={{ width: 20, height: 20, accentColor: "#10b981", cursor: "pointer", flexShrink: 0 }}
                            title="Correct answer" />
                          <input
                            placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                            value={opt}
                            onChange={(e) => updateQuestion(qIdx, "options", e.target.value, oIdx)}
                            className="w-full rounded-xl p-2.5 focus:outline-none"
                            style={{
                              border: `2px solid ${parseInt(q.correct) === oIdx ? "#10b981" : "#ddd6fe"}`,
                              background: parseInt(q.correct) === oIdx ? "#f0fdf4" : "white",
                              fontFamily: "'Poppins', sans-serif"
                            }} />
                          {parseInt(q.correct) === oIdx && (
                            <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: "#d1fae5", color: "#065f46", whiteSpace: "nowrap" }}>✓ Correct</span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="font-bold text-sm text-gray-500">Marks:</label>
                      <input type="number" min={1} max={100} value={q.mark}
                        onChange={(e) => updateQuestion(qIdx, "mark", e.target.value)}
                        className="rounded-xl p-2 focus:outline-none text-center font-bold"
                        style={{ width: 80, border: "2px solid #ddd6fe" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={submit} disabled={loading}
              className="w-full text-white font-bold py-4 rounded-xl text-lg shadow transition"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", opacity: loading ? 0.6 : 1 }}>
              {loading ? "⏳ Saving..." : "💾 Save Game"}
            </button>
          </div>
        </div>
      </div>
    </div>

    </div>
    
  );
}