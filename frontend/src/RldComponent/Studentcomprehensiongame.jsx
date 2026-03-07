// src/RldComprehension/StudentComprehensionGame.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Components/Header";
import { useInterventionLevel } from "../RldComponent/useInterventionLevel.jsx";

const ALL_LEVELS = ["easy", "medium", "hard"];
const levelLabels = { easy: "පහසු", medium: "මධ්‍යම", hard: "අපහසු" };
const optionLabels = ["A", "B", "C", "D"];

const StudentComprehensionGame = () => {
  const { allowedLevels, startLevel, handleLevelClick, ConfirmDialog } =
    useInterventionLevel();

  const [passage, setPassage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [passageId, setPassageId] = useState("");
  const [level, setLevel] = useState(startLevel);
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [totalQ, setTotalQ] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    fetchPassage(startLevel);
  }, []);

  const fetchPassage = async (lvl) => {
    setLoading(true);
    setResult(null);
    setError("");
    setSelected([]);
    setPassage("");
    setQuestions([]);
    setShowWarning(false);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/rld_comprehension/get_passage/${lvl}`,
      );
      setPassageId(res.data._id);
      setPassage(res.data.passage);
      setQuestions(res.data.questions);
      setSelected(Array(res.data.questions.length).fill(null));
      setLevel(lvl);
    } catch (err) {
      setError(
        err.response?.status === 404
          ? `"${levelLabels[lvl]}" මට්ටමට තවම passages නොමැත.`
          : "දෝෂයකි. නැවත උත්සාහ කරන්න.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qIdx, optIdx) => {
    if (result) return;
    setSelected((prev) => prev.map((v, i) => (i === qIdx ? optIdx : v)));
    setShowWarning(false);
  };

  const handleSubmit = async () => {
    if (selected.some((s) => s === null)) {
      setShowWarning(true);
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/rld_comprehension/check_answers",
        { passage_id: passageId, answers: selected },
      );
      setResult(res.data);
      setScore((s) => s + res.data.score);
      setTotalQ((t) => t + res.data.total);
    } catch {
      setError("පිළිතුරු ඉදිරිපත් කිරීමේ දෝෂයකි.");
    }
  };

  const allAnswered = selected.length > 0 && selected.every((s) => s !== null);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-indigo-200">
        <p className="text-lg font-semibold text-indigo-700">පූරණය වෙමින්..</p>
      </div>
    );

  return (
    <div>
      <ConfirmDialog />
      <Header />
      <div className="font-sans min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 flex flex-col items-center justify-center py-10 px-4">
        <div className="w-full max-w-3xl border-4 border-indigo-300 rounded-3xl shadow-2xl bg-white p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-indigo-800">
              කියවීම් අවබෝධය
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Passage කියවා නිවැරදි පිළිතුර ක්ලික් කරන්න
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
                  onClick={() => handleLevelClick(lvl, fetchPassage)}
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
          <div className="flex justify-center gap-4 mb-6 text-xs text-gray-400">
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
            <div className="text-center py-10">
              <p className="text-red-500 font-semibold">{error}</p>
              <p className="text-gray-400 text-sm mt-1">
                වෙනත් මට්ටමක් තෝරන්න.
              </p>
            </div>
          )}

          {!error && passage && (
            <>
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 mb-6">
                <p className="text-xs text-amber-600 font-semibold mb-2 uppercase tracking-wide">
                  📖 කියවන්න
                </p>
                <p className="text-base leading-relaxed text-gray-800 font-medium">
                  {passage}
                </p>
              </div>

              {result && (
                <div
                  className={`mb-6 p-4 rounded-xl text-center font-semibold border ${result.score === result.total ? "bg-green-100 text-green-800 border-green-300" : result.score >= result.total / 2 ? "bg-yellow-100 text-yellow-800 border-yellow-300" : "bg-red-100 text-red-700 border-red-300"}`}
                >
                  <p className="text-lg">
                    {result.score === result.total
                      ? "🌟 සම්පූර්ණ ලකුණු!"
                      : result.score >= result.total / 2
                        ? "👍 හොඳයි!"
                        : "💪 නැවත උත්සාහ කරන්න!"}
                  </p>
                  <p className="text-sm mt-1">
                    {result.score} / {result.total} නිවැරදියි
                  </p>
                </div>
              )}

              <div className="space-y-6">
                {questions.map((q, qIdx) => {
                  const qResult = result?.results?.[qIdx];
                  return (
                    <div
                      key={qIdx}
                      className="bg-gray-50 rounded-2xl border border-gray-200 p-4"
                    >
                      <p className="font-semibold text-gray-800 mb-3">
                        <span className="text-indigo-600 mr-2">
                          {qIdx + 1}.
                        </span>
                        {q.question}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selected[qIdx] === optIdx;
                          const isCorrect = qResult?.correct_index === optIdx;
                          const isWrong =
                            result && isSelected && !qResult?.correct;
                          let btnClass =
                            "flex items-center gap-2 w-full p-3 rounded-xl border-2 text-left transition font-medium text-sm ";
                          if (result) {
                            if (isCorrect)
                              btnClass +=
                                "border-green-500 bg-green-50 text-green-800";
                            else if (isWrong)
                              btnClass +=
                                "border-red-400 bg-red-50 text-red-700";
                            else
                              btnClass +=
                                "border-gray-200 bg-white text-gray-400 opacity-60";
                          } else {
                            if (isSelected)
                              btnClass +=
                                "border-indigo-500 bg-indigo-50 text-indigo-800";
                            else
                              btnClass +=
                                "border-gray-300 bg-white text-gray-700 hover:border-indigo-400 cursor-pointer";
                          }
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelect(qIdx, optIdx)}
                              className={btnClass}
                              disabled={!!result}
                            >
                              <span
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${result ? (isCorrect ? "bg-green-500 text-white" : isWrong ? "bg-red-500 text-white" : "bg-gray-200 text-gray-500") : isSelected ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-500"}`}
                              >
                                {result
                                  ? isCorrect
                                    ? "✓"
                                    : isWrong
                                      ? "✗"
                                      : optionLabels[optIdx]
                                  : optionLabels[optIdx]}
                              </span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {showWarning && (
                <p className="text-red-500 text-sm mt-4 text-center">
                  ඉදිරිපත් කිරීමට පෙර සියලු ප්‍රශ්නවලට පිළිතුරු දෙන්න.
                </p>
              )}

              {!result && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={!allAnswered}
                    className={`py-2 px-10 rounded-lg shadow-md font-semibold transition ${allAnswered ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                  >
                    ඉදිරිපත් කරන්න
                  </button>
                </div>
              )}

              {result && (
                <div className="flex justify-center gap-4 mt-5 flex-wrap">
                  <button
                    onClick={() => fetchPassage(level)}
                    className="py-2 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition"
                  >
                    තවත් එකක් →
                  </button>
                  {ALL_LEVELS.filter((l) => l !== level).map((l) => (
                    <button
                      key={l}
                      onClick={() => handleLevelClick(l, fetchPassage)}
                      className={`py-2 px-5 font-semibold rounded-lg transition ${allowedLevels.includes(l) ? "bg-gray-200 hover:bg-gray-300 text-gray-700" : "bg-amber-100 hover:bg-amber-200 text-amber-700"}`}
                    >
                      {levelLabels[l]}
                      {!allowedLevels.includes(l) && " ⚠"}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-6 text-indigo-700 font-semibold text-center">
                ලකුණු: {score} / {totalQ}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentComprehensionGame;
