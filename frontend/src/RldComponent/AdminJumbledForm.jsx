import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MIN_WORDS = { easy: 2, medium: 3, hard: 5 };
const MAX_WORDS = { easy: 3, medium: 4, hard: 5 };

const AdminJumbledSentenceForm = () => {
  const navigate = useNavigate();
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
      navigate("/rld-admin-dashboard", {
        state: { activeCat: "Jumbled Sentences" },
      });
    } catch (err) {
      setMessage(err.response?.data?.error || "Error saving sentence.");
      setIsError(true);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Sinhala:wght@400;600&family=DM+Sans:wght@400;500;600;700&display=swap');
        .dm-sans { font-family: 'DM Sans', sans-serif; }
        .sinhala { font-family: 'Noto Serif Sinhala', serif; }
        .focus-ring:focus { border-color: #8888cc; box-shadow: 0 0 0 3px rgba(100,100,200,0.08); }
      `}</style>

      <div className="dm-sans min-h-screen bg-slate-100 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-7 py-6 border-b border-slate-100">
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-1">
              Admin Panel
            </p>
            <p className="text-xl font-bold text-slate-900 mb-0.5">
              Jumbled Sentence — Add Set
            </p>
            <p className="text-sm text-slate-400">
              Enter words in jumbled order, then provide the correct order for
              grading.
            </p>
          </div>

          {/* Body */}
          <div className="px-7 py-6 pb-7">
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
              <div className="mb-5">
                <label className="block text-xs font-bold tracking-widest uppercase text-indigo-400 mb-1.5">
                  Difficulty Level
                </label>
                <select
                  value={level}
                  onChange={(e) => handleLevelChange(e.target.value)}
                  className="focus-ring dm-sans w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 outline-none"
                >
                  <option value="easy">Easy — 2–3 words</option>
                  <option value="medium">Medium — 3–4 words</option>
                  <option value="hard">Hard — 5 words</option>
                </select>
              </div>

              {/* Jumbled Words */}
              <div className="mb-4">
                <label className="block text-xs font-bold tracking-widest uppercase text-indigo-400 mb-1.5">
                  Jumbled Words
                  <span className="text-xs font-normal text-slate-400 normal-case tracking-normal ml-1.5">
                    shown to student
                  </span>
                </label>
                {jumbledWords.map((word, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-400 w-4 flex-shrink-0">
                      {i + 1}
                    </span>
                    <input
                      value={word}
                      required
                      placeholder={`Word ${i + 1} — Sinhala`}
                      onChange={(e) =>
                        updateWord(
                          setJumbledWords,
                          jumbledWords,
                          i,
                          e.target.value,
                        )
                      }
                      className="focus-ring sinhala flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white outline-none"
                    />
                    {jumbledWords.length > MIN_WORDS[level] && (
                      <button
                        type="button"
                        onClick={() => removeWord(i)}
                        className="w-7 h-7 rounded-md bg-red-50 text-red-600 font-bold text-xs border-none cursor-pointer hover:bg-red-100 transition-colors flex items-center justify-center"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                {jumbledWords.length < MAX_WORDS[level] && (
                  <button
                    type="button"
                    onClick={addWord}
                    className="dm-sans mt-1 bg-transparent border border-dashed border-indigo-200 rounded-lg px-3.5 py-2 text-indigo-400 text-sm font-semibold cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                  >
                    + Add word
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-100 my-5" />

              {/* Correct Order */}
              <div className="mb-4">
                <label className="block text-xs font-bold tracking-widest uppercase text-indigo-400 mb-1.5">
                  Correct Order
                  <span className="text-xs font-normal text-slate-400 normal-case tracking-normal ml-1.5">
                    for grading only — student won't see this
                  </span>
                </label>
                {correctWords.map((word, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-400 w-4 flex-shrink-0">
                      {i + 1}
                    </span>
                    <input
                      value={word}
                      required
                      placeholder={`Correct word ${i + 1} — Sinhala`}
                      onChange={(e) =>
                        updateWord(
                          setCorrectWords,
                          correctWords,
                          i,
                          e.target.value,
                        )
                      }
                      className="focus-ring sinhala flex-1 border border-green-200 rounded-lg px-3 py-2 text-sm text-slate-900 bg-green-50 outline-none"
                    />
                  </div>
                ))}
              </div>

              {/* Preview */}
              <p className="text-xs text-slate-400 mb-5">
                Preview:{" "}
                <strong className="text-slate-900 font-semibold">
                  {correctWords.filter(Boolean).join(" ") || "—"}
                </strong>
              </p>

              {/* Submit */}
              <button
                type="submit"
                className="dm-sans w-full py-3.5 bg-slate-900 text-white rounded-lg text-sm font-bold tracking-wide border-none cursor-pointer hover:bg-slate-700 hover:-translate-y-px transition-all"
              >
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
