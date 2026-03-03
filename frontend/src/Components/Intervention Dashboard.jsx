import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const INTERVENTIONS = [
  {
    path: "/eldStudentIntervention",
    emoji: "💬",
    label: "ප්‍රකාශන භාෂා කුසලතාව",
    sub: "Expressive Language",
    bg: "from-pink-200 to-rose-200",
  },
  {
    path: "/rld-student-dashboard",
    emoji: "🔊",
    label: "ප්‍රතිග්‍රාහක භාෂා කුසලතාව",
    sub: "Receptive Language",
    bg: "from-purple-200 to-indigo-200",
  },
  {
    path: "/visual",
    emoji: "👁️",
    label: "දෘශ්‍ය විභේදන සහ මතක",
    sub: "Visual Discrimination",
    bg: "from-green-200 to-emerald-200",
  },
  {
    path: "/vcStudentDashboard",
    emoji: "🔷",
    label: "දෘශ්‍ය සම්පූර්ණතා හැකියාව",
    sub: "Visual Closure",
    bg: "from-yellow-200 to-orange-200",
  },
];

export default function InterventionDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center py-10 px-4">
        {/* Mascot / Header */}
        <div className="text-5xl mb-2">🦉</div>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-1">
          🏫 Intervention Activities
        </h1>
        <p className="text-gray-700 font-semibold mb-8 text-center max-w-md">
          ඔබේ දරුවාට සුදුසු ක්‍රියාකාරකමක් තෝරන්න 🎯
        </p>

        {/* Intervention Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-5xl">
          {INTERVENTIONS.map((activity) => (
            <button
              key={activity.path}
              onClick={() => navigate(activity.path)}
              className={`bg-gradient-to-br ${activity.bg} rounded-3xl p-6 flex flex-col items-center gap-3 shadow-lg hover:scale-105 active:scale-95 transition-transform`}
            >
              <span className="text-5xl">{activity.emoji}</span>
              <span className="text-gray-800 font-extrabold text-lg leading-tight text-center">
                {activity.label}
              </span>
              <span className="text-gray-600 text-xs font-semibold text-center">
                {activity.sub}
              </span>
              <span className="mt-1 bg-gray-100 text-gray-800 text-sm font-bold px-3 py-1 rounded-full">
                ▶ ආරම්භ කරන්න
              </span>
            </button>
          ))}
        </div>

        <p className="mt-10 text-gray-500 font-semibold text-sm text-center max-w-md">
          🌟 දරුවන්ට ආරක්ෂිතව සහ සතුටින් ඉගෙනීමට උපකාරී වේ!
        </p>
      </div>
    </div>
  );
}
