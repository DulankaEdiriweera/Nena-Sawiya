import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Level3ShapeMemory() {
  const [timeLeft, setTimeLeft] = useState(30);
  const [questionImage, setQuestionImage] = useState(null);
  const [flash, setFlash] = useState(false);
  const navigate = useNavigate();

  // Load the question image
  useEffect(() => {
    const loadImage = async () => {
      try {
        const img = await import("../../Assets/visualD/level3/L3Q.png");
        setQuestionImage(img.default);
      } catch (error) {
        console.error("Image Load Error:", error);
      }
    };
    loadImage();
  }, []);

  // Timer countdown + flash
  useEffect(() => {
    if (timeLeft <= 0) {
      setFlash(true);
      localStorage.setItem("L3Time", 30);
      setTimeout(() => {
        alert("🎉 කාලය ඉවරයි! දැන් ප්‍රශ්න වලට පිළිතුරු දෙන්න!");
      }, 1200);
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const isWarning = timeLeft <= 10;

  const handleNext = () => {
    localStorage.setItem("L3Time", 30 - timeLeft);
    localStorage.setItem("L3Score", 0);
    navigate("/discriminationL3p2");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Floating Decorations */}
      <div className="absolute top-10 left-10 text-5xl animate-bounce opacity-20">🎨</div>
      <div className="absolute top-20 right-10 text-5xl animate-bounce opacity-20" style={{ animationDelay: '0.3s' }}>⭐</div>
      <div className="absolute bottom-20 right-20 text-5xl animate-bounce opacity-20" style={{ animationDelay: '0.6s' }}>🌟</div>
      <div className="absolute bottom-10 left-20 text-5xl animate-bounce opacity-20" style={{ animationDelay: '0.9s' }}>🎯</div>

      {/* 🔹 WIDER CARD */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 max-w-5xl w-full text-center relative z-10">

        {/* Title */}
        <div className="mb-5">
          <div className="text-5xl mb-2">🧠💭</div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
            මතක ක්‍රීඩාව
          </h1>
          <h2 className="text-lg md:text-xl font-semibold text-purple-500">
            Shape Memory Challenge - Level 3
          </h2>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-5 mb-5 border-4 border-blue-300">
          <p className="text-base md:text-lg text-gray-800 font-semibold leading-relaxed">
            📸 මෙම පින්තූරය හොඳින් බලන්න!<br />
            ⏰ ඔබට <span className="text-purple-600 font-bold">30 තත්පර</span> කාලය ඇත<br />
            🧠 සියලුම දත්ත මතක තබාගන්න<br />
            ✨ කාලය අවසන් වූ විට, ඊළඟ පිළිතුරු පියවර සඳහා යන්න
          </p>
        </div>

        {/* Timer */}
        <div className="mb-5">
          <div
            className={`inline-block px-6 py-3 rounded-full shadow-lg transition-all ${
              isWarning
                ? "bg-gradient-to-r from-red-400 to-orange-400 animate-pulse scale-105"
                : "bg-gradient-to-r from-green-400 to-blue-400"
            }`}
          >
            <div className={`text-4xl md:text-5xl font-bold text-white ${flash ? "animate-bounce" : ""}`}>
              ⏱️ {timeLeft}
            </div>
            <p className="text-white font-semibold text-xs mt-1">
              {isWarning ? "⚠️ ඉක්මනින් බලන්න!" : "තත්පර ඉතිරියි"}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-5 bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          ></div>
        </div>

        {/* Question Image */}
        <div className="bg-gradient-to-br from-yellow-200 to-pink-200 rounded-3xl p-5 shadow-xl">
          <div className="bg-white rounded-2xl p-3 shadow-inner">
            {questionImage ? (
              <img
                src={questionImage}
                alt="Memory Challenge"
                className="max-w-lg w-full h-auto mx-auto rounded-xl border-4 border-yellow-300"
              />
            ) : (
              <div className="h-56 flex flex-col items-center justify-center text-gray-400">
                <div className="text-5xl mb-3 animate-spin">⏳</div>
                <p className="font-semibold">පින්තූරය පූරණය වෙමින්...</p>
              </div>
            )}
          </div>
        </div>

        {/* Fun emojis */}
        <div className="mt-5 flex justify-center gap-3 text-3xl">
          <span className="animate-bounce">🎈</span>
          <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>🌈</span>
          <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>⭐</span>
          <span className="animate-bounce" style={{ animationDelay: "0.6s" }}>🎨</span>
        </div>

        {/* NEXT BUTTON */}
        <button
          onClick={handleNext}
          className="mt-6 px-8 py-3 bg-purple-600 text-white rounded-2xl text-xl font-bold shadow-lg hover:bg-purple-700 transition-all"
        >
          Next ➜
        </button>

      </div>
    </div>
  );
}
