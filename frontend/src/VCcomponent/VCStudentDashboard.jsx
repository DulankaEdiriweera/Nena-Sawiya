import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

const ACTIVITIES = [
  {
    path: "/vcJigsawList",
    emoji: "🧩",
    label: "ජිග්සෝ පස්ල්",
    sub: "Jigsaw Puzzle",
    bg: "from-yellow-200 to-amber-200",
  },
  {
    path: "/vcPicCom",
    emoji: "🖼️",
    label: "පිංතූර පුරවමු",
    sub: "Picture Completion",
    bg: "from-blue-200 to-indigo-200",
  },
  {
    path: "/vcShadowMatch",
    emoji: "👤",
    label: "සෙවණැලි ගැළපෙමු",
    sub: "Shadow Match",
    bg: "from-purple-200 to-pink-200",
  },
];

export default function VCStudentDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <div><Header/></div>
          <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center py-10 px-4">
      {/* Mascot / Header */}
      <div className="text-5xl mb-2">🦁</div>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-1">ආයුබෝවන්!</h1>
      <p className="text-gray-700 font-semibold mb-8 text-center max-w-md">
        අද ඔබ කැමති ක්‍රියාකාරකම තෝරන්න 🎉
      </p>

      {/* Cards */}
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

            <span className="mt-1 bg-white/70 text-gray-800 text-sm font-bold px-3 py-1 rounded-full">
              ▶ ආරම්භ කරන්න
            </span>
          </button>
        ))}
      </div>

      <div className="mt-10 text-center max-w-md">
        <p className="text-gray-500 font-semibold text-sm">
          🌟 සෙල්ලම් කරමින් ඉගෙන ගමු!
        </p>
      </div>
    </div>
    </div>

  );
}