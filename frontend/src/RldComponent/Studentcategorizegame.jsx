// src/RldCategorize/StudentCategorizeGame.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentCategorizeGame = () => {
  const [gameSet, setGameSet] = useState(null);
  const [level, setLevel] = useState("easy");
  const [dropped, setDropped] = useState({}); // { image_url -> bag_label }
  const [dragItem, setDragItem] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  const levelLabels = { easy: "පහසු", medium: "මධ්‍යම", hard: "අපහසු" };

  useEffect(() => {
    fetchSet("easy");
  }, []);

  const fetchSet = async (lvl) => {
    setLoading(true);
    setResult(null);
    setError("");
    setDropped({});
    setDragItem(null);
    setShowWarning(false);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/rld_categorize/get_set/${lvl}`,
      );
      setGameSet(res.data);
      setLevel(lvl);
    } catch (err) {
      setError(
        err.response?.status === 404
          ? `"${levelLabels[lvl]}" මට්ටමට තවම කට්ටල නොමැත.`
          : "දෝෂයකි. නැවත උත්සාහ කරන්න.",
      );
      setGameSet(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (bagLabel) => {
    if (!dragItem || result) return;
    setDropped((prev) => ({ ...prev, [dragItem]: bagLabel }));
    setDragItem(null);
    setShowWarning(false);
  };

  const removeFromBag = (image_url) => {
    if (result) return;
    setDropped((prev) => {
      const u = { ...prev };
      delete u[image_url];
      return u;
    });
  };

  const handleSubmit = async () => {
    if (!gameSet) return;
    const placedCount = Object.keys(dropped).length;
    if (placedCount < gameSet.options.length) {
      setShowWarning(true);
      return;
    }

    const answers = gameSet.options.map((o) => ({
      image_url: o.image_url,
      dropped_bag: dropped[o.image_url] || "",
    }));

    try {
      const res = await axios.post(
        "http://localhost:5000/api/rld_categorize/submit",
        { set_id: gameSet.set_id, answers },
      );
      setResult(res.data);
      setScore((s) => s + res.data.correct);
      setTotalItems((t) => t + res.data.total);
    } catch (err) {
      console.error(err);
    }
  };

  // Helper: get feedback for a specific image after submit
  const getFeedback = (image_url) => {
    if (!result) return null;
    return result.feedback.find((f) => f.image_url === image_url);
  };

  const allPlaced =
    gameSet && Object.keys(dropped).length === gameSet.options.length;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-indigo-200">
        <p className="text-lg font-semibold text-indigo-700">පූරණය වෙමින්..</p>
      </div>
    );

  return (
    <div className="font-sans min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-5xl border-4 border-indigo-300 rounded-3xl shadow-2xl bg-white p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-indigo-800">
            වර්ගීකරණ ක්‍රියාකාරකම
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            රූපය නිවැරදි බෑගයට ඇදගෙන දමන්න
          </p>
        </div>

        {/* Level tabs */}
        <div className="flex justify-center gap-4 mb-6">
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
          <div className="text-center py-10">
            <p className="text-red-500 font-semibold">{error}</p>
            <p className="text-gray-400 text-sm mt-1">වෙනත් මට්ටමක් තෝරන්න.</p>
          </div>
        )}

        {!error && gameSet && (
          <>
            {/* Instruction */}
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-center mb-6">
              <p className="text-xs text-amber-600 font-semibold mb-1 uppercase tracking-wide">
                උපදෙස
              </p>
              <p className="text-lg font-bold text-amber-900">
                {gameSet.instruction}
              </p>
            </div>

            {/* Bags row */}
            <div
              className={`grid gap-4 mb-6 ${gameSet.bags.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}
            >
              {gameSet.bags.map((bag) => {
                const itemsInBag = gameSet.options.filter(
                  (o) => dropped[o.image_url] === bag.label,
                );
                return (
                  <div
                    key={bag.label}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(bag.label)}
                    className={`rounded-2xl border-2 border-dashed p-3 transition min-h-[200px] flex flex-col items-center
                      ${dragItem ? "border-indigo-500 bg-indigo-50 scale-[1.01]" : "border-gray-300 bg-gray-50"}`}
                  >
                    {/* Bag image + label */}
                    <img
                      src={bag.image_url}
                      alt={bag.label}
                      draggable={false}
                      className="w-24 h-24 object-contain mb-2 drop-shadow-md"
                    />
                    <p className="font-bold text-indigo-700 text-base mb-3">
                      {bag.label}
                    </p>

                    {/* Items dropped into this bag */}
                    <div className="flex flex-wrap justify-center gap-2 w-full">
                      {itemsInBag.map((opt) => {
                        const fb = getFeedback(opt.image_url);
                        return (
                          <div
                            key={opt.image_url}
                            className="relative"
                            onClick={() => removeFromBag(opt.image_url)}
                            title={result ? "" : "Click to remove"}
                          >
                            <img
                              src={opt.image_url}
                              alt="item"
                              draggable={false}
                              className={`w-16 h-16 object-cover rounded-xl shadow border-2 transition ${
                                result
                                  ? fb?.is_correct
                                    ? "border-green-500 opacity-100"
                                    : "border-red-500 opacity-80"
                                  : "border-indigo-300 cursor-pointer hover:border-red-400"
                              }`}
                            />
                            {/* ✅ / ❌ badge after submit */}
                            {result && (
                              <span
                                className={`absolute -top-1 -right-1 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow ${
                                  fb?.is_correct
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
                                }`}
                              >
                                {fb?.is_correct ? "✓" : "✗"}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Option tray */}
            <div>
              <p className="text-center font-medium text-gray-700 mb-3">
                විකල්ප — ඇදගෙන බෑගයට දමන්න:
              </p>
              <div
                className={`flex flex-wrap justify-center gap-4 p-4 rounded-2xl border-2 border-indigo-200 bg-indigo-50 min-h-[100px] ${
                  dragItem ? "border-indigo-400" : ""
                }`}
              >
                {gameSet.options
                  .filter((o) => dropped[o.image_url] === undefined)
                  .map((opt) => (
                    <img
                      key={opt.image_url}
                      src={opt.image_url}
                      alt="option"
                      draggable={!result}
                      onDragStart={() => setDragItem(opt.image_url)}
                      className="w-20 h-20 object-cover rounded-2xl shadow-md border-2 border-indigo-300 bg-white cursor-grab hover:border-indigo-600 hover:scale-105 transition-all"
                    />
                  ))}
                {gameSet.options.every(
                  (o) => dropped[o.image_url] !== undefined,
                ) && (
                  <p className="text-sm text-gray-400 italic self-center">
                    සියලු රූප බෑගවලට දමා ඇත ✓
                  </p>
                )}
              </div>
            </div>

            {/* Warning */}
            {showWarning && !allPlaced && (
              <p className="text-red-500 text-sm mt-3 text-center">
                ඉදිරිපත් කිරීමට පෙර සියලු රූප බෑගවලට දමන්න.
              </p>
            )}

            {/* Submit */}
            {!result && (
              <div className="flex justify-center mt-5">
                <button
                  onClick={handleSubmit}
                  disabled={!allPlaced}
                  className={`py-2 px-10 rounded-lg shadow-md font-semibold transition ${
                    allPlaced
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  ඉදිරිපත් කරන්න
                </button>
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="mt-5 p-4 rounded-xl bg-green-100 text-green-800 font-semibold text-center border border-green-300">
                <p>ලකුණු: {result.score}%</p>
                <p>
                  {result.correct} / {result.total} නිවැරදියි
                </p>
              </div>
            )}

            {/* Next */}
            {result && (
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                <button
                  onClick={() => fetchSet(level)}
                  className="py-2 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition"
                >
                  තවත් එකක් →
                </button>
                {["easy", "medium", "hard"]
                  .filter((l) => l !== level)
                  .map((l) => (
                    <button
                      key={l}
                      onClick={() => fetchSet(l)}
                      className="py-2 px-5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
                    >
                      {levelLabels[l]}
                    </button>
                  ))}
              </div>
            )}

            {/* Score footer */}
            <div className="mt-6 text-indigo-700 font-semibold text-center">
              ලකුණු: {score} / {totalItems}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentCategorizeGame;
