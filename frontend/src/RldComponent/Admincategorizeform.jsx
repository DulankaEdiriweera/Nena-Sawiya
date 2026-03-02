// src/RldCategorize/AdminCategorizeForm.jsx
import React, { useState } from "react";
import axios from "axios";

const LEVEL_RULES = {
  easy: { bags: 2, options: 4 },
  medium: { bags: 2, options: 6 },
  hard: { bags: 3, options: 8 },
};

const emptyBag = () => ({ label: "", image: null, preview: null });
const emptyOption = () => ({ image: null, preview: null, correct_bag: "" });

const s = {
  wrap: {
    minHeight: "100vh",
    background: "#f4f4f8",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "40px 16px",
    fontFamily: "'DM Sans',sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 640,
    background: "#fff",
    border: "1px solid #e2e2ee",
    borderRadius: 16,
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
    overflow: "hidden",
  },
  header: { padding: "24px 28px", borderBottom: "1px solid #ebebf5" },
  tag: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#9999bb",
    marginBottom: 4,
  },
  title: { fontSize: 20, fontWeight: 700, color: "#1a1a2e", marginBottom: 2 },
  sub: { fontSize: 13, color: "#9999bb" },
  body: { padding: "24px 28px 32px" },
  alert: (e) => ({
    display: "flex",
    gap: 10,
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 20,
    border: "1px solid",
    background: e ? "#fdf3f2" : "#f0faf4",
    borderColor: e ? "#e8b4b0" : "#a8dbbe",
    color: e ? "#c0392b" : "#1a7a4a",
  }),
  dot: (e) => ({
    width: 6,
    height: 6,
    borderRadius: "50%",
    marginTop: 5,
    flexShrink: 0,
    background: e ? "#c0392b" : "#27ae60",
  }),
  field: { marginBottom: 18 },
  label: {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#6666aa",
    marginBottom: 6,
  },
  hint: {
    fontSize: 11,
    fontWeight: 400,
    color: "#aaaacc",
    textTransform: "none",
    letterSpacing: 0,
    marginLeft: 6,
  },
  select: {
    width: "100%",
    border: "1px solid #e2e2ee",
    borderRadius: 8,
    padding: "10px 14px",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 14,
    color: "#1a1a2e",
    outline: "none",
    boxSizing: "border-box",
  },
  input: {
    width: "100%",
    border: "1px solid #e2e2ee",
    borderRadius: 8,
    padding: "9px 12px",
    fontFamily: "'Noto Serif Sinhala',serif",
    fontSize: 14,
    color: "#1a1a2e",
    outline: "none",
    boxSizing: "border-box",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    border: "1px solid #e2e2ee",
    borderRadius: 8,
    marginBottom: 8,
    background: "#fafafa",
  },
  badge: {
    fontSize: 11,
    fontWeight: 700,
    color: "#6666aa",
    letterSpacing: "0.08em",
    flexShrink: 0,
    width: 48,
  },
  thumb: {
    width: 36,
    height: 36,
    borderRadius: 6,
    objectFit: "cover",
    border: "1px solid #e2e2ee",
    flexShrink: 0,
  },
  upload: { position: "relative", flex: 1 },
  fileBtn: {
    display: "block",
    width: "100%",
    padding: "7px 10px",
    border: "1px dashed #c8c8e8",
    borderRadius: 6,
    background: "#f7f7fb",
    color: "#7777bb",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "center",
    boxSizing: "border-box",
  },
  fileHid: {
    position: "absolute",
    inset: 0,
    opacity: 0,
    cursor: "pointer",
    width: "100%",
    height: "100%",
  },
  assign: {
    border: "1px solid #e2e2ee",
    borderRadius: 6,
    padding: "7px 10px",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 13,
    color: "#1a1a2e",
    outline: "none",
    flexShrink: 0,
  },
  divider: { height: 1, background: "#ebebf5", margin: "4px 0 18px" },
  submit: (loading) => ({
    width: "100%",
    padding: 14,
    background: loading ? "#aaaacc" : "#1a1a2e",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: loading ? "not-allowed" : "pointer",
    letterSpacing: "0.04em",
  }),
  warn: { fontSize: 12, color: "#d68910", fontWeight: 500, marginTop: 4 },
};

