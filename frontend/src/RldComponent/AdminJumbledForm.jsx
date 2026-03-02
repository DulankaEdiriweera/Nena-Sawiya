// src/RldJumbled/AdminJumbledSentenceForm.jsx
import React, { useState } from "react";
import axios from "axios";

const MIN_WORDS = { easy: 2, medium: 3, hard: 5 };
const MAX_WORDS = { easy: 3, medium: 4, hard: 5 };

const AdminJumbledSentenceForm = () => {
  const [level, setLevel] = useState("easy");
  const [jumbledWords, setJumbledWords] = useState(["", ""]);
  const [correctWords, setCorrectWords] = useState(["", ""]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleLevelChange = (lvl) => {
    setLevel(lvl);
    setJumbledWords(Array(MIN_WORDS[lvl]).fill(""));
    setCorrectWords(Array(MIN_WORDS[lvl]).fill(""));
  };

  const updateWord = (setter, list, i, val) => {
    const u = [...list];
    u[i] = val;
    setter(u);
  };

  const addWord = () => {
    if (jumbledWords.length >= MAX_WORDS[level]) return;
    setJumbledWords([...jumbledWords, ""]);
    setCorrectWords([...correctWords, ""]);
  };

  const removeWord = (i) => {
    if (jumbledWords.length <= MIN_WORDS[level]) return;
    setJumbledWords(jumbledWords.filter((_, idx) => idx !== i));
    setCorrectWords(correctWords.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cj = jumbledWords.map((w) => w.trim()).filter(Boolean);
    const cc = correctWords.map((w) => w.trim()).filter(Boolean);
    if (cj.length < MIN_WORDS[level]) {
      setMessage(`Minimum ${MIN_WORDS[level]} words required.`);
      setIsError(true);
      return;
    }
    if (cj.length !== cc.length) {
      setMessage(
        "Jumbled and correct order must have the same number of words.",
      );
      setIsError(true);
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/rld_jumbled/add_jumbled_set",
        { level, jumbled_words: cj, correct_words: cc },
      );
      setMessage(res.data.message || "Saved successfully.");
      setIsError(false);
      setJumbledWords(Array(MIN_WORDS[level]).fill(""));
      setCorrectWords(Array(MIN_WORDS[level]).fill(""));
      setFormKey((k) => k + 1);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error saving sentence.");
      setIsError(true);
    }
  };

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
      maxWidth: 620,
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
    body: { padding: "24px 28px 28px" },
    alert: (err) => ({
      display: "flex",
      gap: 10,
      padding: "10px 14px",
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 500,
      marginBottom: 20,
      border: "1px solid",
      background: err ? "#fdf3f2" : "#f0faf4",
      borderColor: err ? "#e8b4b0" : "#a8dbbe",
      color: err ? "#c0392b" : "#1a7a4a",
    }),
    dot: (err) => ({
      width: 6,
      height: 6,
      borderRadius: "50%",
      marginTop: 5,
      flexShrink: 0,
      background: err ? "#c0392b" : "#27ae60",
    }),
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
      marginBottom: 18,
      boxSizing: "border-box",
    },
    row: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
    num: {
      fontSize: 11,
      fontWeight: 700,
      color: "#aaaacc",
      width: 18,
      flexShrink: 0,
    },
    input: (green) => ({
      flex: 1,
      border: `1px solid ${green ? "#a8dbbe" : "#e2e2ee"}`,
      borderRadius: 8,
      padding: "9px 12px",
      fontFamily: "'Noto Serif Sinhala',serif",
      fontSize: 14,
      color: "#1a1a2e",
      background: green ? "#f0faf4" : "#fff",
      outline: "none",
      boxSizing: "border-box",
    }),
    rmBtn: {
      border: "none",
      background: "#fdf3f2",
      color: "#c0392b",
      borderRadius: 6,
      width: 28,
      height: 28,
      cursor: "pointer",
      fontWeight: 700,
      fontSize: 13,
    },
    addBtn: {
      background: "none",
      border: "1px dashed #c8c8e8",
      borderRadius: 8,
      padding: "8px 14px",
      color: "#7777bb",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      marginBottom: 18,
    },
    preview: { fontSize: 12, color: "#9999bb", marginBottom: 20 },
    divider: { height: 1, background: "#ebebf5", margin: "4px 0 18px" },
    submit: {
      width: "100%",
      padding: 14,
      background: "#1a1a2e",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 700,
      cursor: "pointer",
      letterSpacing: "0.04em",
    },
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Sinhala:wght@400;600&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
      <div style={s.wrap}>
        <div style={s.card}>
          <div style={s.header}>
            <p style={s.tag}>Admin Panel</p>
            <p style={s.title}>Jumbled Sentence — Add Set</p>
            <p style={s.sub}>
              Enter words in jumbled order, then provide the correct order for
              grading.
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
              <label style={s.label}>Difficulty Level</label>
              <select
                value={level}
                onChange={(e) => handleLevelChange(e.target.value)}
                style={s.select}
              >
                <option value="easy">Easy — 2–3 words</option>
                <option value="medium">Medium — 3–4 words</option>
                <option value="hard">Hard — 5 words</option>
              </select>

              {/* Jumbled words */}
              <label style={s.label}>
                Jumbled Words
                <span style={s.hint}>shown to student</span>
              </label>
              {jumbledWords.map((word, i) => (
                <div key={i} style={s.row}>
                  <span style={s.num}>{i + 1}</span>
                  <input
                    value={word}
                    required
                    placeholder={`Word ${i + 1} — Sinhala`}
                    style={s.input(false)}
                    onChange={(e) =>
                      updateWord(
                        setJumbledWords,
                        jumbledWords,
                        i,
                        e.target.value,
                      )
                    }
                  />
                  {jumbledWords.length > MIN_WORDS[level] && (
                    <button
                      type="button"
                      onClick={() => removeWord(i)}
                      style={s.rmBtn}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {jumbledWords.length < MAX_WORDS[level] && (
                <button type="button" onClick={addWord} style={s.addBtn}>
                  + Add word
                </button>
              )}

              <div style={s.divider} />

              {/* Correct order */}
              <label style={s.label}>
                Correct Order
                <span style={s.hint}>
                  for grading only — student won't see this
                </span>
              </label>
              {correctWords.map((word, i) => (
                <div key={i} style={s.row}>
                  <span style={s.num}>{i + 1}</span>
                  <input
                    value={word}
                    required
                    placeholder={`Correct word ${i + 1} — Sinhala`}
                    style={s.input(true)}
                    onChange={(e) =>
                      updateWord(
                        setCorrectWords,
                        correctWords,
                        i,
                        e.target.value,
                      )
                    }
                  />
                </div>
              ))}
              <p style={s.preview}>
                Preview:{" "}
                <strong style={{ color: "#1a1a2e" }}>
                  {correctWords.filter(Boolean).join(" ") || "—"}
                </strong>
              </p>

              <button type="submit" style={s.submit}>
                Save Jumbled Sentence
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminJumbledSentenceForm;
