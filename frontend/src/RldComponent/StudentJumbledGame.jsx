// src/RldJumbled/StudentJumbledGame.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Header from "../Components/Header";
import { useInterventionLevel } from "../RldComponent/useInterventionLevel.jsx";

const ALL_LEVELS = ["easy", "medium", "hard"];
const levelLabels = { easy: "පහසු", medium: "මධ්‍යම", hard: "අපහසු" };

const StudentJumbledGame = () => {
  const { allowedLevels, startLevel, handleLevelClick, ConfirmDialog } =
    useInterventionLevel();

  const [level, setLevel] = useState(startLevel);
  const [setId, setSetId] = useState("");
  const [jumbled, setJumbled] = useState([]);
  const [words, setWords] = useState([]);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [seenIds, setSeenIds] = useState({ easy: [], medium: [], hard: [] });

  useEffect(() => {
    fetchSentence(startLevel);
  }, []);

  const fetchSentence = async (lvl, currentSeenIds) => {
    setLoading(true);
    setResult(null);
    setError("");
    const seen = currentSeenIds ?? seenIds[lvl];
    const seenParam = seen.length > 0 ? `?seen=${seen.join(",")}` : "";
    try {
      const res = await axios.get(
        `http://localhost:5000/api/rld_jumbled/get_jumbled/${lvl}${seenParam}`,
      );
      const newId = res.data._id;
      const updatedSeen = { ...seenIds, [lvl]: [...seen, newId] };
      setSeenIds(updatedSeen);
      setSetId(newId);
      setJumbled(res.data.jumbled_words);
      setWords(res.data.drag_words.map((w, i) => ({ id: `w-${i}`, text: w })));
      setLevel(lvl);
    } catch {
      setError("මෙම මට්ටමට වචන කට්ටල නොමැත.");
    }
    setLoading(false);
  };

  const handleNext = () => fetchSentence(level, seenIds[level]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(words);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setWords(items);
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/rld_jumbled/check_jumbled",
        { set_id: setId, user_answer: words.map((w) => w.text) },
      );
      setResult(res.data);
      setTotal((t) => t + 1);
      if (res.data.correct) setScore((s) => s + 1);
    } catch (err) {
      console.error(err);
    }
  };

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
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-indigo-800">
              මාරු වූ වචන නිවැරදි පිළිවෙලට තබා අර්ථවත් වාක්‍යය සකසන්න
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              වචන ඇදගෙන නිවැරදි පිළිවෙලට තබන්න
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
                  onClick={() =>
                    handleLevelClick(lvl, (l) => fetchSentence(l, seenIds[l]))
                  }
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
            <p className="text-center text-red-500 font-semibold py-6">
              {error}
            </p>
          )}

          {!error && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-center">
                <p className="text-xs text-amber-600 font-semibold mb-2 uppercase tracking-wide">
                  වචන මාරු වූ වාක්‍යය
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {jumbled.map((word, i) => (
                    <span
                      key={i}
                      className="bg-amber-200 text-amber-900 font-bold px-4 py-2 rounded-xl text-lg shadow-sm"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-center text-gray-600 font-medium">
                ↓ පහත වචන ඇදගෙන නිවැරදි පිළිවෙලට සකසන්න ↓
              </p>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="words" direction="horizontal">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex flex-wrap gap-3 min-h-[70px] p-4 rounded-2xl border-2 border-dashed transition ${snapshot.isDraggingOver ? "border-indigo-500 bg-indigo-50" : "border-gray-300 bg-gray-50"}`}
                    >
                      {words.map((word, index) => (
                        <Draggable
                          key={word.id}
                          draggableId={word.id}
                          index={index}
                          isDragDisabled={!!result}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`px-5 py-3 rounded-xl font-bold text-lg shadow-md cursor-grab transition-transform ${snapshot.isDragging ? "bg-indigo-700 text-white scale-105 shadow-xl" : "bg-indigo-500 text-white hover:bg-indigo-600"}`}
                            >
                              {word.text}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <p className="text-center text-gray-500 text-sm">
                ඔබේ පිළිවෙල:{" "}
                <span className="font-semibold text-indigo-700">
                  {words.map((w) => w.text).join(" ") || "—"}
                </span>
              </p>

              {!result && (
                <div className="flex justify-center">
                  <button
                    onClick={handleSubmit}
                    className="py-2 px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition"
                  >
                    පිළිතුර බලන්න
                  </button>
                </div>
              )}

              {result && (
                <div
                  className={`p-4 rounded-xl text-center font-semibold text-lg ${result.correct ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-700 border border-red-300"}`}
                >
                  {result.correct
                    ? "✅ නිවැරදියි!"
                    : `❌ වැරදියි! නිවැරදි පිළිතුර: ${result.correct_answer.join(" ")}`}
                </div>
              )}

              {result && (
                <div className="flex justify-center gap-4 flex-wrap">
                  <button
                    onClick={handleNext}
                    className="py-2 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition"
                  >
                    තවත් එකක් →
                  </button>
                  {ALL_LEVELS.filter((l) => l !== level).map((l) => (
                    <button
                      key={l}
                      onClick={() =>
                        handleLevelClick(l, (lv) =>
                          fetchSentence(lv, seenIds[lv]),
                        )
                      }
                      className={`py-2 px-5 font-semibold rounded-lg transition ${allowedLevels.includes(l) ? "bg-gray-200 hover:bg-gray-300 text-gray-700" : "bg-amber-100 hover:bg-amber-200 text-amber-700"}`}
                    >
                      {levelLabels[l]}
                      {!allowedLevels.includes(l) && " ⚠"}
                    </button>
                  ))}
                </div>
              )}

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

export default StudentJumbledGame;
