import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Import all images statically
// Q1–Q4 (PNG)
import L1Q1 from "../../Assets/visualD/L1Q1.png";
import L1Q1A1 from "../../Assets/visualD/L1Q1A1.png";
import L1Q1A2 from "../../Assets/visualD/L1Q1A2.png";
import L1Q1A3 from "../../Assets/visualD/L1Q1A3.png";
import L1Q1A4 from "../../Assets/visualD/L1Q1A4.png";

import L1Q2 from "../../Assets/visualD/L1Q2.png";
import L1Q2A1 from "../../Assets/visualD/L1Q2A1.png";
import L1Q2A2 from "../../Assets/visualD/L1Q2A2.png";
import L1Q2A3 from "../../Assets/visualD/L1Q2A3.png";
import L1Q2A4 from "../../Assets/visualD/L1Q2A4.png";

import L1Q3 from "../../Assets/visualD/L1Q3.png";
import L1Q3A1 from "../../Assets/visualD/L1Q3A1.png";
import L1Q3A2 from "../../Assets/visualD/L1Q3A2.png";
import L1Q3A3 from "../../Assets/visualD/L1Q3A3.png";
import L1Q3A4 from "../../Assets/visualD/L1Q3A4.png";

import L1Q4 from "../../Assets/visualD/L1Q4.png";
import L1Q4A1 from "../../Assets/visualD/L1Q4A1.png";
import L1Q4A2 from "../../Assets/visualD/L1Q4A2.png";
import L1Q4A3 from "../../Assets/visualD/L1Q4A3.png";
import L1Q4A4 from "../../Assets/visualD/L1Q4A4.png";

// Q5–Q6 (JPG)
import L1Q5Q5 from "../../Assets/visualD/L1Q5Q5.jpg";
import L1Q5A1 from "../../Assets/visualD/L1Q5A1.jpg";
import L1Q5A2 from "../../Assets/visualD/L1Q5A2.jpg";
import L1Q5A3 from "../../Assets/visualD/L1Q5A3.jpg";
import L1Q5A4 from "../../Assets/visualD/L1Q5A4.jpg";

import L1Q6Q6 from "../../Assets/visualD/L1Q6Q6.jpg";
import L1Q6A1 from "../../Assets/visualD/L1Q6A1.jpg";
import L1Q6A2 from "../../Assets/visualD/L1Q6A2.jpg";
import L1Q6A3 from "../../Assets/visualD/L1Q6A3.jpg";
import L1Q6A4 from "../../Assets/visualD/L1Q6A4.jpg";


// ✅ Level 1 questions
const level1Questions = [
  { questionImg: L1Q1, answers: [L1Q1A1, L1Q1A2, L1Q1A3, L1Q1A4], correctAnswer: 2, instruction: "🎨 නිවැරදි අකුර තෝරන්න" },
  { questionImg: L1Q2, answers: [L1Q2A1, L1Q2A2, L1Q2A3, L1Q2A4], correctAnswer: 2, instruction: "🎨 නිවැරදි අකුර තෝරන්න" },
  { questionImg: L1Q3, answers: [L1Q3A1, L1Q3A2, L1Q3A3, L1Q3A4], correctAnswer: 1, instruction: "🎨 නිවැරදි අකුර තෝරන්න" },
  { questionImg: L1Q4, answers: [L1Q4A1, L1Q4A2, L1Q4A3, L1Q4A4], correctAnswer: 2, instruction: "🎨 නිවැරදි අංකය තෝරන්න" },
  { questionImg: L1Q5Q5, answers: [L1Q5A1, L1Q5A2, L1Q5A3, L1Q5A4], correctAnswer: 1, instruction: "🎨 නිවැරදි හැඩතල තෝරන්න" },
  { questionImg: L1Q6Q6, answers: [L1Q6A1, L1Q6A2, L1Q6A3, L1Q6A4], correctAnswer: 0, instruction: "🎨 නිවැරදි පිළිතුර තෝරන්න" },
];

export default function DiscriminationQuestionLevel1() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [allAnswers, setAllAnswers] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const current = level1Questions[currentIndex];

  const handleSelect = (index) => setSelectedAnswer(index);

  const handleNext = () => {
    if (selectedAnswer === null) {
      alert("කරුණාකර පිළිතුරු තෝරන්න! 👆");
      return;
    }

    const score = selectedAnswer === current.correctAnswer ? 3 : 0;
    const newTotal = totalScore + score;
    setTotalScore(newTotal);

    // Store answer
    const updatedAnswers = [...allAnswers, selectedAnswer];
    setAllAnswers(updatedAnswers);

    if (currentIndex < level1Questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    } else {
      // ✅ All questions answered - save Level 1 data
      const submissionData = JSON.parse(localStorage.getItem("submissionData") || "{}");
      
      // Save individual answers (0-indexed)
      submissionData.L1Q1 = updatedAnswers[0];
      submissionData.L1Q2 = updatedAnswers[1];
      submissionData.L1Q3 = updatedAnswers[2];
      submissionData.L1Q4 = updatedAnswers[3];
      submissionData.L1Q5 = updatedAnswers[4];
      submissionData.L1Q6 = updatedAnswers[5];
      
      // Save total marks
      submissionData["Total Marks"] = newTotal;
      submissionData["Marks(Level 1)"] = newTotal;
      
      localStorage.setItem("submissionData", JSON.stringify(submissionData));
      setShowPopup(true);
    }
  };

  const handleFinish = () => {
    setShowPopup(false);
    navigate("/discriminationL2");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-12 max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">🎯 Level 1 Discrimination Test</h1>
        <p className="text-xs text-gray-400 mb-4">
          ගැටළුව {currentIndex + 1} / {level1Questions.length}
        </p>
        <p className="text-lg text-gray-700 mb-6">{current.instruction}</p>

        <div className="mb-6 flex justify-center">
          <img src={current.questionImg} alt="Question" className="max-w-sm h-auto rounded-xl shadow-lg" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {current.answers.map((img, index) => (
            <label
              key={index}
              className={`relative border-4 rounded-2xl p-2 cursor-pointer transition-all transform hover:scale-105 ${
                selectedAnswer === index
                  ? "border-green-500 bg-green-50 shadow-lg scale-105"
                  : "border-gray-300 hover:border-blue-400"
              }`}
            >
              <input
                type="radio"
                name="answer"
                className="hidden"
                checked={selectedAnswer === index}
                onChange={() => handleSelect(index)}
              />
              <img src={img} alt={`Answer ${index + 1}`} className="w-32 h-32 object-cover rounded-lg shadow mx-auto" />
              {selectedAnswer === index && (
                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  ✓
                </div>
              )}
            </label>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-4 rounded-2xl transition-all transform hover:scale-105 text-xl shadow-lg"
        >
          🎉 ඊළඟට යන්න!
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Level 1 සම්පූර්ණ ලකුණු</h2>
            <p className="text-xl text-gray-800 mb-6">ඔබගේ ලකුණු: {totalScore} / 18</p>
            <button
              onClick={handleFinish}
              className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold rounded-2xl shadow-lg transition-all"
            >
              ඊළඟට Level 2 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}