import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

const LEVEL_CONFIG = {
  easy:   { label: "පහසු",   color: "bg-green-400",  text: "text-green-700"  },
  medium: { label: "මධ්‍යම", color: "bg-yellow-400", text: "text-yellow-700" },
  hard:   { label: "දුෂ්කර",   color: "bg-rose-400",   text: "text-rose-700"   },
};

export default function VCShaMatList() {
  const [level, setLevel]     = useState("easy");
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const fetchList = async (lvl) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/vc_sha_mat/all?level=${encodeURIComponent(lvl)}`
      );
      setItems(res.data);
    } catch (e) {
      console.error(e);
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchList(level); }, [level]);

  const cfg = LEVEL_CONFIG[level];

  return (
    <div>
      <div><Header/></div>
          <div
      className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 px-4 py-8"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-2">🌑</div>
        <h1 className="text-4xl font-extrabold text-indigo-700 drop-shadow-sm tracking-tight">
          Shadow Match!
        </h1>
        {/* <p className="text-indigo-400 mt-1 text-lg font-semibold">
          Match the shape to its shadow!
        </p> */}

        {/* Added navigation button */}
        <div className="mt-4">
          <button
            onClick={() => nav("/vcStudentDashboard")}
            className="px-5 py-2 rounded-xl bg-white text-indigo-600 font-bold shadow hover:shadow-md border border-indigo-200 transition"
          >
            ← Back to Activity Dashboard
          </button>
        </div>
      </div>

      {/* Level Selector */}
      <div className="flex justify-center gap-3 mb-8">
        {Object.entries(LEVEL_CONFIG).map(([key, c]) => (
          <button
            key={key}
            onClick={() => setLevel(key)}
            className={`
              flex flex-col items-center px-5 py-3 rounded-2xl font-bold text-sm
              border-4 transition-all duration-200
              ${level === key
                ? `${c.color} border-white text-white shadow-lg scale-110`
                : `bg-white border-transparent ${c.text} hover:scale-105`
              }
            `}
          >
            <span className="text-2xl">{c.emoji}</span>
            {c.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-16 gap-4">
          <div className="text-6xl animate-bounce">🔍</div>
          <p className="text-indigo-500 font-bold text-lg">Finding activities…</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16 gap-4">
          <div className="text-6xl">😢</div>
          <p className="text-indigo-500 font-bold text-lg">
            No activities found for {cfg.label}!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {items.map((it) => (
            <div
              key={it.activity_id}
              className="bg-white rounded-3xl shadow-md p-4 flex flex-col gap-3 border-2 border-indigo-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              {/* Shadow preview */}
              <div className="w-full h-36 rounded-2xl overflow-hidden bg-gray-50 border border-indigo-100 flex items-center justify-center">
                <img
                  src={`http://localhost:5000${it.shadow_url}`}
                  alt={it.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div>
                <p className="font-extrabold text-indigo-700 text-base leading-tight">{it.title}</p>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {it.task_number != null && (
                    <span className="bg-yellow-100 text-yellow-600 text-xs font-bold px-2 py-0.5 rounded-full">
                      Task {it.task_number}
                    </span>
                  )}
                  {(it.levels || []).map((lv) => (
                    <span key={lv} className="bg-indigo-100 text-indigo-500 text-xs font-bold px-2 py-0.5 rounded-full capitalize">
                      {LEVEL_CONFIG[lv]?.emoji ?? ""} {lv}
                    </span>
                  ))}
                </div>
              </div>

              {/* Start button */}
              <button
                onClick={() => nav(`/vcShadowMatch/${it.activity_id}`)}
                className="mt-auto w-full py-2.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-extrabold text-base shadow transition-all duration-150 flex items-center justify-center gap-2"
              >
                ▶ Start!
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');`}</style>
    </div>
    </div>
  );
}