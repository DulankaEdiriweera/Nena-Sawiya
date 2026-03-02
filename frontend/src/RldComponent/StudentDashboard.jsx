import React from "react";
import { useNavigate } from "react-router-dom";

const ACTIVITIES = [
  {
    path: "/student-categorize",
    emoji: "🧺",
    label: "වර්ගීකරණය",
    sub: "Sort & Categorize",
    bg: "from-red-400 to-orange-400",
  },
  {
    path: "/student-comprehension",
    emoji: "📖",
    label: "කියවීම් අවබෝධය",
    sub: "Reading Comprehension",
    bg: "from-teal-400 to-cyan-500",
  },
  {
    path: "/student-direction",
    emoji: "🧭",
    label: "දිශා හඳුනා ගැනීම",
    sub: "Directions Game",
    bg: "from-purple-400 to-pink-400",
  },
  {
    path: "/student-jumbled",
    emoji: "🔤",
    label: "අවුල් වූ වාක්‍යය",
    sub: "Jumbled Sentences",
    bg: "from-yellow-400 to-amber-400",
  },
  {
    path: "/student-wh",
    emoji: "🎧",
    label: "WH ප්‍රශ්න",
    sub: "WH Questions",
    bg: "from-blue-400 to-indigo-500",
  },
];

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-purple-300 flex flex-col items-center py-10 px-4">
      <div className="text-5xl mb-2">🦁</div>
      <h1 className="text-3xl font-extrabold text-white drop-shadow mb-1">
        ආයුබෝවන්!
      </h1>
      <p className="text-white/80 font-semibold mb-8">
        ඔබේ ක්‍රියාකාරකම තෝරන්න 🎉
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 w-full max-w-2xl">
        {ACTIVITIES.map((act) => (
          <button
            key={act.path}
            onClick={() => navigate(act.path)}
            className={`bg-gradient-to-br ${act.bg} rounded-3xl p-6 flex flex-col items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-transform`}
          >
            <span className="text-5xl">{act.emoji}</span>
            <span className="text-white font-extrabold text-lg leading-tight text-center">
              {act.label}
            </span>
            <span className="text-white/80 text-xs font-semibold">
              {act.sub}
            </span>
            <span className="mt-1 bg-white/25 text-white text-sm font-bold px-4 py-1 rounded-full">
              ▶ ශෙල්ලම්
            </span>
          </button>
        ))}
      </div>

      <p className="mt-10 text-white/60 font-semibold text-sm">
        🌈 ශ්‍රේෂ්ඨ ඉගෙනුම්කරුවෙකු වෙන්න!
      </p>
    </div>
  );
}
