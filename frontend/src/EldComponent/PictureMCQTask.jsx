import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Components/Header";

const PictureMCQTask = () => {
  const [mcqs, setMcqs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUserLevel = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:5000/api/eld/latest_level", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.latest_level;
  };

  const getAllowedLevels = (level) => {
    if (level === "දුර්වල") return ["EASY", "MEDIUM", "HARD"];
    if (level === "සාමාන්‍ය") return ["MEDIUM", "HARD"];
    if (level === "ඉතා හොදයි") return ["HARD"];
    return ["EASY", "MEDIUM", "HARD"];
  };

  const fetchMCQs = async (level) => {
    const res = await axios.get(
      `http://localhost:5000/api/picture_mcq/level/${level}`,
    );
    const shuffled = res.data.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
  };

  useEffect(() => {
    const loadMCQs = async () => {
      try {
        setLoading(true);

        //1. Get user level
        const level = await fetchUserLevel();

        //2. Convert to difficulty levels
        const allowedLevels = getAllowedLevels(level);

        //3. Fetch MCQs dynamically
        let allMCQs = [];

        for (let lvl of allowedLevels) {
          const data = await fetchMCQs(lvl);
          allMCQs = [...allMCQs, ...data];
        }

        setMcqs(allMCQs);
      } catch (err) {
        console.error("Error loading MCQs:", err);
        alert("ප්‍රශ්න ලබා ගැනීමේ දෝෂයක් ඇත");
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    loadMCQs();
  }, []);

  const handleAnswer = (option) => {
    if (selected) return;

    setSelected(option);

    if (option === mcqs[currentIndex].correct_answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < mcqs.length) {
      setCurrentIndex(currentIndex + 1);
      setSelected("");
    } else {
      alert(`ක්‍රියාකාරකම අවසන්!\nඔබේ ලකුණු: ${score}/${mcqs.length}`);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-indigo-200">
        <p className="text-lg font-semibold text-indigo-700">පූරණය වෙමින්...</p>
      </div>
    );

  const currentMCQ = mcqs[currentIndex];

  const levelMapSinhala = {
    EASY: "පහසු",
    MEDIUM: "මධ්‍යම",
    HARD: "අපහසු",
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 flex items-center justify-center px-4 py-10">
        {/* OUTER CONTAINER */}
        <div className="w-full max-w-3xl bg-white border-4 border-indigo-300 rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-indigo-800">
              පින්තූර බහුවරණ ක්‍රියාකාරකම්
            </h2>
            <p className="text-sm text-indigo-600 mt-1">
              ප්‍රශ්නය {currentIndex + 1} of {mcqs.length}
            </p>
            <p className="mt-3 font-semibold text-indigo-700">ලකුණු: {score}</p>
            <button
              className={`text-sm mt-1 px-4 py-1 rounded-full font-semibold shadow-md cursor-default
    ${
      currentMCQ.level === "EASY"
        ? "bg-green-200 text-green-800"
        : currentMCQ.level === "MEDIUM"
          ? "bg-yellow-200 text-yellow-800"
          : "bg-red-200 text-red-800"
    }
  `}
            >
              {levelMapSinhala[currentMCQ.level] || currentMCQ.level}
            </button>
          </div>

          {/* Image Section */}
          <div className="flex justify-center mb-6">
            <div className="border-4 border-indigo-400 rounded-2xl shadow-xl p-2 bg-indigo-50">
              <img
                src={`http://localhost:5000${currentMCQ.image_url}`}
                alt="MCQ"
                className="w-full max-w-md h-56 object-cover rounded-xl"
              />
            </div>
          </div>

          {/* Question */}
          <div className="text-center mb-6">
            <p className="text-lg font-medium text-gray-800">
              {currentMCQ.question}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {currentMCQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                disabled={!!selected}
                className={`py-2 px-4 rounded-xl border font-medium transition shadow-sm
                ${
                  selected === opt
                    ? opt === currentMCQ.correct_answer
                      ? "bg-green-500 text-white border-green-600"
                      : "bg-red-500 text-white border-red-600"
                    : "bg-indigo-100 text-indigo-800 border-indigo-300 hover:bg-indigo-200"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Next Button */}
          {selected && (
            <div className="text-center">
              <button
                onClick={handleNext}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition"
              >
                {currentIndex + 1 < mcqs.length
                  ? "ඊළඟ ප්‍රශ්නය"
                  : "ක්‍රියාකාරකම අවසන්"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PictureMCQTask;
