import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


import L3A1 from "../../Assets/visualD/level3/L3A1.jpg";
import L3A2 from "../../Assets/visualD/level3/L3A2.jpg";
import L3A3 from "../../Assets/visualD/level3/L3A3.jpg";
import L3A4 from "../../Assets/visualD/level3/L3A4.jpg";
import L3A5 from "../../Assets/visualD/level3/L3A5.jpg";
import L3A6 from "../../Assets/visualD/level3/L3A6.jpg";
import L3A7 from "../../Assets/visualD/level3/L3A7.jpg";
import L3A8 from "../../Assets/visualD/level3/L3A8.jpg";
import L3A9 from "../../Assets/visualD/level3/L3A9.jpg";
import L3A10 from "../../Assets/visualD/level3/L3A10.jpg";
import Header from "../../Components/Header";

export default function DiscriminationL3p2() {
  const navigate = useNavigate();

  const [selected, setSelected] = useState([]);
  const [title, setTitle] = useState("ඔබ මතක තබාගත් අයිතම තෝරන්න");
  const [subtitle, setSubtitle] = useState("Select the items you remember from the image");
  const [instructions, setInstructions] = useState("පහත පින්තූර වලින්, මතක ඇති අයිතම තෝරන්න");

  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const timerRef = useRef(null);

  const images = [L3A1, L3A2, L3A3, L3A4, L3A5, L3A6, L3A7, L3A8, L3A9, L3A10];

  const correctIndexes = [2, 3, 4, 5, 6, 7];
  const marksPerCorrect = 3;
  const marksPerIncorrect = -3;
  const bonusTimeThreshold = 150; // seconds
  const bonusMarks = 2;

  useEffect(() => {
    timerRef.current = setInterval(() => setSecondsElapsed(prev => prev + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const toggleSelection = (index) => {
    setSelected(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      alert("⚠️ කරුණාකර අයිතමයක්වත් තෝරන්න!");
      return;
    }

    let marks = 0;
    selected.forEach(i => marks += correctIndexes.includes(i) ? marksPerCorrect : marksPerIncorrect);
    const timeBonus = secondsElapsed <= bonusTimeThreshold ? bonusMarks : 0;
    marks = Math.max(0, marks + timeBonus);

    const submissionData = JSON.parse(localStorage.getItem("submissionData") || "{}");
    submissionData["Level 3 Question"] = selected.join(", ");
    submissionData["Marks (Level 3)"] = marks;
    submissionData["Marks For Time"] = timeBonus;
    submissionData["Time"] = secondsElapsed;

    const L1Score = parseInt(submissionData["Marks(Level 1)"]) || 0;
    const L2Score = parseInt(submissionData["Marks(Level 2)"]) || 0;
    submissionData["Total"] = L1Score + L2Score + marks;

    localStorage.setItem("submissionData", JSON.stringify(submissionData));
    navigate("/summary");
  };

  return (
    <div>
      <Header/>
      <div>
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-6 flex items-center justify-center">
      <div className="bg-white w-full max-w-5xl p-10 rounded-3xl shadow-2xl">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-center text-4xl font-bold text-purple-700 p-2 mb-2 border-2 border-transparent hover:border-purple-200 rounded"
        />
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full text-center text-lg text-purple-500 p-2 mb-6 border-2 border-transparent hover:border-purple-200 rounded"
        />

        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-5 rounded-2xl border-2 border-purple-200 shadow-md mb-8">
          <textarea
            rows="2"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full bg-transparent text-center text-xl font-semibold focus:outline-none resize-none"
          />
        </div>

        
        <div className="text-center mb-4 text-2xl font-bold text-blue-600">
          ⏱️ Time: {secondsElapsed}s
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {images.map((src, index) => (
            <div
              key={index}
              onClick={() => toggleSelection(index)}
              className={`cursor-pointer rounded-3xl p-2 shadow-lg border-4 transition-all duration-300 ${
                selected.includes(index)
                  ? "border-purple-600 scale-105 shadow-xl"
                  : "border-transparent hover:border-purple-300"
              }`}
            >
              <img src={src} alt={`Choice ${index + 1}`} className="rounded-2xl w-full h-32 object-contain" />
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={handleSubmit}
            className="px-16 py-4 bg-gradient-to-r from-green-400 to-green-600 text-white text-2xl font-bold rounded-full shadow-xl hover:scale-105 transition-all"
          >
            Submit ✔️
          </button>
        </div>
      </div>
    </div>
      </div>
    </div>
  );
}
