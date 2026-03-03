import React, { useState } from "react";
import axios from "axios";

const LEVEL_CONFIG = {
  easy: { minQ: 1, maxQ: 2, label: "Easy — 1–2 Questions" },
  medium: { minQ: 2, maxQ: 3, label: "Medium — 2–3 Questions" },
  hard: { minQ: 3, maxQ: 4, label: "Hard — 3–4 Questions" },
};

const emptyQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  correct_index: null,
});

const OPTION_LABELS = ["A", "B", "C", "D"];

const AdminComprehensionForm = () => {
  const [level, setLevel] = useState("easy");
  const [passage, setPassage] = useState("");
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const config = LEVEL_CONFIG[level];

  const handleLevelChange = (val) => {
    setLevel(val);
    setQuestions(Array(LEVEL_CONFIG[val].minQ).fill(null).map(emptyQuestion));
  };

  const updateQuestion = (qIdx, field, value) =>
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIdx ? { ...q, [field]: value } : q)),
    );

  const updateOption = (qIdx, optIdx, value) =>
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        const options = [...q.options];
        options[optIdx] = value;
        return { ...q, options };
      }),
    );

  const addQuestion = () => {
    if (questions.length >= config.maxQ) return;
    setQuestions([...questions, emptyQuestion()]);
  };

  const removeQuestion = (qIdx) => {
    if (questions.length <= config.minQ) return;
    setQuestions(questions.filter((_, i) => i !== qIdx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passage.trim()) {
      setMessage("Please enter a passage.");
      setIsError(true);
      return;
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setMessage(`Question ${i + 1} is empty.`);
        setIsError(true);
        return;
      }
      if (q.options.some((o) => !o.trim())) {
        setMessage(`Please fill all 4 options for Question ${i + 1}.`);
        setIsError(true);
        return;
      }
      if (q.correct_index === null) {
        setMessage(`Please mark the correct answer for Question ${i + 1}.`);
        setIsError(true);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/rld_comprehension/add_passage",
        { level, passage: passage.trim(), questions },
      );
      setMessage(res.data.message || "Passage saved successfully.");
      setIsError(false);
      setPassage("");
      setQuestions(Array(config.minQ).fill(null).map(emptyQuestion));
      setFormKey((k) => k + 1);
    } catch (err) {
      setMessage(
        err.response?.data?.error || "An error occurred. Please try again.",
      );
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Sinhala:wght@400;500;600&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .dm-sans { font-family: 'DM Sans', sans-serif; }
        .sinhala { font-family: 'Noto Serif Sinhala', serif; }
        .focus-ring:focus { border-color: #8888cc; box-shadow: 0 0 0 3px rgba(100,100,200,0.08); }
        .opt-correct-input { border-color: #a8dbbe !important; background: #f0faf4 !important; }
      `}</style>

      <div className="dm-sans min-h-screen bg-slate-100 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
          {/* Page Header */}
          <div className="px-8 py-7 border-b border-slate-100">
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-1">
              Admin Panel
            </p>
            <p className="text-xl font-bold text-slate-900 mb-0.5">
              Reading Comprehension — Add Passage
            </p>
            <p className="text-sm text-slate-400 font-normal">
              Students will read the passage and select answers to the questions
              below.
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-7 pb-8">
            {/* Alert */}
            {message && (
              <div
                className={`flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm font-medium mb-6 border ${
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
                  className="focus-ring dm-sans w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 bg-white outline-none"
                >
                  {Object.entries(LEVEL_CONFIG).map(([lvl, cfg]) => (
                    <option key={lvl} value={lvl}>
                      {cfg.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Passage */}
              <div className="mb-5">
                <label className="block text-xs font-bold tracking-widest uppercase text-indigo-400 mb-1.5">
                  Passage
                  <span className="text-xs font-normal text-slate-400 normal-case tracking-normal ml-1.5">
                    Enter in Sinhala
                  </span>
                </label>
                <textarea
                  value={passage}
                  onChange={(e) => setPassage(e.target.value)}
                  placeholder="කෙටි කතාව හෝ passage ඇතුළු කරන්න..."
                  rows={5}
                  required
                  className="focus-ring sinhala w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 bg-white outline-none resize-y min-h-28 leading-loose"
                />
              </div>

              {/* Section Divider */}
              <div className="flex items-center gap-3 my-7">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-xs font-bold tracking-widest uppercase text-slate-400 whitespace-nowrap">
                  Questions — {questions.length} / {config.maxQ}
                </span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {/* Question Blocks */}
              {questions.map((q, qIdx) => (
                <div
                  key={qIdx}
                  className="border border-slate-200 rounded-xl overflow-hidden mb-3.5"
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                    <span className="text-xs font-bold tracking-widest uppercase text-indigo-400">
                      Question {qIdx + 1}
                    </span>
                    {questions.length > config.minQ && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIdx)}
                        className="text-xs font-semibold text-red-600 bg-transparent border-none cursor-pointer px-2 py-0.5 rounded hover:bg-red-50 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Question Body */}
                  <div className="p-4 flex flex-col gap-3">
                    {/* Question Text */}
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-indigo-400 mb-1">
                        Question Text
                        <span className="text-xs font-normal text-slate-400 normal-case tracking-normal ml-1.5">
                          Sinhala
                        </span>
                      </label>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) =>
                          updateQuestion(qIdx, "question", e.target.value)
                        }
                        placeholder="ප්‍රශ්නය ඇතුළු කරන්න..."
                        required
                        className="focus-ring sinhala w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 bg-white outline-none"
                      />
                    </div>

                    {/* Options */}
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-indigo-400 mb-1.5">
                        Answer Options
                        <span className="text-xs font-normal text-slate-400 normal-case tracking-normal ml-1.5">
                          Click the circle to mark the correct answer
                        </span>
                      </label>
                      <div className="flex flex-col gap-2">
                        {q.options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className="flex items-center gap-2.5"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                updateQuestion(qIdx, "correct_index", optIdx)
                              }
                              title="Mark as correct"
                              className={`w-7 h-7 rounded-full border text-xs font-bold flex items-center justify-center flex-shrink-0 transition-all ${
                                q.correct_index === optIdx
                                  ? "bg-green-700 border-green-700 text-white"
                                  : "bg-white border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-400"
                              }`}
                            >
                              {q.correct_index === optIdx
                                ? "✓"
                                : OPTION_LABELS[optIdx]}
                            </button>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) =>
                                updateOption(qIdx, optIdx, e.target.value)
                              }
                              placeholder={`Option ${OPTION_LABELS[optIdx]} — Sinhala`}
                              required
                              className={`sinhala flex-1 border rounded-md px-3 py-2 text-sm text-slate-900 bg-white outline-none transition-colors focus-ring ${
                                q.correct_index === optIdx
                                  ? "opt-correct-input"
                                  : "border-slate-200"
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Validation hint */}
                    {q.correct_index === null && (
                      <p className="text-xs text-yellow-600 font-medium px-0.5">
                        Mark the correct answer by clicking the option circle.
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Question / Max Note */}
              {questions.length < config.maxQ ? (
                <button
                  type="button"
                  onClick={addQuestion}
                  className="dm-sans w-full py-3 border border-dashed border-indigo-200 rounded-lg bg-transparent text-indigo-400 text-sm font-semibold cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-colors mb-1.5"
                >
                  + Add Question (max {config.maxQ})
                </button>
              ) : (
                <p className="text-xs text-slate-400 text-center py-2 pb-3">
                  Maximum {config.maxQ} questions reached for {level} level.
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`dm-sans w-full py-3.5 rounded-lg text-sm font-bold tracking-wide text-white border-none mt-6 transition-all ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-slate-900 cursor-pointer hover:bg-slate-700 hover:-translate-y-px"
                }`}
              >
                {loading ? "Saving…" : "Save Passage"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminComprehensionForm;
