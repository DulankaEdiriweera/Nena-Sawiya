import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

const INTERVENTIONS = [
  {
    path: "/storyClozeTask",
    emoji: "📚",
    label: "කතන්දර සම්පූර්ණ කිරීමේ ක්‍රියාකාරකම",
    sub: "Story Completion",
    bg: "from-purple-200 to-pink-200",
  },
  {
    path: "/pictureMCQTask",
    emoji: "🖼️",
    label: "පින්තූර විස්තර කිරීමේ ක්‍රියාකාරකම",
    sub: "Picture Description",
    bg: "from-green-200 to-emerald-200",
  },
  {
    path: "/sequencingTask",
    emoji: "🧩",
    label: "නිවැරදි අනුපිළිවෙල තේරීම",
    sub: "Sequencing Activity",
    bg: "from-indigo-200 to-purple-200",
  },
];

export default function StudentELDDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <Header />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center py-10 px-4">
        
        {/* Header Section */}
        <div className="text-5xl mb-2">🧠</div>

        <h1 className="text-3xl font-extrabold text-gray-800 mb-1">
          භාෂා කුසලතා වර්ධනය කරමු
        </h1>

        <p className="text-gray-700 font-semibold mb-8 text-center max-w-md">
          ඔබට අවශ්‍ය ක්‍රියාකාරකම තෝරන්න ✨
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          {INTERVENTIONS.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`bg-gradient-to-br ${item.bg} rounded-3xl p-6 flex flex-col items-center gap-3 shadow-lg hover:scale-105 active:scale-95 transition-transform`}
            >
              <span className="text-5xl">{item.emoji}</span>

              <span className="text-gray-800 font-extrabold text-lg text-center leading-tight">
                {item.label}
              </span>

              <span className="text-gray-600 text-xs font-semibold text-center">
                {item.sub}
              </span>

              <span className="mt-1 bg-gray-100 text-gray-800 text-sm font-bold px-3 py-1 rounded-full">
                ▶ ආරම්භ කරන්න
              </span>
            </button>
          ))}
        </div>

        <p className="mt-10 text-gray-500 font-semibold text-sm text-center max-w-md">
          🌟 අදත් ඔබේ භාෂා කුසලතා වර්ධනය කරමු!
        </p>
      </div>
    </div>
  );
}