import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Components/Header";

const SequencingTask = () => {
  const [activities, setActivities] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [availableImages, setAvailableImages] = useState([]);
  const [placedImages, setPlacedImages] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Shuffle helper
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchActivities = async (level, n) => {
    const res = await axios.get(
      `http://localhost:5000/api/sequencing_bp/level/${level}`,
    );
    const shuffled = shuffleArray(res.data);
    return shuffled.slice(0, n);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const easy = await fetchActivities("EASY", 2);
      const medium = await fetchActivities("MEDIUM", 2);
      const hard = await fetchActivities("HARD", 2);

      const all = [...easy, ...medium, ...hard];
      setActivities(all);

      if (all.length > 0) {
        const shuffledImages = shuffleArray(all[0].images);
        setAvailableImages(shuffledImages);
        setPlacedImages(new Array(shuffledImages.length).fill(null));
      }

      setLoading(false);
    };

    loadData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-indigo-200">
        <p className="text-lg font-semibold text-indigo-700">
          ක්‍රියාකාරකම් පූරණය වෙමින් පවතී...
        </p>
      </div>
    );

  const current = activities[currentIndex];

  const isComplete = placedImages.every((img) => img !== null);

  // 🟢 StoryCloze-style drag
  const handleDragStart = (e, img) => {
    e.dataTransfer.setData("imageId", img.id);
  };

  const handleDrop = (e, index) => {
    if (submitted) return;

    e.preventDefault();
    const imageId = e.dataTransfer.getData("imageId");

    const imageObj = current.images.find(
      (img) => img.id.toString() === imageId,
    );

    if (!imageObj) return;

    // Prevent duplicate placing
    if (placedImages.some((img) => img?.id === imageObj.id)) return;

    const newPlaced = [...placedImages];
    newPlaced[index] = imageObj;
    setPlacedImages(newPlaced);

    setShowWarning(false);
  };

  const handleClearBox = (index) => {
    if (submitted) return;

    const newPlaced = [...placedImages];
    newPlaced[index] = null;
    setPlacedImages(newPlaced);
  };

  const handleSubmit = () => {
    if (!isComplete) {
      setShowWarning(true);
      return;
    }

    setSubmitted(true);

    const correctOrder = current.correct_order;
    const userOrder = placedImages.map((img) => img?.id);

    let updatedScore = score;

    if (JSON.stringify(userOrder) === JSON.stringify(correctOrder)) {
      updatedScore = score + 1;
      setScore(updatedScore);
    }

    // If last activity → show final result
    if (currentIndex + 1 === activities.length) {
      setShowResults(true);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < activities.length) {
      const nextIndex = currentIndex + 1;
      const nextActivity = activities[nextIndex];

      setCurrentIndex(nextIndex);

      const shuffledImages = shuffleArray(nextActivity.images);
      setAvailableImages(shuffledImages);
      setPlacedImages(new Array(shuffledImages.length).fill(null));
      setSubmitted(false);
      setShowWarning(false);
    }
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl bg-white border-4 border-indigo-300 rounded-3xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-indigo-700">
            නිවැරදි අනුපිළිවෙල තෝරා ගැනීමේ ක්‍රියාකාරකම
          </h1>

          <p className="text-center mb-2 font-semibold text-indigo-600">
            Level: {current.level}
          </p>

          <p className="text-center mb-6 font-semibold text-lg">
            Score: {score}
          </p>

          <h2 className="text-xl font-semibold text-center mb-4">
            {current.title}
          </h2>

          {/* DROP BOXES */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {placedImages.map((img, index) => {
              let borderColor = "border-gray-400";

              if (submitted) {
                borderColor =
                  img && img.id === current.correct_order[index]
                    ? "border-green-500"
                    : "border-red-500";
              }

              return (
                <div
                  key={index}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, index)}
                  onClick={() => handleClearBox(index)}
                  className={`w-full h-full border-4 ${borderColor} rounded-xl flex items-center justify-center bg-gray-100 cursor-pointer`}
                >
                  {img ? (
                    <img
                      src={`http://localhost:5000${img.url}`}
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-400 text-xl p-6">මෙතනට දාන්න</span>
                  )}
                </div>
              );
            })}
          </div>

          {showWarning && !isComplete && (
            <p className="text-red-500 text-sm mb-4 text-center">
              ඉදිරිපත් කිරීමට පෙර කරුණාකර සියලුම කොටු පුරවන්න.
            </p>
          )}

          {/* DRAGGABLE IMAGES */}
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            {availableImages.map((img) => (
              <div
                key={img.id}
                draggable={!submitted}
                onDragStart={(e) => handleDragStart(e, img)}
                className="w-36 h-36 border-4 border-indigo-400 rounded-xl overflow-hidden cursor-grab hover:scale-105 transition"
              >
                <img
                  src={`http://localhost:5000${img.url}`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* BUTTONS */}
          {showResults ? (
            <div className="mt-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-3">
                🎉 සියලුම ක්‍රියාකාරකම් අවසන්!
              </div>
              <div className="text-xl font-semibold text-indigo-700">
                ලකුණු: {score} / {activities.length}
              </div>
            </div>
          ) : !submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!isComplete}
              className={`w-full py-3 rounded-xl font-semibold text-white ${
                isComplete
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              ඉදිරිපත් කරන්න
            </button>
          ) : (
            currentIndex + 1 < activities.length && (
              <button
                onClick={handleNext}
                className="w-full py-3 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700"
              >
                ඊළඟ ක්‍රියාකාරකම
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SequencingTask;
