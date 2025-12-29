import React, { useEffect, useState } from "react";

export default function FinalSummary() {
  const [scores, setScores] = useState({
    L1: 0,
    L2: 0,
    L3: 0,
    time: 0,
    total: 0,
  });
  const [predictedLevel, setPredictedLevel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load submission data from localStorage
    const submissionData = JSON.parse(localStorage.getItem("submissionData") || "{}");

    // Safely parse numeric values
    const parseScore = (val) => parseInt(val) || 0;

    const L1 = parseScore(submissionData["Marks(Level 1)"]);
    const L2 = parseScore(submissionData["Marks(Level 2)"]);
    const L3 = parseScore(submissionData["Marks (Level 3)"]);
    const time = parseScore(submissionData["Time"]);
    const total = parseScore(submissionData["Total"]);

    setScores({ L1, L2, L3, time, total });

    // ✅ Build complete payload matching EXACT backend format
    const payload = [
      {
        // Level 1 answers (0-indexed from user selection)
        L1Q1: parseScore(submissionData.L1Q1),
        L1Q2: parseScore(submissionData.L1Q2),
        L1Q3: parseScore(submissionData.L1Q3),
        L1Q4: parseScore(submissionData.L1Q4),
        L1Q5: parseScore(submissionData.L1Q5),
        L1Q6: parseScore(submissionData.L1Q6),

        // Level 1 total marks
        "Total Marks": L1,

        // Level 2 - Shape counts (EXACT field names)
        "Shape 1": parseScore(submissionData["Shape 1"]),
        "shape 2": parseScore(submissionData["shape 2"]),
        "shape 3": parseScore(submissionData["shape 3"]),
        "shape 4": parseScore(submissionData["shape 4"]),
        "Marks(Level 2)": L2,

        // Level 3 (EXACT field names)
        "Level 3 Question": submissionData["Level 3 Question"] || "",
        "Marks (Level 3)": L3,
        "Marks For Time": parseScore(submissionData["Marks For Time"]),
        "Total": total,
        "Time": time,
      }
    ];

    console.log("📤 Sending payload to backend:", JSON.stringify(payload, null, 2));

    // Send payload to backend
    fetch("http://127.0.0.1:5000/predictVDH", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Backend response:", data);
        setPredictedLevel(data.predictions?.[0] || "N/A");
      })
      .catch((err) => {
        console.error("❌ Prediction error:", err.message);
        setPredictedLevel("Error fetching prediction");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRestart = () => {
    localStorage.clear();
    window.location.href = "/visual";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-2xl w-full">
        {/* Header with friendly stars */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">🌟</div>
          <h1 className="text-4xl font-bold text-purple-600 mb-2">ඔබේ ප්‍රතිඵල</h1>
          <p className="text-lg text-gray-600">Your Results</p>
        </div>

        {/* Score Cards */}
        <div className="space-y-4 mb-6">
          {/* Level 1 */}
          <div className="bg-gradient-to-r from-green-100 to-green-200 p-5 rounded-2xl border-4 border-green-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">📚</span>
                <div>
                  <p className="text-lg font-bold text-green-800">මට්ටම 1 - Level 1</p>
                  <p className="text-sm text-green-700">Basic Questions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-700">{scores.L1}</p>
                <p className="text-sm text-green-600">/ 18</p>
              </div>
            </div>
          </div>

          {/* Level 2 */}
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-5 rounded-2xl border-4 border-blue-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🔷</span>
                <div>
                  <p className="text-lg font-bold text-blue-800">මට්ටම 2 - Level 2</p>
                  <p className="text-sm text-blue-700">Shape Counting</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-700">{scores.L2}</p>
                <p className="text-sm text-blue-600">/ 12</p>
              </div>
            </div>
          </div>

          {/* Level 3 */}
          <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-5 rounded-2xl border-4 border-purple-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🎨</span>
                <div>
                  <p className="text-lg font-bold text-purple-800">මට්ටම 3 - Level 3</p>
                  <p className="text-sm text-purple-700">Creative Drawing</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-purple-700">{scores.L3}</p>
                <p className="text-sm text-purple-600">/ 20</p>
              </div>
            </div>
          </div>

          {/* Time */}
          <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-5 rounded-2xl border-4 border-orange-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">⏱️</span>
                <div>
                  <p className="text-lg font-bold text-orange-800">ගත වූ කාලය - Time</p>
                  <p className="text-sm text-orange-700">Completion Time</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-orange-700">{scores.time}</p>
                <p className="text-sm text-orange-600">seconds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Score */}
        <div className="bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200 p-6 rounded-3xl border-4 border-yellow-400 mb-6 shadow-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-900 mb-2">🏆 සම්පූර්ණ ලකුණු</p>
            <p className="text-sm text-yellow-800 mb-3">Total Marks</p>
            <p className="text-5xl font-extrabold text-yellow-700">{scores.total} / 50</p>
          </div>
        </div>

        {/* Prediction Result */}
        {loading ? (
          <div className="bg-blue-50 p-6 rounded-2xl border-3 border-blue-200 mb-6">
            <div className="text-center">
              <div className="text-5xl mb-3 animate-bounce">🔮</div>
              <p className="text-xl font-bold text-blue-600">ඔබේ මට්ටම සොයමින්...</p>
              <p className="text-sm text-blue-500 mt-2">Finding your level...</p>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 p-6 rounded-3xl border-4 border-purple-300 mb-6 shadow-lg">
            <div className="text-center">
              <div className="text-5xl mb-3">⭐</div>
              <p className="text-xl font-bold text-purple-700 mb-2">ඔබේ කාර්ය සාධන මට්ටම</p>
              <p className="text-sm text-purple-600 mb-4">Your Performance Level</p>
              <div className="bg-white p-4 rounded-2xl shadow-inner">
                <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  {predictedLevel}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Restart Button */}
        <button
          onClick={handleRestart}
          className="w-full px-8 py-5 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-white text-2xl font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-4 border-white"
        >
          <span className="text-3xl mr-2">🏠</span>
          නැවත ආරම්භ කරන්න / Restart
        </button>
      </div>
    </div>
  );
}