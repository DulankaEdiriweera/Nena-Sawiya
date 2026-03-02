import { useEffect, useState } from "react";
import axios from "axios";

const BASE = "http://localhost:5000";
const LS = {
  EASY:   { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300", dot: "bg-emerald-400" },
  MEDIUM: { bg: "bg-amber-100",   text: "text-amber-700",   border: "border-amber-300",   dot: "bg-amber-400"   },
  HARD:   { bg: "bg-rose-100",    text: "text-rose-700",    border: "border-rose-300",    dot: "bg-rose-400"    },
};

export default function AdminVdDragManage() {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [newGroups, setNewGroups] = useState([]);
  const [newMarks, setNewMarks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/api/vd_drag_text/all`);
      setActivities(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = filter === "ALL" ? activities : activities.filter((a) => a.level === filter);

  const startEdit = (act) => {
    setEditingId(act._id);
    setEditData({ instruction: act.instruction, level: act.level, targets: [...act.targets] });
    setNewImages([]); setNewGroups([]); setNewMarks([]);
  };

  // filledTargets from edit form — dropdown only shows these
  const editFilledTargets = (editData.targets || []).filter((t) => t.trim() !== "");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setNewGroups(Array(files.length).fill(""));
    setNewMarks(Array(files.length).fill(2));
  };

  const saveEdit = async (id) => {
    if (editFilledTargets.length === 0) return alert("ඉලක්ක හිස් විය නොහැක");
    if (newImages.length > 0 && newGroups.some((g) => !g)) return alert("සෑම රූපයකටම ඉලක්කයක් තෝරන්න");
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("instruction", editData.instruction);
      fd.append("level", editData.level);
      editFilledTargets.forEach((t) => fd.append("targets", t));
      if (newImages.length > 0) {
        newImages.forEach((img) => fd.append("images", img));
        newGroups.forEach((g) => fd.append("groups", g));
        newMarks.forEach((m) => fd.append("marks", m));
      }
      await axios.put(`${BASE}/api/vd_drag_text/update/${id}`, fd);
      setEditingId(null);
      fetchAll();
    } catch (e) {
      alert("දෝෂයක් ඇති විය"); console.error(e);
    } finally { setSaving(false); }
  };

  const deleteActivity = async (id) => {
    try {
      await axios.delete(`${BASE}/api/vd_drag_text/delete/${id}`);
      setDeleteConfirm(null);
      fetchAll();
    } catch (e) { alert("මකා දැමීමේ දෝෂයකි"); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800">ක්‍රියාකාරකම් කළමනාකරණය</h1>
            <p className="text-slate-500 mt-1">දෘශ්‍ය හඳුනාගැනීම — ඇදීම සහ හෙළීම ප්‍රශ්න</p>
          </div>
          <a href="/AdminVdDragTextImage"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow text-sm">
            + නව ක්‍රියාකාරකමක් එකතු කරන්න
          </a>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 w-fit">
          {[["ALL","සියල්ල"], ["EASY","පහසු"], ["MEDIUM","මධ්‍යම"], ["HARD","දුෂ්කර"]].map(([lvl, label]) => {
            const s = LS[lvl] || {};
            const active = filter === lvl;
            const count = lvl === "ALL" ? activities.length : activities.filter((a) => a.level === lvl).length;
            return (
              <button key={lvl} onClick={() => setFilter(lvl)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 ${active ? lvl === "ALL" ? "bg-indigo-600 text-white shadow" : `${s.bg} ${s.text} ${s.border} border shadow` : "text-slate-400 hover:text-slate-600"}`}>
                {label}
                <span className={`text-xs rounded-full px-1.5 py-0.5 ${active && lvl !== "ALL" ? s.bg : "bg-slate-100 text-slate-500"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <div className="text-5xl mb-3 animate-bounce">⏳</div>
            <p className="text-xl font-bold">පූරණය වෙමින්...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-xl font-bold text-slate-500">ක්‍රියාකාරකම් හමු නොවීය</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((act) => {
              const s = LS[act.level] || LS.EASY;
              const isEditing = editingId === act._id;
              return (
                <div key={act._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                  {/* Card header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${s.bg} ${s.text} ${s.border}`}>
                        <span className={`w-2 h-2 rounded-full ${s.dot}`}></span>
                        {act.level === "EASY" ? "පහසු" : act.level === "MEDIUM" ? "මධ්‍යම" : "දුෂ්කර"}
                      </span>
                      {!isEditing && <h2 className="font-bold text-slate-700 truncate">{act.instruction}</h2>}
                    </div>
                    {!isEditing && (
                      <div className="flex gap-2 ml-3 shrink-0">
                        <button onClick={() => startEdit(act)}
                          className="px-4 py-1.5 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-lg hover:bg-indigo-100 border border-indigo-200">
                          සංස්කරණය
                        </button>
                        <button onClick={() => setDeleteConfirm(act._id)}
                          className="px-4 py-1.5 bg-rose-50 text-rose-600 font-bold text-sm rounded-lg hover:bg-rose-100 border border-rose-200">
                          මකන්න
                        </button>
                      </div>
                    )}
                  </div>

                  {/* View mode */}
                  {!isEditing && (
                    <div className="p-5">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">ඉලක්ක</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {act.targets.map((t, i) => (
                          <span key={i} className="w-10 h-10 bg-indigo-50 border-2 border-indigo-200 rounded-xl flex items-center justify-center text-xl font-black text-indigo-700">{t}</span>
                        ))}
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">රූප ({act.items.length})</p>
                      <div className="flex flex-wrap gap-3">
                        {act.items.map((item, i) => (
                          <div key={i} className="relative">
                            <img src={`${BASE}${item.image_url}`} alt=""
                              className="w-16 h-16 object-contain rounded-xl border-2 border-slate-200 bg-slate-50" />
                            <span className={`absolute -top-2 -right-2 text-xs font-black px-1.5 py-0.5 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
                              {item.group}
                            </span>
                            <span className="absolute -bottom-2 -right-2 text-xs bg-amber-400 text-white font-bold px-1.5 rounded-full">
                              {item.mark}ල
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-300 mt-3">
                        එකතු කළ දිනය: {act.created_at ? new Date(act.created_at).toLocaleDateString("si-LK") : "—"}
                      </p>
                    </div>
                  )}

                  {/* Edit mode */}
                  {isEditing && (
                    <div className="p-5 space-y-4 bg-indigo-50/40">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">උපදෙස්</label>
                        <input type="text" value={editData.instruction}
                          onChange={(e) => setEditData({ ...editData, instruction: e.target.value })}
                          className="w-full p-3 border-2 border-indigo-200 rounded-xl text-slate-700 focus:outline-none focus:border-indigo-400 bg-white" />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">දුෂ්කරතා මට්ටම</label>
                        <div className="flex gap-2">
                          {[["EASY","පහසු"],["MEDIUM","මධ්‍යම"],["HARD","දුෂ්කර"]].map(([l, label]) => (
                            <button type="button" key={l} onClick={() => setEditData({ ...editData, level: l })}
                              className={`flex-1 py-2 rounded-xl font-bold border-2 text-sm transition-all ${editData.level === l ? `${LS[l].bg} ${LS[l].text} ${LS[l].border} scale-105` : "bg-white text-slate-400 border-slate-200"}`}>
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">ඉලක්ක අකුරු / අංක</label>
                        <div className="flex flex-wrap gap-2">
                          {editData.targets.map((t, i) => (
                            <div key={i} className="relative">
                              <input maxLength={3} value={t}
                                onChange={(e) => { const n = [...editData.targets]; n[i] = e.target.value; setEditData({ ...editData, targets: n }); }}
                                className="w-14 p-2 border-2 border-indigo-200 rounded-xl text-center text-xl font-black focus:outline-none focus:border-indigo-400 bg-white" />
                              {editData.targets.length > 1 && (
                                <button onClick={() => setEditData({ ...editData, targets: editData.targets.filter((_, idx) => idx !== i) })}
                                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 rounded-full text-white text-xs flex items-center justify-center">✕</button>
                              )}
                            </div>
                          ))}
                          <button type="button" onClick={() => setEditData({ ...editData, targets: [...editData.targets, ""] })}
                            className="w-14 h-10 bg-white border-2 border-dashed border-indigo-200 rounded-xl text-indigo-400 hover:border-indigo-400 text-xl transition">+</button>
                        </div>
                        {editFilledTargets.length > 0 && (
                          <p className="text-xs text-indigo-500 mt-1.5 font-medium">
                            ✅ ඉලක්ක: {editFilledTargets.join(", ")}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">
                          රූප ප්‍රතිස්ථාපනය කරන්න <span className="font-normal normal-case text-slate-400">(අවශ්‍ය නොවේ — හිස්ව තැබුවොත් පවතින රූප රඳනවා)</span>
                        </label>
                        <label className="block border-2 border-dashed border-indigo-300 rounded-xl p-4 text-center cursor-pointer hover:border-indigo-500 bg-white transition">
                          <span className="text-indigo-600 font-bold text-sm">
                            {newImages.length > 0 ? `${newImages.length} රූප තෝරා ඇත` : "📂 නව රූප උඩුගත කරන්න"}
                          </span>
                          <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>

                        {newImages.length > 0 && (
                          <div className="space-y-2 mt-3">
                            {editFilledTargets.length === 0 ? (
                              <p className="text-amber-500 text-sm font-bold text-center py-2">
                                ⚠️ රූප සඳහා ඉලක්ක තෝරන්නට මුලින් ඉලක්ක ඇතුළු කරන්න
                              </p>
                            ) : (
                              newImages.map((img, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white p-2 rounded-xl border border-indigo-100">
                                  <img src={URL.createObjectURL(img)} alt="" className="w-12 h-12 object-contain rounded-lg border" />
                                  {/* Dropdown only shows targets typed by admin */}
                                  <select value={newGroups[i]}
                                    onChange={(e) => { const n = [...newGroups]; n[i] = e.target.value; setNewGroups(n); }}
                                    className="flex-1 p-2 border-2 border-indigo-200 rounded-lg font-bold text-slate-700 focus:outline-none">
                                    <option value="">-- ඉලක්කය තෝරන්න --</option>
                                    {editFilledTargets.map((t, j) => (
                                      <option key={j} value={t}>{t}</option>
                                    ))}
                                  </select>
                                  <input type="number" min={1} max={10} value={newMarks[i]}
                                    onChange={(e) => { const n = [...newMarks]; n[i] = Number(e.target.value); setNewMarks(n); }}
                                    className="w-14 p-2 border-2 border-indigo-200 rounded-lg text-center font-black text-indigo-700 focus:outline-none" />
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => saveEdit(act._id)} disabled={saving}
                          className="flex-1 py-2.5 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 disabled:opacity-60">
                          {saving ? "⏳ සුරකිමින්..." : "💾 වෙනස්කම් සුරකින්න"}
                        </button>
                        <button onClick={() => setEditingId(null)}
                          className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200">
                          අවලංගු කරන්න
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-6xl mb-4">🗑️</div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">ක්‍රියාකාරකම මකන්නද?</h3>
            <p className="text-slate-500 mb-6">මෙය 되돌릴 නොහැකි ක්‍රියාවකි. සියලු දත්ත ඉවත් වේ.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteActivity(deleteConfirm)}
                className="flex-1 py-3 bg-rose-500 text-white font-black rounded-2xl hover:bg-rose-600 shadow">
                ඔව්, මකන්න
              </button>
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200">
                අවලංගු කරන්න
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