const UploadCell = ({ value, onChange }) => {
  const [preview, setPreview] = useState(null);
  const handle = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setPreview(URL.createObjectURL(f));
    onChange(f);
  };
  return (
    <div style={s.upload}>
      <div style={s.fileBtn}>
        {preview ? "Click to replace" : "Upload image"}
        <input
          type="file"
          accept="image/*"
          onChange={handle}
          style={s.fileHid}
        />
      </div>
      {preview && (
        <img src={preview} style={{ ...s.thumb, marginTop: 6 }} alt="" />
      )}
    </div>
  );
};

const AdminCategorizeForm = () => {
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
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      setMessage(res.data.message || "Saved successfully.");
      setIsError(false);
      handleLevelChange(level);
      setInstruction("");
      setFormKey((k) => k + 1);
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
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Sinhala:wght@400;600&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
      <div style={s.wrap}>
        <div style={s.card}>
          <div style={s.header}>
            <p style={s.tag}>Admin Panel</p>
            <p style={s.title}>Category Sorting — Add Set</p>
            <p style={s.sub}>
              Student drags images into the correct category bag.
            </p>
          </div>

          <div style={s.body}>
            {message && (
              <div style={s.alert(isError)}>
                <div style={s.dot(isError)} />
                {message}
              </div>
            )}

            <form key={formKey} onSubmit={handleSubmit}>
              <div style={s.field}>
                <label style={s.label}>Difficulty Level</label>
                <select
                  value={level}
                  onChange={(e) => handleLevelChange(e.target.value)}
                  style={s.select}
                >
                  <option value="easy">Easy — 2 bags, 4 images</option>
                  <option value="medium">Medium — 2 bags, 6 images</option>
                  <option value="hard">Hard — 3 bags, 8 images</option>
                </select>
              </div>

              <div style={s.field}>
                <label style={s.label}>
                  Instruction <span style={s.hint}>Sinhala</span>
                </label>
                <input
                  value={instruction}
                  required
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="e.g. පළතුරු සහ ඇඳුම් නිවැරදි බෑගවලට දමන්න"
                  style={s.input}
                />
              </div>

              <div style={s.divider} />

              {/* Bags */}
              <div style={s.field}>
                <label style={s.label}>
                  Category Bags{" "}
                  <span style={s.hint}>{LEVEL_RULES[level].bags} bags</span>
                </label>
                {bags.map((bag, i) => (
                  <div key={i} style={s.row}>
                    <span style={s.badge}>Bag {i + 1}</span>
                    <input
                      value={bag.label}
                      required
                      onChange={(e) => updateBag(i, "label", e.target.value)}
                      placeholder="e.g. පළතුරු"
                      style={{ ...s.input, flex: 1, width: "auto" }}
                    />
                    <UploadCell
                      value={bag.image}
                      onChange={(f) => updateBag(i, "image", f)}
                    />
                  </div>
                ))}
              </div>

              <div style={s.divider} />

              {/* Options */}
              <div style={s.field}>
                <label style={s.label}>
                  Option Images{" "}
                  <span style={s.hint}>{LEVEL_RULES[level].options} items</span>
                </label>
                {bagLabels.length === 0 && (
                  <p style={s.warn}>
                    Enter bag labels above first — then assign each image to a
                    bag.
                  </p>
                )}
                {options.map((opt, i) => (
                  <div key={i} style={s.row}>
                    <span style={{ ...s.badge, width: 24 }}>{i + 1}</span>
                    <UploadCell
                      value={opt.image}
                      onChange={(f) => updateOption(i, "image", f)}
                    />
                    <select
                      value={opt.correct_bag}
                      onChange={(e) =>
                        updateOption(i, "correct_bag", e.target.value)
                      }
                      style={s.assign}
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

              <button
                type="submit"
                disabled={loading}
                style={s.submit(loading)}
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
