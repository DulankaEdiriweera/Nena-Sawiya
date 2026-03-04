import { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../../Components/AdminHeader";

const BASE = "http://localhost:5000";

const LS = {
  EASY:   { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-400", label: "Easy" },
  MEDIUM: { bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-400",   label: "Medium" },
  HARD:   { bg: "bg-rose-100",    text: "text-rose-700",    dot: "bg-rose-400",    label: "Hard" },
};

export default function AdminManageCountImageGames() {
  const [games, setGames] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/api/vd_count/all`);
      setGames(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGames(); }, []);

  const deleteGame = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    await axios.delete(`${BASE}/api/vd_count/delete/${id}`);
    fetchGames();
  };

  const updateItem = (idx, field, value) => {
    setEditing(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === idx ? { ...item, [field]: value } : item)
    }));
  };

  const saveEdit = async () => {
    await axios.put(`${BASE}/api/vd_count/update/${editing._id}`, editing);
    setEditing(null);
    fetchGames();
  };

  const LevelBadge = ({ level }) => {
    const s = LS[level] || LS.EASY;
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${s.bg} ${s.text}`}>
        <span className={`w-2 h-2 rounded-full ${s.dot}`}></span>
        {s.label}
      </span>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl animate-bounce">⏳</div>
        <p className="text-slate-400 font-bold mt-3">Loading...</p>
      </div>
    </div>
  );

  return (
    <div>
      <div><AdminHeader/></div>
      <div className="min-h-screen bg-slate-50">
      

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">Visual Discrimination & Memory</p>
            <h1 className="text-2xl font-black text-slate-800">Count Image Games Management</h1>
            <p className="text-slate-400 text-sm mt-1">{games.length} game{games.length !== 1 ? "s" : ""} available</p>
          </div>
          <a href="/AdminAddCountImageGame1"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-sm text-sm">
            + Add New Activity
          </a>
        </div>

        {games.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-bold text-slate-400">No games found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {games.map((g) => (
              <div key={g._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 items-start">
                      <img
                        src={`${BASE}${g.question_image_url}`}
                        className="w-24 h-20 object-cover rounded-xl border border-slate-200"
                        onError={e => e.target.src = "https://via.placeholder.com/96x80?text=No+Image"}
                      />
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">{g.title}</h3>
                        <div className="mt-1.5"><LevelBadge level={g.level} /></div>
                        <p className="text-sm text-slate-400 mt-1">Items: {g.items?.length || 0}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => setEditing(JSON.parse(JSON.stringify(g)))}
                        className="px-4 py-1.5 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-lg hover:bg-indigo-100 border border-indigo-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteGame(g._id, g.title)}
                        className="px-4 py-1.5 bg-rose-50 text-rose-600 font-bold text-sm rounded-lg hover:bg-rose-100 border border-rose-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {g.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                        {item.image_url && (
                          <img src={`${BASE}${item.image_url}`} className="w-8 h-8 object-cover rounded-lg"
                            onError={e => e.target.style.display = "none"} />
                        )}
                        <div>
                          <p className="text-xs font-bold text-slate-700">{item.label}</p>
                          <p className="text-xs text-slate-400">Answer: {item.correct_answer} · {item.mark}pt</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-800">Edit Game</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Title</label>
                <input
                  className="border-2 border-indigo-200 rounded-xl p-3 w-full focus:outline-none focus:border-indigo-400 text-slate-700"
                  value={editing.title}
                  onChange={e => setEditing({ ...editing, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Difficulty Level</label>
                <div className="flex gap-2">
                  {[["EASY","Easy"],["MEDIUM","Medium"],["HARD","Hard"]].map(([l, label]) => (
                    <button key={l} type="button" onClick={() => setEditing({ ...editing, level: l })}
                      className={`flex-1 py-2 rounded-xl font-bold border-2 text-sm transition-all ${editing.level === l ? `${LS[l].bg} ${LS[l].text} scale-105` : "bg-white text-slate-400 border-slate-200"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Items</label>
                {editing.items.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-xl p-3 mb-3 space-y-2 border border-slate-200">
                    <p className="text-xs font-bold text-indigo-600">Item {idx + 1}: {item.label}</p>
                    <div>
                      <label className="text-xs text-slate-500">Label</label>
                      <input
                        className="border-2 border-indigo-200 rounded-xl p-2 w-full text-sm focus:outline-none focus:border-indigo-400 mt-0.5"
                        value={item.label}
                        onChange={e => updateItem(idx, "label", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-slate-500">Correct Answer</label>
                        <input type="number" min="0"
                          className="border-2 border-indigo-200 rounded-xl p-2 w-full text-sm focus:outline-none focus:border-indigo-400 mt-0.5"
                          value={item.correct_answer}
                          onChange={e => updateItem(idx, "correct_answer", Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Marks</label>
                        <input type="number" min="1"
                          className="border-2 border-indigo-200 rounded-xl p-2 w-full text-sm focus:outline-none focus:border-indigo-400 mt-0.5"
                          value={item.mark}
                          onChange={e => updateItem(idx, "mark", Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={saveEdit}
                  className="flex-1 bg-indigo-600 text-white font-black py-3 rounded-2xl hover:bg-indigo-700 transition">
                  💾 Save Changes
                </button>
                <button onClick={() => setEditing(null)}
                  className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-2xl hover:bg-slate-200 transition">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

    </div>
    
  );
}