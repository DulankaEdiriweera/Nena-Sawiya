import React from "react";

const ResultModal = ({ result, onClose }) => {
  if (!result) return null;

  const sinhalaLevelMap = {
    Weak: "දුර්වල",
    Average: "සාමාන්‍ය",
    Normal: "විශිෂ්ඨ",
  };

  const levelConfig = {
    Weak: {
      color: "#c0392b",
      bg: "#fdf3f2",
      border: "#e8b4b0",
      badge: "#e74c3c",
      label: "දුර්වල",
    },
    Average: {
      color: "#d68910",
      bg: "#fefaf0",
      border: "#f0d080",
      badge: "#f39c12",
      label: "සාමාන්‍ය",
    },
    Normal: {
      color: "#1a7a4a",
      bg: "#f0faf4",
      border: "#a8dbbe",
      badge: "#27ae60",
      label: "විශිෂ්ඨ",
    },
  };

  const config = levelConfig[result.RLD_level] || levelConfig["Normal"];

  const answeredCount = Object.values(result.answers || {}).filter(
    (ans) => ans !== "",
  ).length;
  const totalCount = Object.keys(result.answers || {}).length;
  const pct = result.Percentage ?? 0;

  // Split feedback into main feedback and parent advice if separator exists
  const feedbackParts = (result.Feedback || "").split("දෙමාව්පියන්ට උපදෙස්:");
  const mainFeedback = feedbackParts[0].trim();
  const parentAdvice = feedbackParts[1] ? feedbackParts[1].trim() : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Sinhala:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .rm-root {
          font-family: 'DM Sans', sans-serif;
          color: #1a1a2e;
          max-height: 100%;
          overflow-y: auto;
          padding: 0 2px 24px;
        }

        .rm-sinhala {
          font-family: 'Noto Serif Sinhala', serif;
        }

        /* Header */
        .rm-header {
          text-align: center;
          padding: 32px 0 24px;
          border-bottom: 1px solid #e8e8f0;
          margin-bottom: 28px;
        }

        .rm-title {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #8888aa;
          margin-bottom: 6px;
        }

        .rm-subtitle {
          font-size: 26px;
          font-weight: 600;
          color: #1a1a2e;
          font-family: 'Noto Serif Sinhala', serif;
        }

        /* Score band */
        .rm-score-band {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 16px;
          align-items: center;
          margin-bottom: 28px;
        }

        .rm-score-card {
          background: #f7f7fb;
          border: 1px solid #e2e2ee;
          border-radius: 12px;
          padding: 20px 16px;
          text-align: center;
        }

        .rm-score-card-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #9999bb;
          margin-bottom: 8px;
        }

        .rm-score-value {
          font-size: 42px;
          font-weight: 700;
          line-height: 1;
          color: #1a1a2e;
        }

        .rm-score-unit {
          font-size: 18px;
          font-weight: 400;
          color: #9999bb;
        }

        .rm-divider-v {
          width: 1px;
          height: 60px;
          background: #e2e2ee;
          margin: 0 auto;
        }

        .rm-level-pill {
          display: inline-block;
          padding: 6px 18px;
          border-radius: 20px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Noto Serif Sinhala', serif;
          margin-top: 8px;
          color: #fff;
        }

        /* Progress bar */
        .rm-progress-wrap {
          margin-bottom: 28px;
        }

        .rm-progress-track {
          height: 8px;
          background: #e8e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .rm-progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 1s ease;
        }

        .rm-progress-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 6px;
        }

        .rm-progress-label {
          font-size: 11px;
          color: #aaaacc;
          font-weight: 500;
        }

        /* Section cards */
        .rm-section {
          border: 1px solid #e2e2ee;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .rm-section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          background: #f7f7fb;
          border-bottom: 1px solid #e2e2ee;
        }

        .rm-section-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .rm-section-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #6666aa;
        }

        .rm-section-body {
          padding: 18px;
          background: #fff;
        }

        .rm-feedback-text {
          font-family: 'Noto Serif Sinhala', serif;
          font-size: 15px;
          line-height: 1.9;
          color: #2a2a4a;
        }

        /* Parent advice */
        .rm-parent-box {
          background: #f7f7fb;
          border: 1px solid #e2e2ee;
          border-left: 3px solid #6666aa;
          border-radius: 0 8px 8px 0;
          padding: 14px 16px;
          margin-top: 12px;
        }

        .rm-parent-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6666aa;
          margin-bottom: 6px;
          font-family: 'DM Sans', sans-serif;
        }

        .rm-parent-text {
          font-family: 'Noto Serif Sinhala', serif;
          font-size: 14px;
          line-height: 1.85;
          color: #3a3a5a;
        }

        /* Stat row */
        .rm-stat-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        .rm-stat-item {
          background: #f7f7fb;
          border: 1px solid #e2e2ee;
          border-radius: 10px;
          padding: 16px;
          text-align: center;
        }

        .rm-stat-num {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a2e;
          line-height: 1;
        }

        .rm-stat-lbl {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9999bb;
          margin-top: 6px;
          font-family: 'Noto Serif Sinhala', serif;
        }

        /* Answer list */
        .rm-answer-list {
          max-height: 280px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-right: 4px;
        }

        .rm-answer-list::-webkit-scrollbar { width: 4px; }
        .rm-answer-list::-webkit-scrollbar-track { background: #f0f0f8; border-radius: 2px; }
        .rm-answer-list::-webkit-scrollbar-thumb { background: #ccccdd; border-radius: 2px; }

        .rm-answer-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 12px 14px;
          background: #fafafa;
          border: 1px solid #ebebf5;
          border-radius: 8px;
        }

        .rm-answer-index {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ebebf5;
          color: #6666aa;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .rm-answer-q {
          font-size: 11px;
          font-weight: 600;
          color: #9999bb;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 3px;
        }

        .rm-answer-a {
          font-family: 'Noto Serif Sinhala', serif;
          font-size: 14px;
          color: #2a2a4a;
          line-height: 1.6;
        }

        /* Footer button */
        .rm-footer {
          text-align: center;
          padding-top: 24px;
          border-top: 1px solid #e8e8f0;
          margin-top: 28px;
        }

        .rm-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 36px;
          background: #1a1a2e;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }

        .rm-btn:hover {
          background: #2d2d50;
          transform: translateY(-1px);
        }

        .rm-btn-icon {
          width: 16px;
          height: 16px;
          opacity: 0.7;
        }

        @media (max-width: 480px) {
          .rm-score-band { grid-template-columns: 1fr 1fr; }
          .rm-divider-v { display: none; }
          .rm-score-value { font-size: 32px; }
        }
      `}</style>

      <div className="rm-root">
        {/* Header */}
        <div className="rm-header">
          <p className="rm-title">Assessment Report</p>
          <p className="rm-subtitle">ප්‍රතිග්‍රාහක භාෂා තක්සේරු ප්‍රතිඵල</p>
        </div>

        {/* Score band */}
        <div className="rm-score-band">
          <div className="rm-score-card">
            <p className="rm-score-card-label">Overall Score</p>
            <p className="rm-score-value">
              {pct}
              <span className="rm-score-unit">%</span>
            </p>
          </div>
          <div className="rm-divider-v" />
          <div className="rm-score-card">
            <p className="rm-score-card-label">Level / මට්ටම</p>
            <div
              className="rm-level-pill"
              style={{ backgroundColor: config.badge }}
            >
              {sinhalaLevelMap[result.RLD_level] || result.RLD_level}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="rm-progress-wrap">
          <div className="rm-progress-track">
            <div
              className="rm-progress-fill"
              style={{
                width: `${Math.min(pct, 100)}%`,
                backgroundColor: config.badge,
              }}
            />
          </div>
          <div className="rm-progress-labels">
            <span className="rm-progress-label">0%</span>
            <span
              className="rm-progress-label"
              style={{ color: config.color, fontWeight: 600 }}
            >
              {pct}%
            </span>
            <span className="rm-progress-label">100%</span>
          </div>
        </div>

        {/* Feedback section */}
        {result.Feedback && (
          <div className="rm-section" style={{ borderColor: config.border }}>
            <div
              className="rm-section-header"
              style={{ background: config.bg, borderColor: config.border }}
            >
              <div
                className="rm-section-dot"
                style={{ background: config.badge }}
              />
              <span className="rm-section-title">තක්සේරු ප්‍රතිපෝෂණය</span>
            </div>
            <div className="rm-section-body">
              <p className="rm-feedback-text">{mainFeedback}</p>
              {parentAdvice && (
                <div className="rm-parent-box">
                  <p className="rm-parent-label">දෙමාව්පියන්ට උපදෙස්</p>
                  <p className="rm-parent-text">{parentAdvice}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="rm-stat-row">
          <div className="rm-stat-item">
            <p className="rm-stat-num" style={{ color: config.badge }}>
              {answeredCount}
            </p>
            <p className="rm-stat-lbl">පිළිතුරු දුන්නා</p>
          </div>
          <div className="rm-stat-item">
            <p className="rm-stat-num">{totalCount}</p>
            <p className="rm-stat-lbl">මුළු ප්‍රශ්න</p>
          </div>
        </div>

        {/* Answers */}
        <div className="rm-section">
          <div className="rm-section-header">
            <div className="rm-section-dot" style={{ background: "#9999bb" }} />
            <span className="rm-section-title">ඔබගේ පිළිතුරු</span>
          </div>
          <div className="rm-section-body">
            <div className="rm-answer-list">
              {Object.entries(result.answers || {})
                .filter(([, ans]) => ans !== "")
                .map(([q, ans], index) => (
                  <div key={q} className="rm-answer-item">
                    <div className="rm-answer-index">{index + 1}</div>
                    <div>
                      <p className="rm-answer-q">{q}</p>
                      <p className="rm-answer-a">{ans}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="rm-footer">
          <button className="rm-btn" onClick={onClose}>
            <svg
              className="rm-btn-icon"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M2 8h12M8 2l6 6-6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            නැවත ආරම්භ කරන්න
          </button>
        </div>
      </div>
    </>
  );
};

export default ResultModal;
