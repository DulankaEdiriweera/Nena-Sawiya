// src/RldJumbled/StudentJumbledGame.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Header from "../Components/Header";

const StudentJumbledGame = () => {
  const [level, setLevel] = useState("easy");
  const [setId, setSetId] = useState("");
  const [jumbled, setJumbled] = useState([]);
  const [words, setWords] = useState([]);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Track all seen IDs per level so no question repeats in a session
  const [seenIds, setSeenIds] = useState({ easy: [], medium: [], hard: [] });

  const levelLabels = { easy: "පහසු", medium: "මධ්‍යම", hard: "අපහසු" };

  useEffect(() => {
    fetchSentence("easy");
  }, []);

  const fetchSentence = async (lvl, currentSeenIds) => {
    setLoading(true);
    setResult(null);
    setError("");

    // Use passed seenIds or current state
    const seen = currentSeenIds ?? seenIds[lvl];
    const seenParam = seen.length > 0 ? `?seen=${seen.join(",")}` : "";

    try {
      const res = await axios.get(
        `http://localhost:5000/api/rld_jumbled/get_jumbled/${lvl}${seenParam}`,
      );
      const newId = res.data._id;

      // ✅ Add this new ID to the seen list for this level
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

  const handleLevelChange = (lvl) => {
    // When switching levels, keep that level's seen list intact
    fetchSentence(lvl, seenIds[lvl]);
  };

  const handleNext = () => {
    // Pass updated seen list (already includes current setId)
    fetchSentence(level, seenIds[level]);
  };

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
      <div>
        <Header />
      </div>
      <div className="font-sans min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 flex flex-col items-center justify-center py-10 px-4">
        <div className="w-full max-w-3xl border-4 border-indigo-300 rounded-3xl shadow-2xl bg-white p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-indigo-800">
              අවුල් වූ වාක්‍යය සකසන්න
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              වචන ඇදගෙන නිවැරදි පිළිවෙලට තබන්න
            </p>
          </div>

          {/* Level tabs */}
          <div className="flex justify-center gap-4 mb-8">
            {["easy", "medium", "hard"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleLevelChange(lvl)}
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

          {error && (
            <p className="text-center text-red-500 font-semibold py-6">
              {error}
            </p>
          )}

          {!error && (
            <div className="space-y-6">
              {/* Jumbled reference */}
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-center">
                <p className="text-xs text-amber-600 font-semibold mb-2 uppercase tracking-wide">
                  අවුල් වූ වාක්‍යය
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

              {/* Drag-drop */}
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="words" direction="horizontal">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex flex-wrap gap-3 min-h-[70px] p-4 rounded-2xl border-2 border-dashed transition ${
                        snapshot.isDraggingOver
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-300 bg-gray-50"
                      }`}
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
                              className={`px-5 py-3 rounded-xl font-bold text-lg shadow-md cursor-grab transition-transform ${
                                snapshot.isDragging
                                  ? "bg-indigo-700 text-white scale-105 shadow-xl"
                                  : "bg-indigo-500 text-white hover:bg-indigo-600"
                              }`}
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

              {/* Preview */}
              <p className="text-center text-gray-500 text-sm">
                ඔබේ පිළිවෙල:{" "}
                <span className="font-semibold text-indigo-700">
                  {words.map((w) => w.text).join(" ") || "—"}
                </span>
              </p>

              {/* Submit */}
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

              {/* Result */}
              {result && (
                <div
                  className={`p-4 rounded-xl text-center font-semibold text-lg ${
                    result.correct
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-red-100 text-red-700 border border-red-300"
                  }`}
                >
                  {result.correct
                    ? "✅ නිවැරදියි!"
                    : `❌ වැරදියි! නිවැරදි පිළිතුර: ${result.correct_answer.join(" ")}`}
                </div>
              )}

              {/* Next */}
              {result && (
                <div className="flex justify-center gap-4 flex-wrap">
                  <button
                    onClick={handleNext}
                    className="py-2 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition"
                  >
                    තවත් එකක් →
                  </button>
                  {["easy", "medium", "hard"]
                    .filter((l) => l !== level)
                    .map((l) => (
                      <button
                        key={l}
                        onClick={() => handleLevelChange(l)}
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

export default StudentJumbledGame;
