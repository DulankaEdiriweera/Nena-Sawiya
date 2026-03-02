import { useState, useRef, useEffect } from "react";
import axios from "axios";

const LEVEL_COLORS = {
  EASY:   "bg-emerald-100 text-emerald-700 border-emerald-300",
  MEDIUM: "bg-amber-100 text-amber-700 border-amber-300",
  HARD:   "bg-rose-100 text-rose-700 border-rose-300",
};

// Custom image dropdown - shows image thumbnails as options
function ImageDropdown({ images, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = value !== "" ? images[Number(value)] : null;

  return (
    <div ref={ref} className="relative flex-1">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full p-2 border-2 border-gray-200 rounded-lg bg-white flex items-center gap-2 hover:border-purple-400 transition">
        {selected ? (
          <>
            <img src={URL.createObjectURL(selected)} alt="" className="w-8 h-8 object-contain rounded" />
            <span className="text-sm font-bold text-gray-700 truncate">{selected.name}</span>
          </>
        ) : (
          <span className="text-sm text-gray-400">-- රූපය තෝරන්න --</span>
        )}
        <span className="ml-auto text-gray-400">▾</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border-2 border-purple-200 rounded-xl shadow-xl max-h-52 overflow-y-auto">
          {images.map((img, idx) => (
            <button type="button" key={idx}
              onClick={() => { onChange(String(idx)); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-purple-50 transition text-left ${value === String(idx) ? "bg-purple-100" : ""}`}>
              <img src={URL.createObjectURL(img)} alt="" className="w-10 h-10 object-contain rounded-lg border border-gray-200 bg-white" />
              <span className="text-sm font-bold text-gray-700 truncate">{img.name}</span>
              {value === String(idx) && <span className="ml-auto text-purple-500">✓</span>}
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
  // imageGroups[i] = index of image assigned to targets[i]
  const [imageGroups, setImageGroups] = useState({});
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);

  const filledTargets = targets.map((t, i) => ({ t, i })).filter(({ t }) => t.trim() !== "");

  const handleImageUpload = (e) => {
    setImages(Array.from(e.target.files));
    setImageGroups({});
    setMarks({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (filledTargets.length === 0) return alert("අවම වශයෙන් එක් ඉලක්කයක් ඇතුළු කරන්න");
    if (images.length === 0) return alert("රූප උඩුගත කරන්න");
    const unassigned = filledTargets.filter(({ i }) => imageGroups[i] == null || imageGroups[i] === "");
    if (unassigned.length > 0) return alert(`'${unassigned.map(({ t }) => t).join(", ")}' සඳහා රූප තෝරන්න`);

    const fd = new FormData();
    fd.append("instruction", instruction);
    fd.append("level", level);
    filledTargets.forEach(({ t, i }) => {
      fd.append("targets", t);
      fd.append("images", images[Number(imageGroups[i])]);
      fd.append("groups", t);
      fd.append("marks", marks[i] ?? 2);
    });

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/vd_drag_text/add", fd);
      alert("✅ ක්‍රියාකාරකම සාර්ථකව සුරකිනි!");
      setInstruction(""); setLevel("EASY");
      setTargets(["", "", "", ""]); setImages([]); setImageGroups({}); setMarks({});
    } catch (err) {
      console.error(err);
      alert("❌ දෝෂයක් ඇති විය");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow border border-purple-100">
            <span className="text-3xl">🎮</span>
            <div>
              <h1 className="text-xl font-black text-purple-700">නව ක්‍රියාකාරකමක් එකතු කරන්න</h1>
              <p className="text-xs text-gray-400">දෘශ්‍ය හඳුනාගැනීම — ඇදීම සහ හෙළීම</p>
            </div>
          </div>
          <a href="/AdminVdDragManage"
            className="text-sm bg-white border border-indigo-200 text-indigo-700 font-bold px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition shadow-sm">
            ක්‍රියාකාරකම් කළමනාකරණය
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Instruction */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">උපදෙස්</label>
            <input type="text" placeholder="උදා: පෙරලූ අකුරු නිවැරදි ස්ථානයට ගෙනයන්න!"
              value={instruction} onChange={(e) => setInstruction(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none text-gray-700" required />
          </div>

          {/* Level */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide">දුෂ්කරතා මට්ටම</label>
            <div className="flex gap-3">
              {[["EASY","පහසු"], ["MEDIUM","මධ්‍යම"], ["HARD","දුෂ්කර"]].map(([l, label]) => (
                <button type="button" key={l} onClick={() => setLevel(l)}
                  className={`flex-1 py-2 rounded-xl font-bold border-2 transition-all ${level === l ? LEVEL_COLORS[l] + " scale-105 shadow" : "bg-gray-50 text-gray-400 border-gray-200"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Targets keyboard input */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">ඉලක්ක අකුරු / අංක</label>
              <button type="button" onClick={() => setTargets([...targets, ""])}
                className="text-sm bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-lg hover:bg-purple-200">
                + එකතු කරන්න
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {targets.map((t, i) => (
                <div key={i} className="relative">
                  <input type="text" maxLength={3} placeholder={`T${i + 1}`} value={t}
                    onChange={(e) => { const n = [...targets]; n[i] = e.target.value; setTargets(n); }}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl text-center text-2xl font-black focus:border-purple-400 focus:outline-none" />
                  {targets.length > 1 && (
                    <button type="button" onClick={() => setTargets(targets.filter((_, idx) => idx !== i))}
                      className="absolute -top-2 -right-2 bg-red-400 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Upload images */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide">පෙරලූ / භ්‍රමණය වූ රූප උඩුගත කරන්න</label>
            <label className="block w-full border-2 border-dashed border-purple-300 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition">
              <span className="text-4xl block mb-2">📤</span>
              <span className="text-purple-600 font-bold">රූප තෝරන්න</span>
              <span className="text-gray-400 text-sm block mt-1">
                {images.length > 0 ? `${images.length} රූප තෝරා ඇත` : "පෙරලූ හෝ භ්‍රමණය වූ අකුරු/අංක රූප"}
              </span>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {/* Each typed letter/number → pick matching image from dropdown */}
          {filledTargets.length > 0 && images.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">
                සෑම අකුරට ගැළපෙන රූපය තෝරන්න
              </label>
              <p className="text-xs text-gray-400 mb-4">
                ඒ ඒ අකුරට / අංකයට ගැළපෙන පෙරලූ රූපය dropdown එකෙන් තෝරන්න
              </p>
              <div className="space-y-3">
                {filledTargets.map(({ t, i }) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200">

                    {/* Typed letter shown on left */}
                    <div className="w-14 h-14 bg-purple-100 border-2 border-purple-300 rounded-xl flex items-center justify-center text-3xl font-black text-purple-700 shrink-0">
                      {t}
                    </div>

                    <span className="text-gray-400 font-bold text-lg shrink-0">→</span>

                    {/* Image picker dropdown — options are uploaded images */}
                    <ImageDropdown
                      images={images}
                      value={imageGroups[i] ?? ""}
                      onChange={(val) => setImageGroups((prev) => ({ ...prev, [i]: val }))}
                    />

                    {/* Marks */}
                    <div className="text-center shrink-0">
                      <p className="text-xs text-gray-400 mb-1">ලකුණු</p>
                      <input type="number" min={1} max={10} value={marks[i] ?? 2}
                        onChange={(e) => setMarks((prev) => ({ ...prev, [i]: Number(e.target.value) }))}
                        className="w-14 p-2 border-2 border-gray-200 rounded-lg text-center font-black text-purple-700 focus:border-purple-400 focus:outline-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-60">
            {loading ? "⏳ සුරකිමින්..." : "🚀 ක්‍රියාකාරකම සුරකින්න"}
          </button>
        </form>
      </div>
    </div>
  );
}

