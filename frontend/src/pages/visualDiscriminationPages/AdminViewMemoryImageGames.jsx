import { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../../Components/AdminHeader";

const BASE = "http://localhost:5000";

const LS = {
  EASY:   { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-400", label: "Easy" },
  MEDIUM: { bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-400",   label: "Medium" },
  HARD:   { bg: "bg-rose-100",    text: "text-rose-700",    dot: "bg-rose-400",    label: "Hard" },
};

const emptyQuestion = () => ({ question: "", options: ["", "", "", ""], correct: 0, mark: 1 });

export default function AdminViewMemoryGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [editingGame, setEditingGame] = useState(null);
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
      showMsg("Failed to load games", "error");
    }
    setLoading(false);
  };

  useEffect(() => { fetchGames(); }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE}/api/vd_memory/delete/${id}`);
      showMsg("Game deleted successfully! 🗑️");
      setDeleteConfirm(null);
      fetchGames();
    } catch (e) {
      showMsg(e.response?.data?.error || "Failed to delete", "error");
    }
  };

  const openEdit = (game) => {
    setEditingGame(game);
    setEditTitle(game.title);
    setEditLevel(game.level);
    setEditImagePreview(`${BASE}${game.image_url}`);
    setEditImage(null);
    setEditQuestions(game.questions.map((q) => ({ ...q, options: [...q.options] })));
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
      showMsg("Game updated successfully! ✅");
      setEditingGame(null);
      fetchGames();
    } catch (e) {
      showMsg(e.response?.data?.error || "Failed to update", "error");
    }
    setSaving(false);
  };

  const filteredGames = filterLevel === "ALL" ? games : games.filter((g) => g.level === filterLevel);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />

      {/* Toast */}
      {msg.text && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl font-bold text-sm shadow-lg ${msg.type === "error" ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
          {msg.text}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">Visual Discrimination & Memory</p>
            <h1 className="text-2xl font-black text-slate-800">Memory Games Management</h1>
            <p className="text-slate-400 text-sm mt-1">{games.length} game{games.length !== 1 ? "s" : ""} available</p>
          </div>
          <a href="/AdminAddMemoryGame1"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-sm text-sm">
            + Add New Activity
          </a>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 w-fit">
          {[["ALL","All"],["EASY","Easy"],["MEDIUM","Medium"],["HARD","Hard"]].map(([lvl, label]) => {
            const s = LS[lvl] || {};
            const active = filterLevel === lvl;
            const count = lvl === "ALL" ? games.length : games.filter(g => g.level === lvl).length;
            return (
              <button key={lvl} onClick={() => setFilterLevel(lvl)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 ${active ? lvl === "ALL" ? "bg-indigo-600 text-white shadow" : `${s.bg} ${s.text} shadow` : "text-slate-400 hover:text-slate-600"}`}>
                {label}
                <span className={`text-xs rounded-full px-1.5 py-0.5 ${active && lvl !== "ALL" ? s.bg : "bg-slate-100 text-slate-500"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Game List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl animate-bounce">⏳</div>
            <p className="text-slate-400 font-bold mt-3">Loading...</p>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-bold text-slate-400">No games found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGames.map((game) => {
              const s = LS[game.level] || LS.EASY;
              return (
                <div key={game._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex">
                    <img
                      src={`${BASE}${game.image_url}`}
                      alt={game.title}
                      className="w-32 h-full object-cover flex-shrink-0 min-h-[120px]"
                      style={{ borderRadius: "16px 0 0 16px" }}
                    />
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="font-black text-slate-800 text-lg leading-tight">{game.title}</h3>
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mt-1.5 ${s.bg} ${s.text}`}>
                            <span className={`w-2 h-2 rounded-full ${s.dot}`}></span>
                            {s.label}
                          </span>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => openEdit(game)}
                            className="px-4 py-1.5 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-lg hover:bg-indigo-100 border border-indigo-200">
                            Edit
                          </button>
                          <button onClick={() => setDeleteConfirm(game)}
                            className="px-4 py-1.5 bg-rose-50 text-rose-600 font-bold text-sm rounded-lg hover:bg-rose-100 border border-rose-200">
                            Delete
                          </button>
                        </div>
                      </div>

                      <p className="text-slate-400 text-xs font-semibold mb-2">
                        {game.questions?.length || 0} question{(game.questions?.length || 0) !== 1 ? "s" : ""} · Total: {game.questions?.reduce((s, q) => s + (q.mark || 1), 0)}pt
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {game.questions?.slice(0, 2).map((q, i) => (
                          <span key={i} className="bg-slate-100 text-slate-600 rounded-lg px-2 py-1 text-xs font-semibold">
                            {q.question.length > 35 ? q.question.slice(0, 35) + "…" : q.question}
                          </span>
                        ))}
                        {(game.questions?.length || 0) > 2 && (
                          <span className="bg-indigo-50 text-indigo-600 rounded-lg px-2 py-1 text-xs font-bold">
                            +{game.questions.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingGame && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center z-50 p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-4">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-800">Edit Game</h2>
              <button onClick={() => setEditingGame(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm bg-slate-100 px-3 py-1.5 rounded-lg">
                ✕ Close
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Game Title</label>
                <input className="w-full border-2 border-indigo-200 rounded-xl p-3 focus:outline-none focus:border-indigo-400 text-slate-700 font-semibold"
                  value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              </div>

              {/* Level */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Difficulty Level</label>
                <div className="flex gap-2">
                  {[["EASY","Easy"],["MEDIUM","Medium"],["HARD","Hard"]].map(([l, label]) => (
                    <button key={l} type="button" onClick={() => setEditLevel(l)}
                      className={`flex-1 py-2 rounded-xl font-bold border-2 text-sm transition-all ${editLevel === l ? `${LS[l].bg} ${LS[l].text} scale-105` : "bg-white text-slate-400 border-slate-200"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Game Image</label>
                <img src={editImagePreview} alt="" className="w-full max-h-40 object-contain rounded-xl border-2 border-slate-200 mb-2" />
                <label className="block text-center text-indigo-600 font-bold text-sm cursor-pointer hover:text-indigo-700">
                  🔄 Replace Image
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const f = e.target.files[0]; if (f) { setEditImage(f); setEditImagePreview(URL.createObjectURL(f)); } }} />
                </label>
              </div>

              {/* Questions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Questions</label>
                  <button onClick={() => setEditQuestions([...editQuestions, emptyQuestion()])}
                    className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
                    + Add Question
                  </button>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {editQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="border-2 border-slate-200 rounded-xl p-4 bg-slate-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-indigo-500">Question {qIdx + 1}</span>
                        {editQuestions.length > 1 && (
                          <button onClick={() => setEditQuestions(editQuestions.filter((_, i) => i !== qIdx))}
                            className="text-xs font-bold bg-rose-50 text-rose-500 px-2 py-1 rounded-lg hover:bg-rose-100">
                            ✕ Remove
                          </button>
                        )}
                      </div>
                      <input className="w-full border-2 border-indigo-200 rounded-xl p-2 text-sm focus:outline-none focus:border-indigo-400 mb-2 font-semibold"
                        placeholder="Question text"
                        value={q.question} onChange={(e) => updateEditQuestion(qIdx, "question", e.target.value)} />
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2 mb-1.5">
                          <input type="radio" name={`edit-correct-${qIdx}`}
                            checked={parseInt(q.correct) === oIdx}
                            onChange={() => updateEditQuestion(qIdx, "correct", oIdx)}
                            className="w-4 h-4 accent-emerald-500 cursor-pointer flex-shrink-0" />
                          <input className={`flex-1 border-2 rounded-xl p-2 text-sm focus:outline-none font-semibold ${parseInt(q.correct) === oIdx ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white focus:border-indigo-400"}`}
                            placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                            value={opt} onChange={(e) => updateEditQuestion(qIdx, "options", e.target.value, oIdx)} />
                        </div>
                      ))}
                      <div className="flex items-center gap-2 mt-2">
                        <label className="text-xs text-slate-500 font-semibold">Marks:</label>
                        <input type="number" min={1}
                          className="w-16 border-2 border-indigo-200 rounded-lg p-1.5 text-sm text-center font-bold focus:outline-none focus:border-indigo-400"
                          value={q.mark} onChange={(e) => updateEditQuestion(qIdx, "mark", e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={saveEdit} disabled={saving}
                className="w-full py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 disabled:opacity-60 transition">
                {saving ? "⏳ Saving..." : "💾 Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Delete this game?</h3>
            <p className="text-slate-400 font-semibold mb-6">"{deleteConfirm.title}" will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm._id)}
                className="flex-1 py-3 bg-rose-500 text-white font-black rounded-2xl hover:bg-rose-600">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}