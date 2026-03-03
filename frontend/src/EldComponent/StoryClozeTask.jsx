import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Components/Header";

const StoryClozeTask = () => {
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filledBlanks, setFilledBlanks] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Fisher-Yates shuffle
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/story_bp/all"
        );

        // Shuffle stories
        const shuffledStories = shuffleArray(res.data);

        // Also shuffle options inside each story
        shuffledStories.forEach((story) => {
          story.options = shuffleArray(story.options);
        });

        setStories(shuffledStories);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchStories();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-indigo-200">
        <p className="text-lg font-semibold text-indigo-700">
          කථා පූරණය වෙමින්..
        </p>
      </div>
    );

  if (!stories.length)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-indigo-200">
        <p className="text-lg font-semibold text-red-500">
          කථා නොමැත.
        </p>
      </div>
    );

  const currentStory = stories[currentIndex];
  const textParts = currentStory.text_with_blanks.split("____");

  const allBlanksFilled =
    filledBlanks.length === currentStory.blanks_answers.length &&
    filledBlanks.every((b) => b && b.trim() !== "");

  const handleDragStart = (e, word) => {
    e.dataTransfer.setData("word", word);
  };

  const handleDrop = (e, index) => {
    if (showResults) return;
    e.preventDefault();
    const word = e.dataTransfer.getData("word");

    if (filledBlanks.includes(word)) return;

    const newBlanks = [...filledBlanks];
    newBlanks[index] = word;
    setFilledBlanks(newBlanks);
    setShowWarning(false);
  };

  const handleClearBlank = (index) => {
    if (showResults) return;
    const newBlanks = [...filledBlanks];
    newBlanks[index] = "";
    setFilledBlanks(newBlanks);
  };

  const handleSubmit = () => {
    if (!allBlanksFilled) {
      setShowWarning(true);
      return;
    }

    let correctCount = 0;
    currentStory.blanks_answers.forEach((ans, i) => {
      if (filledBlanks[i] === ans) correctCount++;
    });

    setScore(score + correctCount);
    setShowResults(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < stories.length) {
      setCurrentIndex(currentIndex + 1);
      setFilledBlanks([]);
      setShowResults(false);
      setShowWarning(false);
    }
  };

  const totalBlanks = stories.reduce(
    (total, story) => total + story.blanks_answers.length,
    0
  );

  return (
    <div>
      <div>
        <Header/>
      </div>
      <div className="font-sans min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 flex flex-col items-center justify-center py-10 px-4">
      {/* OUTER CONTAINER WITH BORDER + SHADOW */}
      <div className="w-full max-w-6xl border-4 border-indigo-300 rounded-3xl shadow-2xl bg-white p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-indigo-800">
            කතන්දර සම්පූර්ණ කිරීමේ ක්‍රියාකාරකම
          </h2>
          <p className="text-gray-600 mt-2">
            කතාවට සවන් දෙන්න. නිවැරදි පිළිතුර ඇදගෙන ගොස් සියලු හිස්තැන් පුරවන්න.
          </p>
          <p className="mt-2 text-sm text-indigo-700 font-medium">
            කතන්දර {currentIndex + 1} / {stories.length}
          </p>
        </div>

        {/* Inner Card */}
        <div className="rounded-2xl p-6 flex flex-col lg:flex-row gap-10">
          {/* VIDEO SECTION WITH BORDER + SHADOW */}
          <div className="flex-1 flex justify-center">
            <div className="p-2">
              <video
                controls
                src={`http://localhost:5000${currentStory.video_url}`}
                className="w-full max-w-lg rounded-xl shadow-md"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex-1">
            {/* Story Text */}
            <div className="bg-gray-50 border border-indigo-400 p-6 rounded-xl text-gray-800 text-lg leading-relaxed shadow-inner">
              {textParts.map((part, i) => (
                <span key={i}>
                  {part}
                  {i < textParts.length - 1 && (
                    <span
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, i)}
                      onClick={() => handleClearBlank(i)}
                      className={`inline-block mx-2 px-4 py-2 border-b-2 min-w-[90px] text-center font-medium cursor-pointer
                        ${
                          showResults
                            ? filledBlanks[i] ===
                              currentStory.blanks_answers[i]
                              ? "border-green-500 text-green-600"
                              : "border-red-400 text-red-500"
                            : "border-indigo-400"
                        }`}
                    >
                      {filledBlanks[i] || "_____" }
                    </span>
                  )}
                </span>
              ))}
            </div>

            {showWarning && !allBlanksFilled && (
              <p className="text-red-500 text-sm mt-2">
                ඉදිරිපත් කිරීමට පෙර සියලු හිස්තැන් පුරවන්න.
              </p>
            )}

            {/* Options */}
            <div className="mt-6">
              <p className="font-medium text-gray-700 mb-3">
                පිළිතුරු:
              </p>

              <div className="flex flex-wrap gap-3">
                {currentStory.options
                  .filter((opt) => !filledBlanks.includes(opt))
                  .map((opt, i) => (
                    <div
                      key={i}
                      draggable={!showResults}
                      onDragStart={(e) => handleDragStart(e, opt)}
                      className="bg-indigo-100 text-indigo-800 border border-indigo-300 px-4 py-2 rounded-lg cursor-grab hover:bg-indigo-200 transition shadow-sm"
                    >
                      {opt}
                    </div>
                  ))}
              </div>
            </div>

            {/* Buttons */}
            {!showResults ? (
              <button
                onClick={handleSubmit}
                disabled={!allBlanksFilled}
                className={`mt-6 py-2 px-6 rounded-lg shadow-md font-semibold transition
                  ${
                    allBlanksFilled
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                ඉදිරිපත් කරන්න
              </button>
            ) : currentIndex + 1 < stories.length ? (
              <button
                onClick={handleNext}
                className="mt-6 py-2 px-6 rounded-lg shadow-md font-semibold bg-green-600 hover:bg-green-700 text-white transition"
              >
                ඊළඟ කතාව
              </button>
            ) : (
              <div className="mt-6 text-green-600 font-bold text-lg">
                සම්පූර්ණ කර ඇත 🎉
              </div>
            )}

            {/* Score */}
            <div className="mt-6 text-indigo-700 font-semibold">
              Score: {score} / {totalBlanks}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default StoryClozeTask;