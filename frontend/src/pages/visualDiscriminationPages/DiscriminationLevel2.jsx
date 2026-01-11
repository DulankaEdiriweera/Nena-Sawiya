import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


import L2Q1 from "../../Assets/visualD/level2/L2Q1.jpg";
import L2A1 from "../../Assets/visualD/level2/L2A1.jpg";
import L2A2 from "../../Assets/visualD/level2/L2A2.jpg";
import L2A3 from "../../Assets/visualD/level2/L2A3.jpg";
import L2A4 from "../../Assets/visualD/level2/L2A4.jpg";
import Header from "../../Components/Header";

export default function ObjectCountingPageDiscrimination() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("🌟 වස්තු ගණන් කිරීමේ ක්‍රීඩාව");
  const [subtitle, setSubtitle] = useState("Object Counting Challenge - Level 2");
  const [instruction, setInstruction] = useState(
    "රූපයේ ඇති වස්තූන් ගණන් කර පහළ කොටුවේ ලියන්න! 👇"
  );

  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [totalScore, setTotalScore] = useState(0);

  const correctAnswers = [4, 6, 6, 4];
  const marksPerAnswer = 3;

  const loadedQuestionImage = L2Q1;
  const loadedAnswerImages = [L2A1, L2A2, L2A3, L2A4];

  const handleAnswerChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const updated = [...answers];
      updated[index] = value;
      setAnswers(updated);

      let score = 0;
      updated.forEach((ans, i) => {
        if (parseInt(ans) === correctAnswers[i]) score += marksPerAnswer;
      });
      setTotalScore(score);
    }
  };

  const goNext = () => {
    if (answers.some((ans) => ans === "")) {
      alert("⚠️ සියලුම පිළිතුරු පුරවන්න!");
      return;
    }

    const submissionData = JSON.parse(localStorage.getItem("submissionData") || "{}");
    submissionData["Shape 1"] = parseInt(answers[0]) || 0;
    submissionData["shape 2"] = parseInt(answers[1]) || 0;
    submissionData["shape 3"] = parseInt(answers[2]) || 0;
    submissionData["shape 4"] = parseInt(answers[3]) || 0;
    submissionData["Marks(Level 2)"] = totalScore;

    localStorage.setItem("submissionData", JSON.stringify(submissionData));
    navigate("/discriminationL3P1");
  };

  return (
    <div>
      <Header/>
      <div>
        <div className="min-h-screen w-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 p-4 relative overflow-x-auto">
      
      
      <div className="scale-90 origin-top">

        
        <div className="absolute top-10 left-10 text-5xl animate-bounce opacity-30">🦑</div>
        <div className="absolute top-20 right-20 text-5xl animate-bounce opacity-30" style={{ animationDelay: "0.5s" }}>🐟</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-bounce opacity-30" style={{ animationDelay: "1s" }}>🐸</div>
        <div className="absolute bottom-32 right-16 text-5xl animate-bounce opacity-30" style={{ animationDelay: "1.2s" }}>🦎</div>

        
        <div className="flex max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-10 relative z-10">
          
          
          <div className="flex-[3_3_0%] mr-5">
            <div className="text-center mb-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 w-full text-center p-1 border-2 border-transparent hover:border-purple-200 rounded focus:outline-none mb-1"
              />
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="text-lg text-purple-500 font-semibold w-full text-center p-1 border-2 border-transparent hover:border-purple-200 rounded focus:outline-none"
              />
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 mb-3 text-center border-4 border-blue-300">
              <textarea
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                className="w-full bg-transparent text-xl text-gray-800 font-bold focus:outline-none resize-none text-center"
                rows="2"
              />
            </div>

            <div className="mb-4 p-3 bg-green-100 rounded-xl text-green-800 font-bold text-base shadow-md text-center">
              🎯 Level 2 සම්පූර්ණ ලකුණු: {totalScore} / 12
            </div>

            <div className="bg-gradient-to-br from-yellow-200 to-orange-200 rounded-3xl p-4 shadow-xl">
              <h3 className="text-xl font-bold text-center mb-3 text-orange-700">📷 මෙම රූපය බලන්න!</h3>
              <div className="bg-white rounded-2xl p-3 shadow-inner flex justify-center">
                
                <img
                  src={loadedQuestionImage}
                  alt="Question"
                  className="w-full h-auto rounded-xl border-4 border-orange-300"
                />
              </div>
            </div>
          </div>

          
          <div className="flex-1 grid grid-cols-1 gap-4 justify-items-center">
            {answers.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-4 shadow-lg border-4 border-purple-200 hover:border-purple-400 transition-all transform hover:scale-105 w-52"
              >
                <div className="bg-white rounded-2xl p-2 mb-3 shadow flex justify-center">
                  
                  <img
                    src={loadedAnswerImages[index]}
                    alt={`Answer ${index + 1}`}
                    className="w-32 h-32 object-contain rounded-xl"
                  />
                </div>

                <input
                  type="number"
                  placeholder="පිළිතුර"
                  value={item}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="w-full p-2 text-lg font-bold text-center border-4 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 bg-white shadow-inner"
                />
                <div className="text-center mt-1 text-purple-600 font-semibold text-sm">
                  පිළිතුර {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        
        <div className="flex justify-center mt-4">
          <button
            onClick={goNext}
            className="px-10 py-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white text-xl font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all"
          >
            ඊළඟට යන්න 🚀
          </button>
        </div>

        
        <div className="flex justify-center gap-4 mt-6 text-4xl">
          <span className="animate-bounce">🦑</span>
          <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>🐟</span>
          <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>🐸</span>
          <span className="animate-bounce" style={{ animationDelay: "0.6s" }}>🦎</span>
        </div>

      </div>
    </div>
      </div>
    </div>
  );
}
