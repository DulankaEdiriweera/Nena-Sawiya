// src/RldDirection/StudentDirectionGame.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import DirectionDragDrop from "./DirectionDragDrop";
import Header from "../Components/Header";
import { useInterventionLevel } from "../RldComponent/useInterventionLevel.jsx";

const ALL_LEVELS = ["easy", "medium", "hard"];
const levelLabels = { easy: "පහසු", medium: "මධ්‍යම", hard: "අපහසු" };

const StudentDirectionGame = () => {
  const { allowedLevels, startLevel, handleLevelClick, ConfirmDialog } =
    useInterventionLevel();

  const [directionSet, setDirectionSet] = useState(null);
  const [level, setLevel] = useState(startLevel);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSet(startLevel);
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
    <div>
      <ConfirmDialog />
      <Header />
      <div className="font-sans min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 flex flex-col items-center justify-center py-10 px-4">
        <div className="w-full max-w-4xl border-4 border-indigo-300 rounded-3xl shadow-2xl bg-white p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-indigo-800">
              දිශා හඳුනා ගැනීමේ ක්‍රියාකාරකම
            </h2>
            <p className="text-gray-600 mt-2">
              රූපය නිවැරදි දිශාවේ කොටසට ඇදගෙන යන්න.
            </p>
          </div>

          {/* Level tabs */}
          <div className="flex justify-center gap-3 mb-2 flex-wrap">
            {ALL_LEVELS.map((lvl) => {
              const isPermitted = allowedLevels.includes(lvl);
              const isActive = level === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => handleLevelClick(lvl, fetchSet)}
                  className={`relative px-5 py-2 rounded-full font-semibold text-sm border-2 transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-500 text-white border-blue-500 shadow-md scale-105"
                        : isPermitted
                          ? "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                          : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                    }`}
                >
                  {levelLabels[lvl]}
                  {isPermitted && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-400 border border-white" />
                  )}
                  {!isPermitted && (
                    <span
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 border border-white flex items-center justify-center text-white font-bold"
                      style={{ fontSize: "8px" }}
                    >
                      !
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex justify-center gap-4 mb-8 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              නිර්දේශිත
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              නිර්දේශිත නොවේ
            </span>
          </div>

          {error && (
            <p className="text-center text-red-500 font-semibold py-10">
              {error}
            </p>
          )}

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

          {result && (
            <div className="mt-4 p-4 rounded bg-green-100 text-green-800 font-semibold text-center">
              <p>මට්ටම: {levelLabels[level]}</p>
              <p>
                ලකුණු: {result.score}% ({result.correct}/{result.total}{" "}
                නිවැරදියි)
              </p>
            </div>
          )}

          {result && (
            <div className="mt-4 flex justify-center gap-4 flex-wrap">
              {ALL_LEVELS.filter((l) => l !== level).map((l) => (
                <button
                  key={l}
                  onClick={() => handleLevelClick(l, fetchSet)}
                  className={`py-2 px-5 rounded-lg shadow-md font-semibold transition ${allowedLevels.includes(l) ? "bg-green-600 hover:bg-green-700 text-white" : "bg-amber-100 hover:bg-amber-200 text-amber-700"}`}
                >
                  {levelLabels[l]} මට්ටමට →{!allowedLevels.includes(l) && " ⚠"}
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 text-indigo-700 font-semibold text-center">
            ලකුණු: {score} / {totalItems}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDirectionGame;
