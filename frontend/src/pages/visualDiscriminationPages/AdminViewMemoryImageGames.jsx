import { useEffect, useState } from "react";
import axios from "axios";

const BASE = "http://localhost:5000";

const levelConfig = {
  EASY: { label: "පහසු", bg: "#d1fae5", color: "#065f46", emoji: "🌟" },
  MEDIUM: { label: "මධ්‍යම", bg: "#fef3c7", color: "#92400e", emoji: "🔥" },
  HARD: { label: "දුෂ්කර", bg: "#fee2e2", color: "#991b1b", emoji: "🏆" },
};

const emptyQuestion = () => ({ question: "", options: ["", "", "", ""], correct: 0, mark: 1 });

export default function AdminViewMemoryGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [editingGame, setEditingGame] = useState(null); // game being edited
  const [editTitle, setEditTitle] = useState("");
  const [editLevel, setEditLevel] = useState("EASY");
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [editQuestions, setEditQuestions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const showMsg = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const fetchGames = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/api/vd_memory/all`);
      setGames(res.data);
    } catch {
      showMsg("ක්‍රීඩා불러올 නොහැකිය", "error");
    }
    setLoading(false);
  };

  useEffect(() => { fetchGames(); }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE}/api/vd_memory/delete/${id}`);
      showMsg("ක්‍රීඩාව සාර්ථකව මකා දමන ලදී! 🗑️");
      setDeleteConfirm(null);
      fetchGames();
    } catch (e) {
      showMsg(e.response?.data?.error || "මකා දැමීම අසාර්ථකයි", "error");
    }
  };

  const openEdit = (game) => {
    setEditingGame(game);
    setEditTitle(game.title);
    setEditLevel(game.level);
    setEditImagePreview(`${BASE}${game.image_url}`);
    setEditImage(null);
    setEditQuestions(game.questions.map((q) => ({ ...q, options: [...q.options] })));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateEditQuestion = (qIdx, field, value, oIdx = null) => {
    setEditQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        if (field === "options") {
          const opts = [...q.options];
          opts[oIdx] = value;
          return { ...q, options: opts };
        }
        return { ...q, [field]: value };
      })
    );
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", editTitle);
      fd.append("level", editLevel);
      fd.append("questions", JSON.stringify(
        editQuestions.map((q) => ({ ...q, correct: parseInt(q.correct), mark: parseInt(q.mark) }))
      ));
      if (editImage) fd.append("image", editImage);

      await axios.put(`${BASE}/api/vd_memory/update/${editingGame._id}`, fd);
      showMsg("ක්‍රීඩාව සාර්ථකව යාවත්කාලීන කරන ලදී! ✅");
      setEditingGame(null);
      fetchGames();
    } catch (e) {
      showMsg(e.response?.data?.error || "යාවත්කාලීන කිරීම අසාර්ථකයි", "error");
    }
    setSaving(false);
  };

  const filteredGames = filterLevel === "ALL" ? games : games.filter((g) => g.level === filterLevel);

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #fdf4ff 100%)", fontFamily: "'Nunito', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
        .card { background: white; border-radius: 24px; box-shadow: 0 6px 24px rgba(0,0,0,0.08); }
        .input-field { width: 100%; border: 2.5px solid #e0e7ff; border-radius: 12px; padding: 10px 14px; font-size: 0.95rem; font-family: 'Nunito', sans-serif; font-weight: 700; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .input-field:focus { border-color: #6366f1; }
        .btn { border: none; border-radius: 14px; padding: 10px 20px; font-weight: 800; cursor: pointer; font-family: 'Nunito', sans-serif; transition: transform 0.15s, box-shadow 0.15s; }
        .btn:hover { transform: scale(1.04); }
        .game-card { background: white; border-radius: 22px; box-shadow: 0 4px 20px rgba(0,0,0,0.07); overflow: hidden; transition: box-shadow 0.2s, transform 0.2s; }
        .game-card:hover { box-shadow: 0 8px 32px rgba(99,102,241,0.15); transform: translateY(-2px); }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: "3rem" }}>🎮</div>
          <h1 style={{ fontWeight: 900, fontSize: "2rem", color: "#4f46e5", margin: "8px 0 4px" }}>
            සියලු ක්‍රීඩා
          </h1>
          <p style={{ color: "#9ca3af", fontWeight: 700 }}>දෘශ්‍ය වෙනස් කිරීමේ ක්‍රීඩා කළමනාකරණය</p>
        </div>

        {/* Toast */}
        {msg.text && (
          <div style={{
            position: "fixed", top: 24, right: 24, zIndex: 1000,
            background: msg.type === "error" ? "#fee2e2" : "#d1fae5",
            color: msg.type === "error" ? "#dc2626" : "#065f46",
            borderRadius: 16, padding: "14px 24px", fontWeight: 800, boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            animation: "fadeIn 0.3s ease-out",
          }}>
            {msg.text}
          </div>
        )}

        {/* Edit Modal */}
        {editingGame && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 900,
            display: "flex", alignItems: "flex-start", justifyContent: "center",
            overflowY: "auto", padding: "24px 16px",
          }}>
            <div className="card" style={{ width: "100%", maxWidth: 600, padding: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontWeight: 900, color: "#4f46e5", fontSize: "1.4rem", margin: 0 }}>✏️ ක්‍රීඩාව සංස්කරණය කරන්න</h2>
                <button className="btn" onClick={() => setEditingGame(null)} style={{ background: "#f3f4f6", color: "#6b7280", padding: "8px 16px" }}>✕ වසන්න</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Title */}
                <div>
                  <label style={{ fontWeight: 800, color: "#374151", display: "block", marginBottom: 6 }}>🎮 ක්‍රීඩා නම</label>
                  <input className="input-field" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                </div>

                {/* Level */}
                <div>
                  <label style={{ fontWeight: 800, color: "#374151", display: "block", marginBottom: 8 }}>📊 මට්ටම</label>
                  <div style={{ display: "flex", gap: 10 }}>
                    {["EASY", "MEDIUM", "HARD"].map((l) => (
                      <button key={l} type="button" className="btn" onClick={() => setEditLevel(l)}
                        style={{
                          flex: 1, background: editLevel === l ? "#6366f1" : "#f3f4f6",
                          color: editLevel === l ? "white" : "#6b7280",
                        }}
                      >
                        {levelConfig[l].emoji} {levelConfig[l].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label style={{ fontWeight: 800, color: "#374151", display: "block", marginBottom: 8 }}>🖼️ පින්තූරය</label>
                  <img src={editImagePreview} alt="current" style={{ width: "100%", maxHeight: 160, objectFit: "contain", borderRadius: 14, border: "2px solid #e0e7ff", marginBottom: 8 }} />
                  <label style={{ cursor: "pointer", display: "block", textAlign: "center", color: "#6366f1", fontWeight: 700, fontSize: "0.85rem" }}>
                    🔄 නව පින්තූරයක් තෝරන්න
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files[0]; if (f) { setEditImage(f); setEditImagePreview(URL.createObjectURL(f)); } }} />
                  </label>
                </div>

                {/* Questions */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <label style={{ fontWeight: 800, color: "#374151" }}>❓ ප්‍රශ්න</label>
                    <button className="btn" onClick={() => setEditQuestions([...editQuestions, emptyQuestion()])}
                      style={{ background: "#ede9fe", color: "#6d28d9", fontSize: "0.8rem", padding: "6px 14px" }}>
                      + එකතු කරන්න
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, maxHeight: 360, overflowY: "auto", paddingRight: 4 }}>
                    {editQuestions.map((q, qIdx) => (
                      <div key={qIdx} style={{ border: "2px solid #e0e7ff", borderRadius: 16, padding: 16, background: "#fafafa" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontWeight: 800, color: "#6366f1", fontSize: "0.85rem" }}>ප්‍රශ්නය {qIdx + 1}</span>
                          {editQuestions.length > 1 && (
                            <button className="btn" onClick={() => setEditQuestions(editQuestions.filter((_, i) => i !== qIdx))}
                              style={{ background: "#fee2e2", color: "#dc2626", padding: "2px 10px", fontSize: "0.75rem" }}>✕</button>
                          )}
                        </div>
                        <input className="input-field" value={q.question} placeholder="ප්‍රශ්නය" onChange={(e) => updateEditQuestion(qIdx, "question", e.target.value)} style={{ marginBottom: 8 }} />
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <input type="radio" name={`edit-correct-${qIdx}`} checked={parseInt(q.correct) === oIdx} onChange={() => updateEditQuestion(qIdx, "correct", oIdx)} style={{ width: 18, height: 18, accentColor: "#10b981", cursor: "pointer", flexShrink: 0 }} />
                            <input className="input-field" value={opt} placeholder={`විකල්පය ${String.fromCharCode(65 + oIdx)}`} onChange={(e) => updateEditQuestion(qIdx, "options", e.target.value, oIdx)}
                              style={{ borderColor: parseInt(q.correct) === oIdx ? "#10b981" : "#e0e7ff", background: parseInt(q.correct) === oIdx ? "#f0fdf4" : "white" }} />
                          </div>
                        ))}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                          <label style={{ fontWeight: 700, color: "#6b7280", fontSize: "0.8rem" }}>ලකුණු:</label>
                          <input type="number" min={1} className="input-field" value={q.mark} onChange={(e) => updateEditQuestion(qIdx, "mark", e.target.value)} style={{ width: 70, padding: "6px 10px" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="btn" onClick={saveEdit} disabled={saving}
                  style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)", color: "white", padding: "14px", fontSize: "1rem", width: "100%" }}>
                  {saving ? "⏳ සුරකිනවා..." : "💾 වෙනස්කම් සුරකින්න"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {deleteConfirm && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div className="card" style={{ padding: 36, maxWidth: 400, width: "100%", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: 12 }}>🗑️</div>
              <h3 style={{ fontWeight: 900, color: "#374151", marginBottom: 8 }}>ක්‍රීඩාව මකා දමන්නද?</h3>
              <p style={{ color: "#9ca3af", fontWeight: 700, marginBottom: 24 }}>"{deleteConfirm.title}" ස්ථිරවම මකා දැමෙනු ඇත.</p>
              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn" onClick={() => setDeleteConfirm(null)} style={{ flex: 1, background: "#f3f4f6", color: "#6b7280" }}>අවලංගු කරන්න</button>
                <button className="btn" onClick={() => handleDelete(deleteConfirm._id)} style={{ flex: 1, background: "#dc2626", color: "white" }}>ඔව්, මකන්න</button>
              </div>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
          {["ALL", "EASY", "MEDIUM", "HARD"].map((l) => (
            <button key={l} className="btn" onClick={() => setFilterLevel(l)}
              style={{
                background: filterLevel === l ? "#6366f1" : "white",
                color: filterLevel === l ? "white" : "#6b7280",
                boxShadow: filterLevel === l ? "0 4px 16px rgba(99,102,241,0.3)" : "0 2px 8px rgba(0,0,0,0.06)",
                padding: "10px 20px",
              }}>
              {l === "ALL" ? "🎯 සියල්ල" : `${levelConfig[l].emoji} ${levelConfig[l].label}`}
              <span style={{ marginLeft: 6, background: filterLevel  === l ? "rgba(255,255,255,0.25)" : "#f3f4f6", borderRadius: 8, padding: "1px 8px", fontSize: "0.8rem", color: filterLevel === l ? "white" : "#6b7280" }}>
                {l === "ALL" ? games.length : games.filter((g) => g.level === l).length}
              </span>
            </button>
          ))}
        </div>

        {/* Games list */}
        {loading ? (
          <div style={{ textAlign: "center", paddingTop: 80 }}>
            <div style={{ fontSize: "3rem" }}>⏳</div>
            <p style={{ color: "#9ca3af", fontWeight: 700, marginTop: 12 }}>පූරණය වෙමින්...</p>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="card" style={{ padding: 60, textAlign: "center" }}>
            <div style={{ fontSize: "3rem" }}>📭</div>
            <p style={{ color: "#9ca3af", fontWeight: 800, marginTop: 12, fontSize: "1.1rem" }}>ක්‍රීඩා නොමැත</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 20 }}>
            {filteredGames.map((game) => {
              const lcfg = levelConfig[game.level] || levelConfig.EASY;
              return (
                <div key={game._id} className="game-card">
                  <div style={{ display: "flex", gap: 0 }}>
                    {/* Image */}
                    <div style={{ width: 140, flexShrink: 0 }}>
                      <img
                        src={`${BASE}${game.image_url}`}
                        alt={game.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "22px 0 0 22px", minHeight: 130 }}
                      />
                    </div>
                    {/* Content */}
                    <div style={{ flex: 1, padding: "20px 20px 20px 20px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                        <h3 style={{ fontWeight: 900, color: "#1f2937", fontSize: "1.1rem", margin: 0, flex: 1 }}>{game.title}</h3>
                        <span style={{ background: lcfg.bg, color: lcfg.color, borderRadius: 10, padding: "3px 12px", fontSize: "0.75rem", fontWeight: 800, flexShrink: 0 }}>
                          {lcfg.emoji} {lcfg.label}
                        </span>
                      </div>

                      <p style={{ color: "#9ca3af", fontWeight: 700, fontSize: "0.8rem", margin: "0 0 12px" }}>
                        ❓ ප්‍රශ්න {game.questions?.length || 0}ක් · 🏅 සම්පූර්ණ ලකුණු: {game.questions?.reduce((s, q) => s + (q.mark || 1), 0)}
                      </p>

                      {/* Question preview */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                        {game.questions?.slice(0, 2).map((q, i) => (
                          <span key={i} style={{ background: "#f3f4f6", color: "#374151", borderRadius: 8, padding: "3px 10px", fontSize: "0.75rem", fontWeight: 700 }}>
                            {q.question.length > 30 ? q.question.slice(0, 30) + "..." : q.question}
                          </span>
                        ))}
                        {(game.questions?.length || 0) > 2 && (
                          <span style={{ background: "#ede9fe", color: "#6d28d9", borderRadius: 8, padding: "3px 10px", fontSize: "0.75rem", fontWeight: 700 }}>
                            +{game.questions.length - 2} තවත්
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: 10 }}>
                        <button className="btn" onClick={() => openEdit(game)}
                          style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: "0.85rem", padding: "8px 18px" }}>
                          ✏️ සංස්කරණය
                        </button>
                        <button className="btn" onClick={() => setDeleteConfirm(game)}
                          style={{ background: "#fee2e2", color: "#dc2626", fontSize: "0.85rem", padding: "8px 18px" }}>
                          🗑️ මකන්න
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
