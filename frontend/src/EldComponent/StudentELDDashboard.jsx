import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

const INTERVENTIONS = [
  {
    path: "/storyClozeTask",
    label: "කතන්දර සම්පූර්ණ කිරීමේ ක්‍රියාකාරකම",
    bg: "from-purple-400 to-pink-500",
  },
  {
    path: "/pictureMCQTask",
    label: "පින්තූර විස්තර කිරීමේ ක්‍රියාකාරකම",
    bg: "from-green-400 to-emerald-500",
  },
  {
    path: "/sequencingTask",
    label: "නිවැරදි අනුපිළිවෙල තේරීම",
    bg: "from-indigo-400 to-purple-500",
  },
];

export default function StudentELDDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="min-h-screen bg-gradient-to-b from-purple-200 to-pink-300 flex flex-col items-center py-10 px-4">
        <div className="text-5xl mb-2">🧠</div>

        <h1 className="text-3xl font-extrabold text-white drop-shadow mb-1">
          භාෂා කුසලතා වර්ධනය කරමු
        </h1>

        <p className="text-white/80 font-semibold mb-8">
          ඔබට අවශ්‍ය ක්‍රියාකාරකම තෝරන්න ✨
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
          {INTERVENTIONS.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`bg-gradient-to-br ${item.bg} rounded-3xl p-8 flex flex-col items-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-transform`}
            >
              <span className="text-6xl">{item.emoji}</span>

              <span className="text-white font-extrabold text-lg text-center">
                {item.label}
              </span>

              <span className="text-white/80 text-sm font-semibold">
                {item.sub}
              </span>

              <span className="mt-2 bg-white/25 text-white text-sm font-bold px-5 py-2 rounded-full">
                ආරම්භ කරන්න
              </span>
            </button>
          ))}
        </div>

        <p className="mt-10 text-white/70 font-semibold text-sm text-center">
          🌟 අදත් ඔබේ භාෂා කුසලතා වර්ධනය කරමු!
        </p>
      </div>
    </div>
  );
}
