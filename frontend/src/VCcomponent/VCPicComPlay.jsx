import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

export default function VCPicComPlay({ activityId }) {
  const apiBase = "http://localhost:5000";
  const nav = useNavigate();

  const [meta, setMeta]                 = useState(null);
  const [attempts, setAttempts]         = useState(0);
  const [startTs, setStartTs]           = useState(null);
  const [completed, setCompleted]       = useState(false);
  const [seconds, setSeconds]           = useState(null);
  const [selectedOptId, setSelectedOptId] = useState(null);
  const [isCorrect, setIsCorrect]       = useState(null);
  const [shake, setShake]               = useState(false);

  useEffect(() => {
    async function load() {
      setMeta(null); setAttempts(0); setCompleted(false);
      setSeconds(null); setSelectedOptId(null); setIsCorrect(null); setShake(false);
      const res = await axios.get(`${apiBase}/api/vc_pic_com/${activityId}`);
      setMeta(res.data);
      setStartTs(Date.now());
    }
    if (activityId) load();
  }, [activityId]);

  const handlePick = (opt) => {
    if (completed) return;
    setAttempts((a) => a + 1);
    setSelectedOptId(opt.id);
    if (opt.is_correct) {
      setIsCorrect(true);
      setCompleted(true);
      setSeconds(Math.round((Date.now() - startTs) / 1000));
    } else {
      setIsCorrect(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const reset = () => {
    setAttempts(0); setCompleted(false); setSeconds(null);
    setSelectedOptId(null); setIsCorrect(null); setShake(false);
    setStartTs(Date.now());
  };

  if (!meta) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 flex flex-col items-center justify-center gap-4"
      style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="text-6xl animate-bounce">🖼️</div>
      <p className="text-indigo-600 font-extrabold text-xl">Loading activity…</p>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');`}</style>
    </div>
  );

  const level     = (meta.levels || [])[0] ?? "—";
  const optCount  = (meta.options || []).length;
  // Option image size: 4 options → 150px, more → 120px
  const optSize   = optCount <= 4 ? 150 : 120;
  const optCols   = optCount <= 4 ? 2 : 3;

  return (
    <div>
      <div><Header/></div>
          <div
      className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 px-4 py-6"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-6px); }
          40%      { transform: translateX(6px); }
          60%      { transform: translateX(-4px); }
          80%      { transform: translateX(4px); }
        }
        .shake { animation: shake 0.45s ease; }
        @keyframes pop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .pop { animation: pop 0.35s ease; }
      `}</style>

      {/* ── Header ── */}
      <div className="text-center mb-5">
        <div className="text-4xl mb-1">🖼️</div>
        <h1 className="text-3xl font-extrabold text-indigo-700 drop-shadow-sm">{meta.title}</h1>

        <button
          onClick={() => nav("/vcPicCom")}
          className="mt-3 bg-white rounded-2xl px-4 py-2 shadow font-extrabold text-indigo-600 text-sm hover:bg-indigo-50 transition-all"
        >
          ← Back to Picture List
        </button>

        <div className="flex justify-center flex-wrap gap-2 mt-3">
          <span className="bg-white text-indigo-500 font-bold px-4 py-1.5 rounded-full shadow text-sm">
            🎯 Attempts: {attempts}
          </span>
          <span className={`font-bold px-4 py-1.5 rounded-full shadow text-sm
            ${completed ? "bg-green-400 text-white" : "bg-white text-indigo-400"}`}>
            {completed ? `🎉 Done in ${seconds}s!` : "⏳ In progress…"}
          </span>
          <span className="bg-white text-indigo-500 font-bold px-4 py-1.5 rounded-full shadow text-sm capitalize">
            {level === "easy" ? "🌱" : level === "medium" ? "⭐" : "🚀"} {level}
          </span>
        </div>
      </div>

      {/* ── Completion Banner ── */}
      {completed && (
        <div className="max-w-lg mx-auto mb-5 bg-green-400 text-white rounded-3xl p-4 text-center shadow-lg pop">
          <div className="text-4xl mb-1">🎊</div>
          <p className="font-extrabold text-xl">Amazing! You got it right!</p>
          <p className="text-green-100 font-semibold mt-1">Time: {seconds}s • Attempts: {attempts}</p>
          <button
            onClick={reset}
            className="mt-3 bg-white text-green-600 font-extrabold px-6 py-2 rounded-2xl shadow hover:bg-green-50 active:scale-95 transition-all"
          >
            🔄 Play Again
          </button>
        </div>
      )}

      {/* ── Main layout: Question | Options ── */}
      <div className="flex flex-row justify-center items-start gap-5 flex-wrap">

        {/* Question */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-white rounded-2xl px-4 py-1.5 shadow font-extrabold text-indigo-600 text-sm">
            ❓ What's missing?
          </div>
          <div className="bg-white p-2 rounded-3xl shadow-md border-2 border-indigo-100">
            <img
              src={`${apiBase}${meta.question_url}`}
              alt="question"
              style={{ width: 300, borderRadius: 16, display: "block" }}
              draggable={false}
            />
          </div>
          <p className="text-indigo-400 font-bold text-sm mt-1">👆 Pick the missing piece!</p>
        </div>

        {/* Options */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-white rounded-2xl px-4 py-1.5 shadow font-extrabold text-indigo-600 text-sm">
            🧩 Choose one!
          </div>

          <div
            className={`bg-white p-3 rounded-3xl shadow-md border-2 border-indigo-100 ${shake ? "shake" : ""}`}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${optCols}, ${optSize}px)`,
              gap: 10,
            }}
          >
            {(meta.options || []).map((opt) => {
              const isPicked  = selectedOptId === opt.id;
              const isRight   = isPicked && opt.is_correct;
              const isWrong   = isPicked && !opt.is_correct;

              return (
                <button
                  key={opt.id}
                  onClick={() => handlePick(opt)}
                  disabled={completed}
                  className={`
                    rounded-2xl overflow-hidden transition-all duration-200 border-4
                    ${!isPicked && !completed ? "border-transparent hover:border-indigo-300 hover:scale-105 hover:shadow-lg cursor-pointer" : ""}
                    ${isRight  ? "border-green-400 scale-105 shadow-lg"  : ""}
                    ${isWrong  ? "border-red-400"                         : ""}
                    ${completed && !isPicked ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                  style={{ width: optSize, height: optSize, padding: 0, background: "white" }}
                >
                  <img
                    src={`${apiBase}${opt.thumb_url || opt.url}`}
                    alt={`option-${opt.id}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                      background: "#f8f8ff",
                    }}
                    draggable={false}
                  />
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {isCorrect === true && (
            <div className="mt-1 w-full bg-green-100 border-2 border-green-300 text-green-700 font-extrabold text-base rounded-2xl px-4 py-3 text-center pop">
              ✅ Correct! Well done!
            </div>
          )}
          {isCorrect === false && (
            <div className="mt-1 w-full bg-red-100 border-2 border-red-300 text-red-600 font-extrabold text-base rounded-2xl px-4 py-3 text-center">
              ❌ Oops! Try again!
            </div>
          )}

          {/* Try Again (mid-game) */}
          {!completed && (
            <button
              onClick={reset}
              className="mt-2 w-full py-2.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-extrabold text-base shadow transition-all flex items-center justify-center gap-2"
            >
              🔄 Try Again
            </button>
          )}
        </div>

      </div>
    </div>
    </div>
  );
}