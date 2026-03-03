// src/RldWH/StudentWHGame.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Header from "../Components/Header";

const WH_COLORS = {
  කවුද: "bg-purple-100 text-purple-800 border-purple-400",
  කොහේ: "bg-blue-100   text-blue-800   border-blue-400",
  මොකද: "bg-green-100  text-green-800  border-green-400",
  කවදා: "bg-orange-100 text-orange-800 border-orange-400",
  ඇයි: "bg-red-100    text-red-800    border-red-400",
};

const AudioPlayer = ({ src, label, autoPlay = false }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setPlaying(false);
    if (autoPlay && audioRef.current) {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  }, [src]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <audio ref={audioRef} src={src} onEnded={() => setPlaying(false)} />
      <button
        onClick={toggle}
        className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold shadow-md transition text-white text-base ${
          playing
            ? "bg-indigo-700 scale-95"
            : "bg-indigo-500 hover:bg-indigo-600"
        }`}
      >
        <span className="text-2xl">{playing ? "⏸" : "▶"}</span>
        <span>{playing ? "නවතන්න" : label}</span>
      </button>
    </div>
  );
};

const StudentWHGame = () => {
  const [level, setLevel] = useState("easy");
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [seenIds, setSeenIds] = useState({ easy: [], medium: [], hard: [] });
  const [whFilter, setWhFilter] = useState("සියල්ල");

  const levelLabels = { easy: "පහසු", medium: "මධ්‍යම", hard: "අපහසු" };
  const WH_TYPES = ["සියල්ල", "කවුද", "කොහේ", "මොකද", "කවදා", "ඇයි"];

  useEffect(() => {
    fetchQuestion("easy", [], "සියල්ල");
  }, []);

  const fetchQuestion = async (lvl, currentSeen, wh) => {
    setLoading(true);
    setResult(null);
    setSelected(null);
    setError("");

    const seen = currentSeen ?? seenIds[lvl];
    const seenParam = seen.length > 0 ? `&seen=${seen.join(",")}` : "";
    const whParam =
      wh !== "සියල්ල" ? `?wh_type=${encodeURIComponent(wh)}` : "?dummy=1";

    try {
      const res = await axios.get(
        `http://localhost:5000/api/rld_wh/get_question/${lvl}${whParam}${seenParam}`,
      );
      const newId = res.data.question_id;
      const updatedSeen = { ...seenIds, [lvl]: [...seen, newId] };
      setSeenIds(updatedSeen);
      setQuestion(res.data);
      setLevel(lvl);
    } catch (err) {
      setError(
        err.response?.status === 404
          ? `"${levelLabels[lvl]}" මට්ටමට ප්‍රශ්න නොමැත.`
          : "දෝෂයකි. නැවත උත්සාහ කරන්න.",
      );
      setQuestion(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (i) => {
    if (result || selected !== null) return;
    setSelected(i);
    const isCorrect = i === question.correct_index;
    setResult({ correct: isCorrect, correct_index: question.correct_index });
    setTotal((t) => t + 1);
    if (isCorrect) setScore((s) => s + 1);
  };

  const handleNext = () => fetchQuestion(level, seenIds[level], whFilter);
  const handleLevel = (lvl) => {
    setWhFilter("සියල්ල");
    fetchQuestion(lvl, seenIds[lvl], "සියල්ල");
  };
  const handleWHFilter = (wh) => {
    setWhFilter(wh);
    fetchQuestion(level, seenIds[level], wh);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-indigo-200">
        <p className="text-lg font-semibold text-indigo-700">
          ප්‍රශ්නය පූරණය වෙමින්..
        </p>
      </div>
    );

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="font-sans min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 flex flex-col items-center justify-center py-10 px-4">
        <div className="w-full max-w-2xl border-4 border-indigo-300 rounded-3xl shadow-2xl bg-white p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-indigo-800">
              WH ප්‍රශ්න ක්‍රියාකාරකම
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              ශබ්දය අසා නිවැරදි පිළිතුර තෝරන්න
            </p>
          </div>

          {/* Level tabs */}
          <div className="flex justify-center gap-3 mb-4">
            {["easy", "medium", "hard"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleLevel(lvl)}
                className={`px-4 py-2 rounded font-semibold transition ${
                  level === lvl
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {levelLabels[lvl]}
              </button>
            ))}
          </div>

          {/* WH filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {WH_TYPES.map((wh) => (
              <button
                key={wh}
                onClick={() => handleWHFilter(wh)}
                className={`px-3 py-1 rounded-full text-sm font-semibold border-2 transition ${
                  whFilter === wh
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                }`}
              >
                {wh}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="text-center py-10">
              <p className="text-red-500 font-semibold">{error}</p>
              <p className="text-gray-400 text-sm mt-1">
                වෙනත් මට්ටමක් හෝ WH වර්ගයක් තෝරන්න.
              </p>
            </div>
          )}

          {!error && question && (
            <div className="space-y-6">
              {/* WH badge */}
              <div className="flex justify-center">
                <span
                  className={`px-6 py-2 rounded-full border-2 font-bold text-2xl ${
                    WH_COLORS[question.wh_type] ||
                    "bg-gray-100 text-gray-700 border-gray-300"
                  }`}
                >
                  {question.wh_type} ?
                </span>
              </div>

              {/* Audio section */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 space-y-5">
                {/* Scene audio — auto plays */}
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    1. දර්ශනය අසන්න
                  </p>
                  <AudioPlayer
                    key={`scene-${question.question_id}`}
                    src={question.scene_audio_url}
                    label="දර්ශනය අසන්න 🔊"
                    autoPlay={true}
                  />
                </div>

                <div className="border-t border-indigo-200" />

                {/* Question audio */}
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    2. ප්‍රශ්නය අසන්න
                  </p>
                  <AudioPlayer
                    key={`q-${question.question_id}`}
                    src={question.question_audio_url}
                    label="ප්‍රශ්නය අසන්න 🔊"
                  />
                  {question.question_text && (
                    <p className="mt-4 text-xl font-bold text-indigo-800">
                      {question.question_text}
                    </p>
                  )}
                </div>
              </div>

              {/* Text MCQ options */}
              <div>
                <p className="text-center text-gray-600 font-medium mb-4">
                  නිවැරදි පිළිතුර තෝරන්න:
                </p>
                <div
                  className={`grid gap-3 ${
                    question.options.length === 2
                      ? "grid-cols-2"
                      : question.options.length === 3
                        ? "grid-cols-3"
                        : "grid-cols-2"
                  }`}
                >
                  {question.options.map((opt, i) => {
                    const isSelected = selected === i;
                    const isCorrect = question.correct_index === i;

                    let cls =
                      "border-gray-300 bg-white text-gray-700 hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer";
                    if (result) {
                      if (isCorrect)
                        cls =
                          "border-green-500 bg-green-100 text-green-800 cursor-default font-bold";
                      else if (isSelected)
                        cls =
                          "border-red-400   bg-red-100   text-red-700   cursor-default";
                      else
                        cls =
                          "border-gray-200  bg-gray-50   text-gray-400  cursor-default opacity-60";
                    } else if (isSelected) {
                      cls = "border-indigo-500 bg-indigo-50 text-indigo-700";
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        disabled={!!result}
                        className={`relative py-4 px-4 rounded-2xl border-2 text-lg font-semibold shadow transition-all text-center ${cls}`}
                      >
                        {opt.text}
                        {result && isCorrect && (
                          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                            ✓
                          </span>
                        )}
                        {result && isSelected && !isCorrect && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                            ✗
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Result */}
              {result && (
                <div
                  className={`p-4 rounded-xl text-center font-semibold text-lg border ${
                    result.correct
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-red-100   text-red-700   border-red-300"
                  }`}
                >
                  {result.correct
                    ? "✅ නිවැරදියි! ශාබාෂ්!"
                    : `❌ වැරදියි! නිවැරදි පිළිතුර: ${question.options[result.correct_index].text}`}
                </div>
              )}

              {/* Next */}
              {result && (
                <div className="flex justify-center gap-4 flex-wrap">
                  <button
                    onClick={handleNext}
                    className="py-2 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition"
                  >
                    ඊළඟ ප්‍රශ්නය →
                  </button>
                  {["easy", "medium", "hard"]
                    .filter((l) => l !== level)
                    .map((l) => (
                      <button
                        key={l}
                        onClick={() => handleLevel(l)}
                        className="py-2 px-5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
                      >
                        {levelLabels[l]}
                      </button>
                    ))}
                </div>
              )}

              {/* Score */}
              <div className="text-center text-indigo-700 font-semibold mt-2">
                ලකුණු: {score} / {total}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentWHGame;
