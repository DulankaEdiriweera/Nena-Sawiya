// SAVE THIS FILE TO:
// frontend/src/hooks/useInterventionLevel.js

import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const levelLabels = { easy: "පහසු", medium: "මධ්‍යම", hard: "අපහසු" };

export function useInterventionLevel() {
  const location = useLocation();
  const allowedLevels = location.state?.allowedLevels || [
    "easy",
    "medium",
    "hard",
  ];
  const startLevel = location.state?.startLevel || "easy";

  const [confirmDialog, setConfirmDialog] = useState(null);

  const handleLevelClick = (lvl, fetchFn) => {
    if (allowedLevels.includes(lvl)) {
      fetchFn(lvl);
    } else {
      setConfirmDialog({ targetLevel: lvl, fetchFn });
    }
  };

  const ConfirmDialog = () => {
    if (!confirmDialog) return null;
    const { targetLevel, fetchFn } = confirmDialog;
    const preferredLabel = allowedLevels.map((l) => levelLabels[l]).join(", ");

    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Sinhala:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap');
          .dlg-sinhala { font-family: 'Noto Serif Sinhala', serif; }
          .dlg-sans    { font-family: 'DM Sans', sans-serif; }
          @keyframes dlgIn {
            from { opacity:0; transform:scale(0.92) translateY(10px); }
            to   { opacity:1; transform:scale(1)    translateY(0);    }
          }
          .dlg-enter { animation: dlgIn 0.2s ease forwards; }
        `}</style>

        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setConfirmDialog(null)}
        >
          <div
            className="dlg-enter dlg-sans bg-white rounded-3xl shadow-2xl max-w-sm w-full p-7 text-center border border-indigo-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-amber-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>

            <p className="dlg-sans text-xs font-bold tracking-widest uppercase text-amber-500 mb-2">
              නිර්දේශ නොවේ
            </p>

            <p className="dlg-sinhala text-base font-semibold text-slate-800 leading-snug mb-2">
              <span className="text-indigo-600 font-bold">
                {levelLabels[targetLevel]}
              </span>{" "}
              මට්ටම ඔබගේ ආබාධ මට්ටමට නිර්දේශිත නොවේ.
            </p>

            <p className="dlg-sinhala text-sm text-slate-500 leading-relaxed mb-6">
              ඔබ සඳහා නිර්දේශිත මට්ටම:{" "}
              <span className="font-bold text-indigo-600">
                {preferredLabel}
              </span>
              . වැඩි පුහුණුවක් අවශ්‍ය නම් ඉදිරියට යා හැකිය.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDialog(null)}
                className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 dlg-sans text-sm font-semibold hover:bg-slate-50 transition"
              >
                අවලංගු කරන්න
              </button>
              <button
                onClick={() => {
                  setConfirmDialog(null);
                  fetchFn(targetLevel);
                }}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white dlg-sans text-sm font-semibold transition"
              >
                හරි, ඉදිරියට
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return { allowedLevels, startLevel, handleLevelClick, ConfirmDialog };
}
