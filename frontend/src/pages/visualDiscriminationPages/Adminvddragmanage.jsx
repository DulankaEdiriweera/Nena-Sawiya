import { useEffect, useState, useRef } from "react";
import axios from "axios";
import AdminHeader from "../../Components/AdminHeader";

const BASE = "http://localhost:5000";

const LS = {
  EASY:   { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300", dot: "bg-emerald-400", label: "Easy" },
  MEDIUM: { bg: "bg-amber-100",   text: "text-amber-700",   border: "border-amber-300",   dot: "bg-amber-400",   label: "Medium" },
  HARD:   { bg: "bg-rose-100",    text: "text-rose-700",    border: "border-rose-300",    dot: "bg-rose-400",    label: "Hard" },
};

// Custom dropdown showing uploaded image thumbnails as options
function ImageDropdown({ images, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = value !== "" && value != null ? images[Number(value)] : null;

  return (
    <div ref={ref} className="relative flex-1">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full p-2 border-2 border-indigo-200 rounded-lg bg-white flex items-center gap-2 hover:border-indigo-400 transition">
        {selected ? (
          <>
            <img src={URL.createObjectURL(selected)} alt="" className="w-8 h-8 object-contain rounded border" />
            <span className="text-sm font-bold text-slate-700 truncate">{selected.name}</span>
          </>
        ) : (
          <span className="text-sm text-slate-400">-- Select Image --</span>
        )}
        <span className="ml-auto text-slate-400 text-xs">▾</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border-2 border-indigo-200 rounded-xl shadow-xl max-h-52 overflow-y-auto">
          {images.map((img, idx) => (
            <button type="button" key={idx}
              onClick={() => { onChange(String(idx)); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-indigo-50 transition text-left ${value === String(idx) ? "bg-indigo-100" : ""}`}>
              <img src={URL.createObjectURL(img)} alt="" className="w-10 h-10 object-contain rounded-lg border border-slate-200 bg-white shrink-0" />
              <span className="text-sm font-bold text-slate-700 truncate">{img.name}</span>
              {value === String(idx) && <span className="ml-auto text-indigo-500 shrink-0">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminVdDragManage() {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [newImageMap, setNewImageMap] = useState({});  // { targetIndex: imageFileIndex }
  const [newMarks, setNewMarks] = useState({});
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
    setNewImages([]); setNewImageMap({}); setNewMarks({});
  };

  // Only filled targets used for assignment
  const editFilledTargets = (editData.targets || [])
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => t.trim() !== "");

  const handleImageUpload = (e) => {
    setNewImages(Array.from(e.target.files));
    setNewImageMap({});
    setNewMarks({});
  };

  const saveEdit = async (id) => {
    if (editFilledTargets.length === 0) return alert("Targets cannot be empty");

    if (newImages.length > 0) {
      const unassigned = editFilledTargets.filter(({ i }) => newImageMap[i] == null || newImageMap[i] === "");
      if (unassigned.length > 0) return alert(`Please assign an image for: ${unassigned.map(({ t }) => t).join(", ")}`);
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("instruction", editData.instruction);
      fd.append("level", editData.level);
      editFilledTargets.forEach(({ t }) => fd.append("targets", t));

      if (newImages.length > 0) {
        editFilledTargets.forEach(({ t, i }) => {
          fd.append("images", newImages[Number(newImageMap[i])]);
          fd.append("groups", t);
          fd.append("marks", newMarks[i] ?? 2);
        });
      }

      await axios.put(`${BASE}/api/vd_drag_text/update/${id}`, fd);
      setEditingId(null);
      fetchAll();
    } catch (e) {
      alert("An error occurred"); console.error(e);
    } finally { setSaving(false); }
  };

  const deleteActivity = async (id) => {
    try {
      await axios.delete(`${BASE}/api/vd_drag_text/delete/${id}`);
      setDeleteConfirm(null);
      fetchAll();
    } catch (e) { alert("Failed to delete activity"); }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">Visual Discrimination & Memory</p>
            <h1 className="text-2xl font-black text-slate-800">Drag & Drop Activity Management</h1>
          </div>
          <a href="/AdminVdDragTextImage"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-sm text-sm">
            + Add New Activity
          </a>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 w-fit">
          {[["ALL","All"],["EASY","Easy"],["MEDIUM","Medium"],["HARD","Hard"]].map(([lvl, label]) => {
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
            <div className="text-4xl mb-3 animate-bounce">⏳</div>
            <p className="font-bold">Loading...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-bold text-slate-400">No activities found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((act) => {
              const s = LS[act.level] || LS.EASY;
              const isEditing = editingId === act._id;
              return (
                <div key={act._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                  {/* Card Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${s.bg} ${s.text} ${s.border}`}>
                        <span className={`w-2 h-2 rounded-full ${s.dot}`}></span>
                        {s.label}
                      </span>
                      {!isEditing && <h2 className="font-bold text-slate-700 truncate">{act.instruction}</h2>}
                    </div>
                    {!isEditing && (
                      <div className="flex gap-2 ml-3 shrink-0">
                        <button onClick={() => startEdit(act)}
                          className="px-4 py-1.5 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-lg hover:bg-indigo-100 border border-indigo-200">
                          Edit
                        </button>
                        <button onClick={() => setDeleteConfirm(act._id)}
                          className="px-4 py-1.5 bg-rose-50 text-rose-600 font-bold text-sm rounded-lg hover:bg-rose-100 border border-rose-200">
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* View Mode */}
                  {!isEditing && (
                    <div className="p-5">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">Targets</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {act.targets.map((t, i) => (
                          <span key={i} className="w-10 h-10 bg-indigo-50 border-2 border-indigo-200 rounded-xl flex items-center justify-center text-xl font-black text-indigo-700">{t}</span>
                        ))}
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">Images ({act.items.length})</p>
                      <div className="flex flex-wrap gap-3">
                        {act.items.map((item, i) => (
                          <div key={i} className="relative">
                            <img src={`${BASE}${item.image_url}`} alt=""
                              className="w-16 h-16 object-contain rounded-xl border-2 border-slate-200 bg-slate-50" />
                            <span className={`absolute -top-2 -right-2 text-xs font-black px-1.5 py-0.5 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
                              {item.group}
                            </span>
                            <span className="absolute -bottom-2 -right-2 text-xs bg-amber-400 text-white font-bold px-1.5 rounded-full">
                              {item.mark}pt
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-300 mt-3">
                        Added: {act.created_at ? new Date(act.created_at).toLocaleDateString("en-US") : "—"}
                      </p>
                    </div>
                  )}

                  {/* Edit Mode */}
                  {isEditing && (
                    <div className="p-5 space-y-4 bg-indigo-50/40">

                      {/* Instruction */}
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Instruction</label>
                        <input type="text" value={editData.instruction}
                          onChange={(e) => setEditData({ ...editData, instruction: e.target.value })}
                          className="w-full p-3 border-2 border-indigo-200 rounded-xl text-slate-700 focus:outline-none focus:border-indigo-400 bg-white" />
                      </div>

                      {/* Level */}
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Difficulty Level</label>
                        <div className="flex gap-2">
                          {[["EASY","Easy"],["MEDIUM","Medium"],["HARD","Hard"]].map(([l, label]) => (
                            <button type="button" key={l} onClick={() => setEditData({ ...editData, level: l })}
                              className={`flex-1 py-2 rounded-xl font-bold border-2 text-sm transition-all ${editData.level === l ? `${LS[l].bg} ${LS[l].text} ${LS[l].border} scale-105` : "bg-white text-slate-400 border-slate-200"}`}>
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Targets */}
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Target Letters / Numbers</label>
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
                      </div>

                      {/* Replace Images */}
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">
                          Replace Images{" "}
                          <span className="font-normal normal-case text-slate-400">(optional — leave empty to keep existing)</span>
                        </label>

                        <label className="block border-2 border-dashed border-indigo-300 rounded-xl p-4 text-center cursor-pointer hover:border-indigo-500 bg-white transition">
                          <span className="text-indigo-600 font-bold text-sm">
                            {newImages.length > 0 ? `${newImages.length} image(s) selected` : "📂 Upload New Images"}
                          </span>
                          <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>

                        {/* Each typed target → pick its matching image from dropdown */}
                        {newImages.length > 0 && editFilledTargets.length > 0 && (
                          <div className="mt-3 space-y-3">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                              Assign image to each target
                            </p>
                            {editFilledTargets.map(({ t, i }) => (
                              <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-indigo-100">
                                {/* Typed letter on the left */}
                                <div className="w-12 h-12 bg-indigo-50 border-2 border-indigo-200 rounded-xl flex items-center justify-center text-2xl font-black text-indigo-700 shrink-0">
                                  {t}
                                </div>
                                <span className="text-slate-400 font-bold shrink-0">→</span>

                                {/* Image picker dropdown */}
                                <ImageDropdown
                                  images={newImages}
                                  value={newImageMap[i] ?? ""}
                                  onChange={(val) => setNewImageMap((prev) => ({ ...prev, [i]: val }))}
                                />

                                {/* Marks */}
                                <div className="text-center shrink-0">
                                  <p className="text-xs text-slate-400 mb-1">Marks</p>
                                  <input type="number" min={1} max={10} value={newMarks[i] ?? 2}
                                    onChange={(e) => setNewMarks((prev) => ({ ...prev, [i]: Number(e.target.value) }))}
                                    className="w-14 p-2 border-2 border-indigo-200 rounded-lg text-center font-black text-indigo-700 focus:outline-none" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {newImages.length > 0 && editFilledTargets.length === 0 && (
                          <p className="text-amber-500 text-sm font-bold text-center py-2 mt-2">
                            ⚠️ Please enter target letters/numbers first
                          </p>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => saveEdit(act._id)} disabled={saving}
                          className="flex-1 py-2.5 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 disabled:opacity-60">
                          {saving ? "⏳ Saving..." : "💾 Save Changes"}
                        </button>
                        <button onClick={() => setEditingId(null)}
                          className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200">
                          Cancel
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

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Delete this activity?</h3>
            <p className="text-slate-500 mb-6">This action is irreversible. All data will be removed.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteActivity(deleteConfirm)}
                className="flex-1 py-3 bg-rose-500 text-white font-black rounded-2xl hover:bg-rose-600">
                Yes, Delete
              </button>
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}