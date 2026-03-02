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
      color: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
      badge: "bg-red-500",
      progressColor: "bg-red-500",
      dotColor: "bg-red-500",
      statColor: "text-red-500",
      sectionBorder: "border-red-200",
      sectionHeaderBg: "bg-red-50",
    },
    Average: {
      color: "text-yellow-700",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      badge: "bg-yellow-500",
      progressColor: "bg-yellow-500",
      dotColor: "bg-yellow-500",
      statColor: "text-yellow-500",
      sectionBorder: "border-yellow-200",
      sectionHeaderBg: "bg-yellow-50",
    },
    Normal: {
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-200",
      badge: "bg-green-500",
      progressColor: "bg-green-500",
      dotColor: "bg-green-500",
      statColor: "text-green-500",
      sectionBorder: "border-green-200",
      sectionHeaderBg: "bg-green-50",
    },
  };

  const config = levelConfig[result.RLD_level] || levelConfig["Normal"];

  const answeredCount = Object.values(result.answers || {}).filter(
    (ans) => ans !== "",
  ).length;
  const totalCount = Object.keys(result.answers || {}).length;
  const pct = result.Percentage ?? 0;

  const feedbackParts = (result.Feedback || "").split("දෙමාව්පියන්ට උපදෙස්:");
  const mainFeedback = feedbackParts[0].trim();
  const parentAdvice = feedbackParts[1] ? feedbackParts[1].trim() : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Sinhala:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .sinhala { font-family: 'Noto Serif Sinhala', serif; }
        .dm-sans { font-family: 'DM Sans', sans-serif; }
        .answer-scroll::-webkit-scrollbar { width: 4px; }
        .answer-scroll::-webkit-scrollbar-track { background: #f0f0f8; border-radius: 2px; }
        .answer-scroll::-webkit-scrollbar-thumb { background: #ccccdd; border-radius: 2px; }
      `}</style>

      <div className="dm-sans text-slate-900 max-h-full overflow-y-auto px-0.5 pb-6">
        {/* Header */}
        <div className="text-center py-8 border-b border-slate-200 mb-7">
          <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1.5">
            Assessment Report
          </p>
          <p className="sinhala text-2xl font-semibold text-slate-900">
            ප්‍රතිග්‍රාහක භාෂා තක්සේරු ප්‍රතිඵල
          </p>
        </div>

        {/* Score Band */}
        <div className="grid grid-cols-2 gap-4 items-center mb-7">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
            <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">
              Overall Score
            </p>
            <p className="text-5xl font-bold leading-none text-slate-900">
              {pct}
              <span className="text-lg font-normal text-slate-400">%</span>
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
            <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">
              Level / මට්ටම
            </p>
            <span
              className={`sinhala inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-white mt-1 ${config.badge}`}
            >
              {sinhalaLevelMap[result.RLD_level] || result.RLD_level}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-7">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${config.progressColor}`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-slate-400 font-medium">0%</span>
            <span className={`text-xs font-semibold ${config.color}`}>
              {pct}%
            </span>
            <span className="text-xs text-slate-400 font-medium">100%</span>
          </div>
        </div>

        {/* Feedback Section */}
        {result.Feedback && (
          <div
            className={`border rounded-xl overflow-hidden mb-4 ${config.sectionBorder}`}
          >
            <div
              className={`flex items-center gap-2.5 px-4 py-3.5 border-b ${config.sectionHeaderBg} ${config.sectionBorder}`}
            >
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${config.dotColor}`}
              />
              <span className="text-xs font-bold tracking-widest uppercase text-indigo-400">
                තක්සේරු ප්‍රතිපෝෂණය
              </span>
            </div>
            <div className="p-4 bg-white">
              <p className="sinhala text-sm leading-loose text-slate-700">
                {mainFeedback}
              </p>
              {parentAdvice && (
                <div className="bg-slate-50 border border-slate-200 border-l-4 border-l-indigo-400 rounded-r-lg p-3.5 mt-3">
                  <p className="dm-sans text-xs font-bold tracking-widest uppercase text-indigo-400 mb-1.5">
                    දෙමාව්පියන්ට උපදෙස්
                  </p>
                  <p className="sinhala text-sm leading-relaxed text-slate-600">
                    {parentAdvice}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <p
              className={`text-4xl font-bold leading-none ${config.statColor}`}
            >
              {answeredCount}
            </p>
            <p className="sinhala text-xs font-semibold tracking-wider uppercase text-slate-400 mt-1.5">
              පිළිතුරු දුන්නා
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-4xl font-bold leading-none text-slate-900">
              {totalCount}
            </p>
            <p className="sinhala text-xs font-semibold tracking-wider uppercase text-slate-400 mt-1.5">
              මුළු ප්‍රශ්න
            </p>
          </div>
        </div>

        {/* Answers */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-3.5 bg-slate-50 border-b border-slate-200">
            <div className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0" />
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-400">
              ඔබගේ පිළිතුරු
            </span>
          </div>
          <div className="p-4 bg-white">
            <div className="answer-scroll max-h-72 overflow-y-auto flex flex-col gap-2.5 pr-1">
              {Object.entries(result.answers || {})
                .filter(([, ans]) => ans !== "")
                .map(([q, ans], index) => (
                  <div
                    key={q}
                    className="flex gap-3 items-start p-3 bg-slate-50 border border-slate-100 rounded-lg"
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-indigo-500 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-0.5">
                        {q}
                      </p>
                      <p className="sinhala text-sm text-slate-700 leading-relaxed">
                        {ans}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-slate-200 mt-7">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-9 py-3 bg-slate-900 text-white rounded-lg dm-sans text-sm font-semibold tracking-wide cursor-pointer transition-all duration-200 hover:bg-slate-700 hover:-translate-y-0.5 border-none"
          >
            <svg
              className="w-4 h-4 opacity-70"
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
