import React from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../Components/Header";

const ACTIVITIES = [
  {
    path: "/userVD1",
    emoji: "🔍",
    label: "වෙනස සොයාගනිමු",
    sub: "Visual Discrimination",
    bg: "from-indigo-200 to-purple-200",
  },
  {
    path: "/CountImageGameVD",
    emoji: "🐾",
    label: "වස්තු ගණන් කරමු",
    sub: "Count the Objects",
    bg: "from-orange-200 to-pink-200",
  },
  {
    path: "/userVD1Drag",
    emoji: "🔡",
    label: "අකුරු සහ අංක ගලපමු",
    sub: "Letter & Number Match",
    bg: "from-teal-200 to-cyan-200",
  },
  {
    path: "/UserMemoryGamePage",
    emoji: "🧠",
    label: "මතකය පරීක්ෂා කරමු",
    sub: "Memory Challenge",
    bg: "from-rose-200 to-red-200",
  },
];

export default function VdStudentDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center py-10 px-4">

        <div className="text-5xl mb-2">👀</div>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-1">
          ආයුබෝවන්!
        </h1>
        <p className="text-gray-700 font-semibold mb-8 text-center max-w-md">
          ඔබේ ක්‍රියාකාරකම තෝරන්න 🎉
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          {ACTIVITIES.map((act) => (
            <button
              key={act.path}
              onClick={() => navigate(act.path)}
              className={`bg-gradient-to-br ${act.bg} rounded-3xl p-6 flex flex-col items-center gap-3 shadow-lg hover:scale-105 active:scale-95 transition-transform`}
            >
              <span className="text-5xl">{act.emoji}</span>
              <span className="text-gray-800 font-extrabold text-lg leading-tight text-center">
                {act.label}
              </span>
              <span className="text-gray-600 text-xs font-semibold text-center">
                {act.sub}
              </span>
              <span className="mt-1 bg-gray-100 text-gray-800 text-sm font-bold px-3 py-1 rounded-full">
                ▶ ආරම්භ කරන්න
              </span>
            </button>
          ))}
        </div>

        <p className="mt-10 text-gray-500 font-semibold text-sm text-center max-w-md">
          🌟 ඔබේ දරුවාට ආරක්ෂිතව සහ සතුටින් ඉගෙනීමට උපකාරී වේ!
        </p>
      </div>
    </div>
  );
}