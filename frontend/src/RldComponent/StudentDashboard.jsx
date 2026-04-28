import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../Components/Header";

const ACTIVITIES = [
  {
    path: "/student-categorize",
    emoji: "🧺",
    label: "වර්ග කරමු",
    sub: "Sort & Categorize",
    bg: "from-red-200 to-orange-200",
    border: "border-orange-300",
  },
  {
    path: "/student-comprehension",
    emoji: "📖",
    label: "අවබෝධයෙන් පිලිතුරු දෙමු",
    sub: "Reading Comprehension",
    bg: "from-teal-200 to-cyan-200",
    border: "border-teal-300",
  },
  {
    path: "/student-direction",
    emoji: "🧭",
    label: "දිශා හඳුනා ගනිමු",
    sub: "Directions Game",
    bg: "from-purple-200 to-pink-200",
    border: "border-purple-300",
  },
  {
    path: "/student-jumbled",
    emoji: "🔤",
    label: "වචන මාරු කරමු",
    sub: "Jumbled Sentences",
    bg: "from-yellow-200 to-amber-200",
    border: "border-yellow-300",
  },
  {
    path: "/student-wh",
    emoji: "🎧",
    label: "ප්‍රශ්න අසමු",
    sub: "WH Questions",
    bg: "from-blue-200 to-indigo-200",
    border: "border-blue-300",
  },
];

const LEVEL_MAP = {
  Weak: {
    allowed: ["easy", "medium", "hard"],
    startLevel: "easy",
    badgeColor: "bg-red-500",
    label: "දුර්වල",
    badge: "පහසු",
  },
  Average: {
    allowed: ["medium", "hard"],
    startLevel: "medium",
    badgeColor: "bg-yellow-500",
    label: "සාමාන්‍ය",
    badge: "මධ්‍යම",
  },
  Normal: {
    allowed: ["hard"],
    startLevel: "hard",
    badgeColor: "bg-green-500",
    label: "විශිෂ්ඨ",
    badge: "අපහසු",
  },
};

const levelLabels = { easy: "පහසු", medium: "මධ්‍යම", hard: "අපහසු" };

export default function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Use level from navigation state if available (coming from ResultModal)
  // Otherwise fetch latest from DB (coming from Home / InterventionDashboard)
  const [disorderLevel, setDisorderLevel] = useState(
    location.state?.disorderLevel || null,
  );
  const [loading, setLoading] = useState(!location.state?.disorderLevel);

  useEffect(() => {
    if (location.state?.disorderLevel) return; // already have it from navigation

    const fetchLevel = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        const base = "http://localhost:5000/api/rld";

        try {
          // Works when 2+ assessments exist — returns latest_level
          const res = await axios.get(`${base}/latest_rld_progress`, {
            headers,
          });
          if (res.data?.latest_level) {
            setDisorderLevel(res.data.latest_level);
            return;
          }
        } catch {
          // Only 1 record exists — fall through to latest_result
        }

        // Fallback: works with just 1 assessment
        const res2 = await axios.get(`${base}/latest_result`, { headers });
        if (res2.data?.RLD_level) setDisorderLevel(res2.data.RLD_level);
      } catch {
        // No record at all
      } finally {
        setLoading(false);
      }
    };

    fetchLevel();
  }, []);

  const levelInfo = disorderLevel ? LEVEL_MAP[disorderLevel] : null;

  const handleActivityClick = (act) => {
    navigate(act.path, {
      state: {
        allowedLevels: levelInfo
          ? levelInfo.allowed
          : ["easy", "medium", "hard"],
        startLevel: levelInfo ? levelInfo.startLevel : "easy",
        disorderLevel,
      },
    });
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center py-10 px-4">
        <div className="text-5xl mb-2">🦁</div>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-1">
          ආයුබෝවන්!
        </h1>
        <p className="text-gray-700 font-semibold mb-4 text-center max-w-md">
          ඔබේ ක්‍රියාකාරකම තෝරන්න 🎉
        </p>

        {/* Loading spinner */}
        {loading && (
          <div className="mb-6 flex items-center gap-2 text-indigo-500 font-semibold">
            <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            පූරණය වෙමින්...
          </div>
        )}

        {/* Disorder level banner */}
        {!loading && levelInfo && (
          <div className="mb-8 flex items-center gap-3 bg-white border-2 border-indigo-200 rounded-2xl px-6 py-3 shadow-sm">
            <span className="text-2xl">📋</span>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-gray-400">
                ඔබගේ ආබාධ මට්ටම
              </p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span
                  className={`text-white text-xs font-bold px-3 py-0.5 rounded-full ${levelInfo.badgeColor}`}
                >
                  {levelInfo.label}
                </span>
                <span className="text-sm text-gray-600 font-semibold">
                  → නිර්දේශිත මට්ටම:{" "}
                  {levelInfo.allowed.map((l) => levelLabels[l]).join(", ")}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* No record yet */}
        {!loading && !levelInfo && (
          <div className="mb-8 flex items-center gap-3 bg-amber-50 border-2 border-amber-200 rounded-2xl px-6 py-3 shadow-sm">
            <span className="text-2xl">⚠️</span>
            <p className="text-sm text-amber-700 font-semibold">
              තක්සේරුවක් සිදු කර නොමැත. සියලු මට්ටම් ලබා ගත හැකිය.
            </p>
          </div>
        )}

        {/* Activity Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          {ACTIVITIES.map((act) => (
            <button
              key={act.path}
              onClick={() => handleActivityClick(act)}
              className={`relative bg-gradient-to-br ${act.bg} border-2 ${act.border} rounded-3xl p-6 flex flex-col items-center gap-3 shadow-lg hover:scale-105 active:scale-95 transition-transform text-left`}
            >
              {levelInfo && (
                <span
                  className={`absolute top-3 right-3 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow ${levelInfo.badgeColor}`}
                >
                  {levelInfo.badge}
                </span>
              )}
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
