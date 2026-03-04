import React from "react";
import { useNavigate } from "react-router-dom";

const ACTIVITIES = [
  {
    path: "/userVD1",
    emoji: "🔍",
    label: "වෙනස සොයාගැනීමේ ක්‍රීඩාව",
    sub: "Visual Discrimination",
    bg: "from-indigo-400 to-purple-500",
    star: "⭐⭐⭐",
  },
  {
    path: "/CountImageGameVD",
    emoji: "🐾",
    label: "වස්තු ගණන් කිරීමේ අභියෝගය",
    sub: "Count the Objects",
    bg: "from-orange-400 to-pink-500",
    star: "⭐⭐⭐",
  },
  {
    path: "/userVD1Drag",
    emoji: "🔡",
    label: "අකුරු සහ අංක ගැලපීම",
    sub: "Letter & Number Match",
    bg: "from-teal-400 to-cyan-500",
    star: "⭐⭐⭐",
  },
  {
    path: "/UserMemoryGamePage",
    emoji: "🧠",
    label: "මතක පරීක්ෂණ ක්‍රීඩාව",
    sub: "Memory Challenge",
    bg: "from-rose-400 to-red-500",
    star: "⭐⭐⭐",
  },
];

export default function VdStudentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-purple-100 to-pink-200 flex flex-col items-center py-10 px-4">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-3 animate-bounce">👀</div>
        <h1 className="text-3xl font-black text-purple-700 drop-shadow mb-1">
          දෘශ්‍ය ක්‍රියාකාරකම්
        </h1>
        <p className="text-purple-500 font-bold text-lg mb-1">
          ඔබේ ක්‍රීඩාව තෝරන්න! 🎉
        </p>
        <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur rounded-full px-5 py-2 mt-1">
          <span className="text-yellow-400 text-lg">🌟</span>
          <span className="text-purple-600 font-bold text-sm">ශ්‍රේෂ්ඨ ඉගෙනුම්කරුවෙකු වෙන්න!</span>
          <span className="text-yellow-400 text-lg">🌟</span>
        </div>
      </div>

      {/* Activity Grid */}
      <div className="grid grid-cols-2 gap-5 w-full max-w-lg">
        {ACTIVITIES.map((act) => (
          <button
            key={act.path}
            onClick={() => navigate(act.path)}
            className={`bg-gradient-to-br ${act.bg} rounded-3xl p-5 flex flex-col items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-transform text-left w-full`}
          >
            {/* Emoji bubble */}
            <div className="w-16 h-16 bg-white/25 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
              {act.emoji}
            </div>

            <span className="text-white font-black text-sm leading-tight text-center mt-1">
              {act.label}
            </span>

            <span className="text-white/80 text-xs font-semibold text-center">
              {act.sub}
            </span>

            <span className="mt-1 bg-white/25 text-white text-xs font-black px-4 py-1.5 rounded-full">
              ▶ ශෙල්ලම්
            </span>
          </button>
        ))}
      </div>

      {/* Footer note */}
      <p className="mt-10 text-purple-400 font-semibold text-sm text-center">
        🎈 හොඳින් ක්‍රීඩා කරන්න සහ ඉගෙන ගන්න!
      </p>
    </div>
  );
}