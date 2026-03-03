import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";

export default function FinalSummary() {
  const [scores, setScores] = useState({
    L1: 0,
    L2: 0,
    L3: 0,
    time: 0,
    total: 0,
  });

  const [predictedLevel, setPredictedLevel] = useState(null);
  const [advice, setAdvice] = useState(null); // ✅ New state for advice
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const submissionData = JSON.parse(localStorage.getItem("submissionData") || "{}");
    const parseScore = (val) => parseInt(val) || 0;

    const L1 = parseScore(submissionData["Marks(Level 1)"]);
    const L2 = parseScore(submissionData["Marks(Level 2)"]);
    const L3 = parseScore(submissionData["Marks (Level 3)"]);
    const time = parseScore(submissionData["Time"]);
    const total = parseScore(submissionData["Total"]);

    setScores({ L1, L2, L3, time, total });

    const payload = [
      {
        L1Q1: parseScore(submissionData.L1Q1),
        L1Q2: parseScore(submissionData.L1Q2),
        L1Q3: parseScore(submissionData.L1Q3),
        L1Q4: parseScore(submissionData.L1Q4),
        L1Q5: parseScore(submissionData.L1Q5),
        L1Q6: parseScore(submissionData.L1Q6),
        "Total Marks": L1,
        "Shape 1": parseScore(submissionData["Shape 1"]),
        "shape 2": parseScore(submissionData["shape 2"]),
        "shape 3": parseScore(submissionData["shape 3"]),
        "shape 4": parseScore(submissionData["shape 4"]),
        "Marks(Level 2)": L2,
        "Level 3 Question": submissionData["Level 3 Question"] || "",
        "Marks (Level 3)": L3,
        "Marks For Time": parseScore(submissionData["Marks For Time"]),
        "Total": total,
        "Time": time,
      }
    ];

    console.log("📤 Sending payload to backend:", JSON.stringify(payload, null, 2));
    // ✅ Get the JWT token here
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:5000/predictVDH", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // send token in header
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Backend response:", data);
        setPredictedLevel(data.VD_Level || "N/A");
        setAdvice(data.Advice || null); // ✅ Capture advice
      })
      .catch((err) => {
        console.error("❌ Prediction error:", err.message);
        setPredictedLevel("Error fetching prediction");
        setAdvice(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRestart = () => {
    localStorage.clear();
    window.location.href = "/visual";
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-2xl w-full">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">🌟</div>
            <h1 className="text-4xl font-bold text-purple-600 mb-2">ඔබේ ප්‍රතිඵල</h1>
            <p className="text-lg text-gray-600">Your Results</p>
          </div>

          {/* Scores (reuse ScoreCard component) */}
          <div className="space-y-4 mb-6">
            <ScoreCard icon="📚" level="මට්ටම 1 - Level 1" description="Basic Questions" score={scores.L1} max={18} colors={["green-100","green-200","green-800"]}/>
            <ScoreCard icon="🔷" level="මට්ටම 2 - Level 2" description="Shape Counting" score={scores.L2} max={12} colors={["blue-100","blue-200","blue-800"]}/>
            <ScoreCard icon="🎨" level="මට්ටම 3 - Level 3" description="Creative Drawing" score={scores.L3} max={20} colors={["purple-100","purple-200","purple-800"]}/>
            <ScoreCard icon="⏱️" level="ගත වූ කාලය - Time" description="Completion Time" score={scores.time} max={null} colors={["orange-100","orange-200","orange-800"]}/>
          </div>

          {/* Total Score */}
          <div className="bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200 p-6 rounded-3xl border-4 border-yellow-400 mb-6 shadow-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-900 mb-2">🏆 සම්පූර්ණ ලකුණු</p>
              <p className="text-sm text-yellow-800 mb-3">Total Marks</p>
              <p className="text-5xl font-extrabold text-yellow-700">{scores.total} / 50</p>
            </div>
          </div>

          {/* Prediction + Advice */}
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
                <div className="bg-white p-4 rounded-2xl shadow-inner mb-2">
                  <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                    {predictedLevel}
                  </p>
                </div>
                {advice && (
                  <p className="text-md text-purple-700 mt-2">{advice}</p>
                )}
              </div>
            </div>
          )}

          {/* Restart */}
          <button
            onClick={handleRestart}
            className="w-full px-8 py-5 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-white text-2xl font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-4 border-white"
          >
            <span className="text-3xl mr-2">🏠</span>
            නැවත ආරම්භ කරන්න / Restart
          </button>
        </div>
      </div>
    </div>
  );
}

// --------------------
// Reusable ScoreCard component
// --------------------
function ScoreCard({ icon, level, description, score, max, colors }) {
  return (
    <div className={`bg-gradient-to-r from-${colors[0]} to-${colors[1]} p-5 rounded-2xl border-4 border-${colors[1]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{icon}</span>
          <div>
            <p className={`text-lg font-bold text-${colors[2]}`}>{level}</p>
            <p className={`text-sm text-${colors[2]}`}>{description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-3xl font-bold text-${colors[2]}`}>{score}</p>
          {max && <p className={`text-sm text-${colors[2]}`}>/ {max}</p>}
        </div>
      </div>
    </div>
  );
}
