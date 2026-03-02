// src/RldDirection/StudentDirectionGame.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import DirectionDragDrop from "./DirectionDragDrop";

const StudentDirectionGame = () => {
  const [directionSet, setDirectionSet] = useState(null);
  const [level, setLevel] = useState("easy");
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const levelLabels = { easy: "පහසු", medium: "මධ්‍යම", hard: "අපහසු" };

  useEffect(() => {
    fetchSet("easy");
  }, []);

  const fetchSet = async (lvl) => {
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await axios.get(
        `http://localhost:5000/api/rld_direction_bp/get_direction_set/${lvl}`,
      );
      setDirectionSet(res.data);
      setLevel(lvl);
    } catch {
      setError("මෙම මට්ටමට දිශා කට්ටල නොමැත.");
      setDirectionSet(null);
    }
    setLoading(false);
  };

  const handleSubmit = async (answers) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/rld_direction_bp/submit_direction_level",
        { set_id: directionSet.set_id, answers },
      );
      setResult(res.data);
      setScore((s) => s + res.data.correct);
      setTotalItems((t) => t + res.data.total);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-indigo-200">
        <p className="text-lg font-semibold text-indigo-700">
          දිශා ක්‍රීඩාව පූරණය වෙමින්..
        </p>
      </div>
    );

  return (
    <div className="font-sans min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl border-4 border-indigo-300 rounded-3xl shadow-2xl bg-white p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-indigo-800">
            දිශා හඳුනා ගැනීමේ ක්‍රියාකාරකම
          </h2>
          <p className="text-gray-600 mt-2">
            රූපය නිවැරදි දිශාවේ කොටසට ඇදගෙන යන්න.
          </p>
        </div>

        {/* Level tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          {["easy", "medium", "hard"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => fetchSet(lvl)}
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

        {/* Error */}
        {error && (
          <p className="text-center text-red-500 font-semibold py-10">
            {error}
          </p>
        )}

        {/* Game */}
        {!error && directionSet && (
          <div className="rounded-2xl p-6 border border-indigo-100 shadow-inner bg-gray-50">
            <DirectionDragDrop
              key={level}
              levelData={directionSet}
              onSubmit={handleSubmit}
              showResults={!!result}
            />
          </div>
        )}

        {/* Result — same green block as friend's StoryClozeTask */}
        {result && (
          <div className="mt-4 p-4 rounded bg-green-100 text-green-800 font-semibold text-center">
            <p>මට්ටම: {levelLabels[level]}</p>
            <p>
              ලකුණු: {result.score}% ({result.correct}/{result.total} නිවැරදියි)
            </p>
          </div>
        )}

        {/* Next level buttons — same as friend's "ඊළඟ කතාව" */}
        {result && (
          <div className="mt-4 flex justify-center gap-4">
            {["easy", "medium", "hard"]
              .filter((l) => l !== level)
              .map((l) => (
                <button
                  key={l}
                  onClick={() => fetchSet(l)}
                  className="py-2 px-5 rounded-lg shadow-md font-semibold bg-green-600 hover:bg-green-700 text-white transition"
                >
                  {levelLabels[l]} මට්ටමට →
                </button>
              ))}
          </div>
        )}

        {/* Score footer — same as friend */}
        <div className="mt-6 text-indigo-700 font-semibold text-center">
          ලකුණු: {score} / {totalItems}
        </div>
      </div>
    </div>
  );
};

export default StudentDirectionGame;
