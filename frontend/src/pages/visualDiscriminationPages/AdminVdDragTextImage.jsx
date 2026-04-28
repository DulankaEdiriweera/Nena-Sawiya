import { useState, useRef, useEffect } from "react";
import axios from "axios";
import AdminHeader from "../../Components/AdminHeader";

function ImageDropdown({ images, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const selected = value !== "" ? images[Number(value)] : null;
  return (
    <div ref={ref} className="relative flex-1">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full p-2 rounded-xl bg-white flex items-center gap-2" style={{ border: "2px solid #ddd6fe" }}>
        {selected
          ? <><img src={URL.createObjectURL(selected)} alt="" className="w-8 h-8 object-contain rounded" /><span className="text-sm font-bold text-gray-700 truncate">{selected.name}</span></>
          : <span className="text-sm text-gray-400">-- Select image --</span>}
        <span className="ml-auto text-gray-400">▾</span>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-xl max-h-52 overflow-y-auto" style={{ border: "2px solid #a78bfa" }}>
          {images.map((img, idx) => (
            <button type="button" key={idx} onClick={() => { onChange(String(idx)); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left"
              style={{ background: value === String(idx) ? "#ede9fe" : "transparent" }}>
              <img src={URL.createObjectURL(img)} alt="" className="w-10 h-10 object-contain rounded-lg border border-gray-200 bg-white" />
              <span className="text-sm font-bold text-gray-700 truncate">{img.name}</span>
              {value === String(idx) && <span className="ml-auto" style={{ color: "#7c3aed" }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminVdDragTextImage() {
  const [instruction, setInstruction] = useState("");
  const [level, setLevel] = useState("EASY");
  const [targets, setTargets] = useState(["", "", "", ""]);
  const [images, setImages] = useState([]);
  const [imageGroups, setImageGroups] = useState({});
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);

  const filledTargets = targets.map((t, i) => ({ t, i })).filter(({ t }) => t.trim() !== "");
  const assignedIdx = new Set(
    filledTargets.filter(({ i }) => imageGroups[i] != null && imageGroups[i] !== "").map(({ i }) => Number(imageGroups[i]))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!filledTargets.length) return alert("Please enter at least one target");
    if (!images.length) return alert("Please upload images");
    const unassigned = filledTargets.filter(({ i }) => imageGroups[i] == null || imageGroups[i] === "");
    if (unassigned.length) return alert(`Assign images to: ${unassigned.map(({ t }) => t).join(", ")}`);

    const fd = new FormData();
    fd.append("instruction", instruction);
    fd.append("level", level);

    // 1. Correct answer images — one per target
    filledTargets.forEach(({ t, i }) => {
      fd.append("targets", t);
      fd.append("images", images[Number(imageGroups[i])]);
      fd.append("groups", t);
      fd.append("marks", marks[i] ?? 2);
    });

    // 2. Distractor images — every uploaded image NOT assigned as a correct answer.
    //    We MUST append "targets" for each one too, otherwise the backend skips them.
    images.forEach((img, idx) => {
      if (!assignedIdx.has(idx)) {
        fd.append("targets", "distractor");   // ← key fix: backend needs this per image
        fd.append("images", img);
        fd.append("groups", "distractor");
        fd.append("marks", 0);
      }
    });

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/vd_drag_text/add", fd);
      alert("✅ Activity saved!");
      setInstruction(""); setLevel("EASY"); setTargets(["", "", "", ""]); setImages([]); setImageGroups({}); setMarks({});
    } catch { alert("❌ An error occurred"); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <AdminHeader />
      <div style={{ fontFamily: "'Poppins', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');`}</style>
        <div className="min-h-screen p-6" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #fdf2ff 100%)" }}>
          <div className="max-w-3xl mx-auto">

            <div className="rounded-2xl p-6 mb-6 text-white text-center shadow-lg" style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
              <div className="text-4xl mb-2">🎮</div>
              <h1 className="text-2xl font-bold">Add Drag & Drop Activity</h1>
              <p className="text-sm mt-1" style={{ color: "#ddd6fe" }}>Visual recognition — Drag and drop</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1.5px solid #ede9fe" }}>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Instruction</label>
                <input type="text" placeholder="e.g. Drag the flipped letters to the correct position!"
                  value={instruction} onChange={(e) => setInstruction(e.target.value)}
                  className="w-full p-3 rounded-xl focus:outline-none text-gray-700" style={{ border: "2px solid #ddd6fe" }} required />
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1.5px solid #ede9fe" }}>
                <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide">Difficulty Level</label>
                <div className="flex gap-3">
                  {[["EASY","Easy","#d1fae5","#065f46"],["MEDIUM","Medium","#fef9c3","#713f12"],["HARD","Hard","#fee2e2","#7f1d1d"]].map(([l,label,bg,col]) => (
                    <button type="button" key={l} onClick={() => setLevel(l)} className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all"
                      style={{ background: level===l?bg:"#f9fafb", color: level===l?col:"#9ca3af", border:`2px solid ${level===l?col:"#e5e7eb"}`, transform: level===l?"scale(1.04)":"scale(1)" }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1.5px solid #ede9fe" }}>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Target Letters / Numbers</label>
                  <button type="button" onClick={() => setTargets([...targets, ""])}
                    className="text-sm font-bold px-3 py-1 rounded-lg" style={{ background: "#ede9fe", color: "#7c3aed" }}>+ Add</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {targets.map((t, i) => (
                    <div key={i} className="relative">
                      <input type="text" maxLength={3} placeholder={`T${i+1}`} value={t}
                        onChange={(e) => { const n=[...targets]; n[i]=e.target.value; setTargets(n); }}
                        className="w-full p-3 rounded-xl text-center text-2xl font-black focus:outline-none" style={{ border: "2px solid #ddd6fe" }} />
                      {targets.length > 1 && (
                        <button type="button" onClick={() => setTargets(targets.filter((_,idx)=>idx!==i))}
                          className="absolute -top-2 -right-2 w-5 h-5 text-xs flex items-center justify-center text-white rounded-full" style={{ background: "#f87171" }}>✕</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1.5px solid #ede9fe" }}>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">Upload Images</label>
                <p className="text-xs text-gray-400 mb-3">
                  Upload <strong>all</strong> images — correct answers + extra distractors. Assign correct ones below; everything else shows in the user pool automatically.
                </p>
                <label className="block w-full rounded-xl p-6 text-center cursor-pointer" style={{ border: "2px dashed #a78bfa", background: "#faf5ff" }}>
                  <span className="text-4xl block mb-2">📤</span>
                  <span className="font-bold" style={{ color: "#7c3aed" }}>Select Images</span>
                  <span className="text-gray-400 text-sm block mt-1">
                    {images.length > 0
                      ? `${images.length} uploaded — ${assignedIdx.size} correct, ${images.length - assignedIdx.size} distractors`
                      : "Flipped or rotated letter/number images"}
                  </span>
                  <input type="file" multiple accept="image/*"
                    onChange={(e) => { setImages(Array.from(e.target.files)); setImageGroups({}); setMarks({}); }} className="hidden" />
                </label>
              </div>

              {filledTargets.length > 0 && images.length > 0 && (
                <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: "1.5px solid #ede9fe" }}>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">Assign correct image to each letter</label>
                  <p className="text-xs text-gray-400 mb-4">All other uploaded images will appear as distractors in the user pool automatically.</p>
                  <div className="space-y-3">
                    {filledTargets.map(({ t, i }) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: "#faf5ff", border: "1px solid #ede9fe" }}>
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl font-black shrink-0"
                          style={{ background: "#ede9fe", border: "2px solid #c4b5fd", color: "#7c3aed" }}>{t}</div>
                        <span className="text-gray-400 font-bold text-lg shrink-0">→</span>
                        <ImageDropdown images={images} value={imageGroups[i] ?? ""} onChange={(val) => setImageGroups(p => ({ ...p, [i]: val }))} />
                        <div className="text-center shrink-0">
                          <p className="text-xs text-gray-400 mb-1">Marks</p>
                          <input type="number" min={1} max={10} value={marks[i] ?? 2}
                            onChange={(e) => setMarks(p => ({ ...p, [i]: Number(e.target.value) }))}
                            className="p-2 rounded-lg text-center font-black focus:outline-none"
                            style={{ width: 56, border: "2px solid #ddd6fe", color: "#7c3aed" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full py-4 text-white font-bold text-lg rounded-xl shadow-lg transition"
                style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", opacity: loading ? 0.6 : 1 }}>
                {loading ? "⏳ Saving..." : "🚀 Save Activity"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}