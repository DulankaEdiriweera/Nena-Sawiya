import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LEVEL_RULES = {
  easy: { bags: 2, options: 4 },
  medium: { bags: 2, options: 6 },
  hard: { bags: 3, options: 8 },
};

const emptyBag = () => ({ label: "", image: null, preview: null });
const emptyOption = () => ({ image: null, preview: null, correct_bag: "" });

const UploadCell = ({ onChange }) => {
  const [preview, setPreview] = useState(null);
  const handle = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setPreview(URL.createObjectURL(f));
    onChange(f);
  };
  return (
    <div className="relative flex-1">
      <div className="block w-full px-2.5 py-1.5 border border-dashed border-indigo-300 rounded-md bg-slate-50 text-indigo-400 text-xs font-semibold cursor-pointer text-center">
        {preview ? "Click to replace" : "Upload image"}
        <input
          type="file"
          accept="image/*"
          onChange={handle}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </div>
      {preview && (
        <img
          src={preview}
          className="w-9 h-9 rounded-md object-cover border border-slate-200 mt-1.5"
          alt=""
        />
      )}
    </div>
  );
};

const AdminCategorizeForm = () => {
  const navigate = useNavigate();
  const [level, setLevel] = useState("easy");
  const [instruction, setInstruction] = useState("");
  const [bags, setBags] = useState([emptyBag(), emptyBag()]);
  const [options, setOptions] = useState(Array(4).fill(null).map(emptyOption));
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleLevelChange = (val) => {
    const r = LEVEL_RULES[val];
    setLevel(val);
    setBags(Array(r.bags).fill(null).map(emptyBag));
    setOptions(Array(r.options).fill(null).map(emptyOption));
  };

  const updateBag = (i, key, val) => {
    const u = [...bags];
    u[i] = { ...u[i], [key]: val };
    setBags(u);
  };
  const updateOption = (i, key, val) => {
    const u = [...options];
    u[i] = { ...u[i], [key]: val };
    setOptions(u);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let i = 0; i < bags.length; i++)
      if (!bags[i].label || !bags[i].image) {
        setMessage(`Complete bag ${i + 1} label and image.`);
        setIsError(true);
        return;
      }
    for (let i = 0; i < options.length; i++)
      if (!options[i].image || !options[i].correct_bag) {
        setMessage(`Complete option ${i + 1} image and bag assignment.`);
        setIsError(true);
        return;
      }

    setLoading(true);
    const fd = new FormData();
    fd.append("level", level);
    fd.append("instruction", instruction);
    fd.append("bags", JSON.stringify(bags.map((b) => ({ label: b.label }))));
    fd.append(
      "options",
      JSON.stringify(options.map((o) => ({ correct_bag: o.correct_bag }))),
    );
    bags.forEach((b, i) => fd.append(`bag_image_${i}`, b.image));
    options.forEach((o, i) => fd.append(`option_image_${i}`, o.image));

    try {
      const res = await axios.post(
        "http://localhost:5000/api/rld_categorize/add_set",
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setMessage(res.data.message || "Saved successfully.");
      setIsError(false);
      handleLevelChange(level);
      setInstruction("");
      setFormKey((k) => k + 1);
      navigate("/rld-admin-dashboard", {
        state: { activeCat: "Categorization" },
      });
    } catch (err) {
      setMessage(err.response?.data?.error || "Error saving set.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const bagLabels = bags.filter((b) => b.label).map((b) => b.label);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Sinhala:wght@400;600&family=DM+Sans:wght@400;500;600;700&display=swap');
        .dm-sans { font-family: 'DM Sans', sans-serif; }
        .sinhala { font-family: 'Noto Serif Sinhala', serif; }
      `}</style>

      <div className="dm-sans min-h-screen bg-slate-100 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-7 py-6 border-b border-slate-100">
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-1">
              Admin Panel
            </p>
            <p className="text-xl font-bold text-slate-900 mb-0.5">
              Category Sorting — Add Set
            </p>
            <p className="text-sm text-slate-400">
              Student drags images into the correct category bag.
            </p>
          </div>

          {/* Body */}
          <div className="px-7 py-6 pb-8">
            {/* Alert */}
            {message && (
              <div
                className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium mb-5 border ${
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
              <div className="mb-4">
                <label className="block text-xs font-bold tracking-widest uppercase text-indigo-400 mb-1.5">
                  Difficulty Level
                </label>
                <select
                  value={level}
                  onChange={(e) => handleLevelChange(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 outline-none dm-sans"
                >
                  <option value="easy">Easy — 2 bags, 4 images</option>
                  <option value="medium">Medium — 2 bags, 6 images</option>
                  <option value="hard">Hard — 3 bags, 8 images</option>
                </select>
              </div>

              {/* Instruction */}
              <div className="mb-4">
                <label className="block text-xs font-bold tracking-widest uppercase text-indigo-400 mb-1.5">
                  Instruction{" "}
                  <span className="text-xs font-normal text-slate-400 normal-case tracking-normal ml-1">
                    Sinhala
                  </span>
                </label>
                <input
                  value={instruction}
                  required
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="e.g. පළතුරු සහ ඇඳුම් නිවැරදි බෑගවලට දමන්න"
                  className="sinhala w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 outline-none"
                />
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-100 my-1 mb-4" />

              {/* Category Bags */}
              <div className="mb-4">
                <label className="block text-xs font-bold tracking-widest uppercase text-indigo-400 mb-1.5">
                  Category Bags{" "}
                  <span className="text-xs font-normal text-slate-400 normal-case tracking-normal ml-1">
                    {LEVEL_RULES[level].bags} bags
                  </span>
                </label>
                {bags.map((bag, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-3 py-2.5 border border-slate-200 rounded-lg mb-2 bg-slate-50"
                  >
                    <span className="text-xs font-bold text-indigo-400 tracking-wide flex-shrink-0 w-12">
                      Bag {i + 1}
                    </span>
                    <input
                      value={bag.label}
                      required
                      onChange={(e) => updateBag(i, "label", e.target.value)}
                      placeholder="e.g. පළතුරු"
                      className="sinhala flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none min-w-0"
                    />
                    <UploadCell onChange={(f) => updateBag(i, "image", f)} />
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-100 my-1 mb-4" />

              {/* Option Images */}
              <div className="mb-5">
                <label className="block text-xs font-bold tracking-widest uppercase text-indigo-400 mb-1.5">
                  Option Images{" "}
                  <span className="text-xs font-normal text-slate-400 normal-case tracking-normal ml-1">
                    {LEVEL_RULES[level].options} items
                  </span>
                </label>
                {bagLabels.length === 0 && (
                  <p className="text-xs text-yellow-600 font-medium mt-1 mb-2">
                    Enter bag labels above first — then assign each image to a
                    bag.
                  </p>
                )}
                {options.map((opt, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-3 py-2.5 border border-slate-200 rounded-lg mb-2 bg-slate-50"
                  >
                    <span className="text-xs font-bold text-indigo-400 tracking-wide flex-shrink-0 w-6">
                      {i + 1}
                    </span>
                    <UploadCell onChange={(f) => updateOption(i, "image", f)} />
                    <select
                      value={opt.correct_bag}
                      onChange={(e) =>
                        updateOption(i, "correct_bag", e.target.value)
                      }
                      className="border border-slate-200 rounded-md px-2.5 py-1.5 dm-sans text-sm text-slate-900 outline-none flex-shrink-0"
                    >
                      <option value="">Assign bag</option>
                      {bagLabels.map((lbl) => (
                        <option key={lbl} value={lbl}>
                          {lbl}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-lg text-sm font-bold tracking-wide text-white border-none transition-colors ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-slate-900 cursor-pointer hover:bg-slate-700"
                }`}
              >
                {loading ? "Saving…" : "Save Category Set"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCategorizeForm;
