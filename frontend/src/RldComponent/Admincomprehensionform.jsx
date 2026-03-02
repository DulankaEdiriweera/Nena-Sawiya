// src/RldComprehension/AdminComprehensionForm.jsx
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

        .acf-wrap {
          min-height: 100vh;
          background: #f4f4f8;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 40px 16px;
          font-family: 'DM Sans', sans-serif;
        }

        .acf-card {
          width: 100%;
          max-width: 680px;
          background: #ffffff;
          border: 1px solid #e2e2ee;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          overflow: hidden;
        }

        /* ── Page header ── */
        .acf-page-header {
          padding: 28px 32px 24px;
          border-bottom: 1px solid #ebebf5;
        }

        .acf-page-tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #9999bb;
          margin-bottom: 4px;
        }

        .acf-page-title {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 2px;
        }

        .acf-page-sub {
          font-size: 13px;
          color: #9999bb;
          font-weight: 400;
        }

        /* ── Form body ── */
        .acf-body {
          padding: 28px 32px 32px;
        }

        /* ── Alert ── */
        .acf-alert {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 24px;
          border: 1px solid;
        }

        .acf-alert.error {
          background: #fdf3f2;
          border-color: #e8b4b0;
          color: #c0392b;
        }

        .acf-alert.success {
          background: #f0faf4;
          border-color: #a8dbbe;
          color: #1a7a4a;
        }

        .acf-alert-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-top: 4px;
          flex-shrink: 0;
        }

        .acf-alert.error .acf-alert-dot { background: #c0392b; }
        .acf-alert.success .acf-alert-dot { background: #27ae60; }

        /* ── Field ── */
        .acf-field {
          margin-bottom: 20px;
        }

        .acf-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6666aa;
          margin-bottom: 6px;
        }

        .acf-hint {
          font-size: 11px;
          font-weight: 400;
          color: #aaaacc;
          text-transform: none;
          letter-spacing: 0;
          margin-left: 6px;
        }

        .acf-select,
        .acf-textarea,
        .acf-input {
          width: 100%;
          border: 1px solid #e2e2ee;
          border-radius: 8px;
          padding: 10px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1a1a2e;
          background: #fff;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
          outline: none;
        }

        .acf-select:focus,
        .acf-textarea:focus,
        .acf-input:focus {
          border-color: #8888cc;
          box-shadow: 0 0 0 3px rgba(100,100,200,0.08);
        }

        /* Sinhala fields use serif font */
        .acf-sinhala {
          font-family: 'Noto Serif Sinhala', serif;
          font-size: 14px;
          line-height: 1.9;
        }

        .acf-textarea {
          resize: vertical;
          min-height: 110px;
        }

        /* ── Section divider ── */
        .acf-section-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 28px 0 20px;
        }

        .acf-section-divider-line {
          flex: 1;
          height: 1px;
          background: #ebebf5;
        }

        .acf-section-divider-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #aaaacc;
          white-space: nowrap;
        }

        /* ── Question block ── */
        .acf-question-block {
          border: 1px solid #e2e2ee;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 14px;
        }

        .acf-question-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 16px;
          background: #f7f7fb;
          border-bottom: 1px solid #e2e2ee;
        }

        .acf-question-num {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #6666aa;
        }

        .acf-remove-btn {
          font-size: 12px;
          font-weight: 600;
          color: #c0392b;
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px 8px;
          border-radius: 4px;
          transition: background 0.15s;
        }

        .acf-remove-btn:hover { background: #fdf3f2; }

        .acf-question-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* ── Option row ── */
        .acf-option-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .acf-option-toggle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid #e2e2ee;
          background: #fff;
          font-size: 11px;
          font-weight: 700;
          color: #aaaacc;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }

        .acf-option-toggle.correct {
          background: #1a7a4a;
          border-color: #1a7a4a;
          color: #fff;
        }

        .acf-option-toggle:hover:not(.correct) {
          border-color: #8888cc;
          color: #6666aa;
        }

        .acf-option-input {
          flex: 1;
          border: 1px solid #e2e2ee;
          border-radius: 6px;
          padding: 8px 12px;
          font-family: 'Noto Serif Sinhala', serif;
          font-size: 13px;
          color: #1a1a2e;
          background: #fff;
          outline: none;
          transition: border-color 0.15s;
          box-sizing: border-box;
        }

        .acf-option-input:focus { border-color: #8888cc; }
        .acf-option-input.correct-opt { border-color: #a8dbbe; background: #f0faf4; }

        /* ── Validation hint ── */
        .acf-validation-hint {
          font-size: 12px;
          color: #d68910;
          font-weight: 500;
          padding: 0 2px;
        }

        /* ── Add question ── */
        .acf-add-btn {
          width: 100%;
          padding: 11px;
          border: 1px dashed #c8c8e8;
          border-radius: 8px;
          background: none;
          color: #7777bb;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          margin-bottom: 6px;
        }

        .acf-add-btn:hover { background: #f4f4ff; border-color: #9999cc; }

        .acf-max-note {
          font-size: 12px;
          color: #aaaacc;
          text-align: center;
          padding: 4px 0 8px;
        }

        /* ── Submit ── */
        .acf-submit-btn {
          width: 100%;
          padding: 14px;
          background: #1a1a2e;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          margin-top: 24px;
          transition: background 0.2s, transform 0.15s;
        }

        .acf-submit-btn:hover:not(:disabled) {
          background: #2d2d50;
          transform: translateY(-1px);
        }

        .acf-submit-btn:disabled {
          background: #aaaacc;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .acf-page-header, .acf-body { padding-left: 20px; padding-right: 20px; }
        }
      `}</style>

      <div className="acf-wrap">
        <div className="acf-card">
          {/* Page header */}
          <div className="acf-page-header">
            <p className="acf-page-tag">Admin Panel</p>
            <p className="acf-page-title">
              Reading Comprehension — Add Passage
            </p>
            <p className="acf-page-sub">
              Students will read the passage and select answers to the questions
              below.
            </p>
          </div>

          <div className="acf-body">
            {/* Alert */}
            {message && (
              <div className={`acf-alert ${isError ? "error" : "success"}`}>
                <div className="acf-alert-dot" />
                {message}
              </div>
            )}

            <form key={formKey} onSubmit={handleSubmit}>
              {/* Difficulty level */}
              <div className="acf-field">
                <label className="acf-label">Difficulty Level</label>
                <select
                  value={level}
                  onChange={(e) => handleLevelChange(e.target.value)}
                  className="acf-select"
                >
                  {Object.entries(LEVEL_CONFIG).map(([lvl, cfg]) => (
                    <option key={lvl} value={lvl}>
                      {cfg.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Passage */}
              <div className="acf-field">
                <label className="acf-label">
                  Passage
                  <span className="acf-hint">Enter in Sinhala</span>
                </label>
                <textarea
                  value={passage}
                  onChange={(e) => setPassage(e.target.value)}
                  placeholder="කෙටි කතාව හෝ passage ඇතුළු කරන්න..."
                  rows={5}
                  required
                  className={`acf-textarea acf-sinhala`}
                />
              </div>

              {/* Questions divider */}
              <div className="acf-section-divider">
                <div className="acf-section-divider-line" />
                <span className="acf-section-divider-label">
                  Questions — {questions.length} / {config.maxQ}
                </span>
                <div className="acf-section-divider-line" />
              </div>

              {/* Question blocks */}
              {questions.map((q, qIdx) => (
                <div key={qIdx} className="acf-question-block">
                  <div className="acf-question-header">
                    <span className="acf-question-num">
                      Question {qIdx + 1}
                    </span>
                    {questions.length > config.minQ && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIdx)}
                        className="acf-remove-btn"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="acf-question-body">
                    {/* Question text — Sinhala */}
                    <div>
                      <label className="acf-label" style={{ marginBottom: 4 }}>
                        Question Text
                        <span className="acf-hint">Sinhala</span>
                      </label>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) =>
                          updateQuestion(qIdx, "question", e.target.value)
                        }
                        placeholder="ප්‍රශ්නය ඇතුළු කරන්න..."
                        required
                        className="acf-input acf-sinhala"
                      />
                    </div>

                    {/* Options */}
                    <div>
                      <label className="acf-label" style={{ marginBottom: 6 }}>
                        Answer Options
                        <span className="acf-hint">
                          Click the circle to mark the correct answer
                        </span>
                      </label>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="acf-option-row">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuestion(qIdx, "correct_index", optIdx)
                              }
                              className={`acf-option-toggle ${q.correct_index === optIdx ? "correct" : ""}`}
                              title="Mark as correct"
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
                              className={`acf-option-input ${q.correct_index === optIdx ? "correct-opt" : ""}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Validation hint */}
                    {q.correct_index === null && (
                      <p className="acf-validation-hint">
                        Mark the correct answer by clicking the option circle.
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Add question */}
              {questions.length < config.maxQ ? (
                <button
                  type="button"
                  onClick={addQuestion}
                  className="acf-add-btn"
                >
                  + Add Question (max {config.maxQ})
                </button>
              ) : (
                <p className="acf-max-note">
                  Maximum {config.maxQ} questions reached for {level} level.
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="acf-submit-btn"
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
