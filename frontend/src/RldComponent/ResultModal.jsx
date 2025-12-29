import React from "react";
import { Star, Sparkles } from "lucide-react";

const ResultModal = ({ result, onClose }) => {
  if (!result) return null;

  // Mapping English level to Sinhala
  const sinhalaLevelMap = {
    "Weak": "දුර්වල",
    "Average": "සාමාන්‍ය",
    "Normal": "විශිෂ්ඨ"
  };

  // Determine celebration level based on percentage
  const getEmoji = (percentage) => {
    if (percentage >= 90) return "🌟";
    if (percentage >= 80) return "⭐";
    if (percentage >= 70) return "😊";
    if (percentage >= 60) return "👍";
    return "💪";
  };

  const getCelebrationMessage = (percentage) => {
    if (percentage >= 90) return "අපූරුයි! ඔබ ඉතාම දක්ෂයි!";
    if (percentage >= 80) return "ගොඩක් හොඳයි! දිගටම උත්සාහ කරන්න!";
    if (percentage >= 70) return "හොඳයි! ඔබට හැකියි!";
    if (percentage >= 60) return "හොඳ උත්සාහයක්! තව ටිකක් පුහුණු වෙන්න!";
    return "හරි හොඳයි! දිගටම උත්සාහ කරන්න!";
  };

  const emoji = getEmoji(result.Percentage);
  const message = getCelebrationMessage(result.Percentage);

  return (
    <div className="max-h-full overflow-y-auto">
      {/* Celebration header */}
      <div className="text-center mb-8 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-9xl opacity-10 animate-ping">🎉</div>
        </div>
        <div className="text-8xl md:text-9xl mb-4 animate-bounce relative z-10">
          {emoji}
        </div>
        <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-3 relative z-10">
          ඔබේ ප්‍රතිඵල
        </h2>
        <p className="text-2xl md:text-3xl font-extrabold text-blue-700 relative z-10">
          {message}
        </p>
      </div>

      {/* Score card */}
      <div className="bg-gradient-to-br from-yellow-300 via-pink-300 to-purple-300 rounded-3xl p-8 md:p-10 mb-8 border-8 border-yellow-400 shadow-2xl">
        <div className="text-center space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border-6 border-blue-400 shadow-xl">
            <p className="text-2xl md:text-3xl font-extrabold text-gray-700 mb-3 flex items-center justify-center gap-2">
              <Star className="w-8 h-8 text-yellow-500" />
              ඔබගේ ලකුණු
              <Star className="w-8 h-8 text-yellow-500" />
            </p>
            <p className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-blue-500 to-purple-600">
              {result.Percentage}%
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 border-6 border-purple-400 shadow-xl">
            <p className="text-xl md:text-2xl font-extrabold text-gray-700 mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-7 h-7 text-purple-500" />
              මට්ටම
            </p>
            <p className="text-3xl md:text-4xl font-extrabold text-purple-600">
              {sinhalaLevelMap[result.RLD_level] || result.RLD_level}
            </p>
          </div>
        </div>
      </div>

      {/* Feedback section */}
      {result.Feedback && (
        <div className="bg-gradient-to-r from-blue-200 to-purple-200 border-6 border-blue-400 rounded-3xl p-6 mb-8 text-center shadow-xl">
          <p className="text-xl md:text-2xl text-blue-900 font-bold flex items-center justify-center gap-3">
            <span className="text-3xl">💡</span>
            {result.Feedback}
            <span className="text-3xl">💡</span>
          </p>
        </div>
      )}

      {/* Answers section */}
      <div className="mb-8">
        <h3 className="text-3xl md:text-4xl font-extrabold text-center text-orange-600 mb-6 flex items-center justify-center gap-3">
          <span className="text-4xl">🎤</span> 
          ඔබගේ පිළිතුරු 
          <span className="text-4xl">🎤</span>
        </h3>

        <div className="grid gap-4 max-h-[40vh] overflow-y-auto pr-2">
          {Object.entries(result.answers || {}).map(([q, ans], index) => {
            const colors = [
              "from-red-200 to-red-300 border-red-400",
              "from-orange-200 to-orange-300 border-orange-400",
              "from-yellow-200 to-yellow-300 border-yellow-400",
              "from-green-200 to-green-300 border-green-400",
              "from-blue-200 to-blue-300 border-blue-400",
              "from-purple-200 to-purple-300 border-purple-400",
              "from-pink-200 to-pink-300 border-pink-400",
            ];
            const colorClass = colors[index % colors.length];

            return (
              <div
                key={q}
                className={`bg-gradient-to-br ${colorClass} border-4 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all hover:scale-102`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl md:text-4xl font-extrabold bg-white rounded-full w-12 h-12 flex items-center justify-center border-4 border-gray-300 flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-gray-800 text-lg md:text-xl mb-2">
                      {q}
                    </p>
                    <p className="text-gray-800 text-lg md:text-xl flex items-center gap-2 bg-white/70 rounded-xl p-3 border-3 border-gray-300">
                      <span className="text-2xl flex-shrink-0">💬</span>
                      <span className="font-bold break-words">{ans}</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Restart button */}
      <div className="text-center mt-8">
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-white px-12 md:px-16 py-6 md:py-7 rounded-full hover:from-green-500 hover:via-blue-500 hover:to-purple-500 text-2xl md:text-3xl font-extrabold shadow-2xl hover:shadow-3xl hover:scale-110 transition-all flex items-center gap-4 mx-auto border-6 border-white"
        >
          <span className="text-4xl md:text-5xl animate-spin-slow">🔄</span>
          නැවත ආරම්භ කරන්න
        </button>
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        .border-6 {
          border-width: 6px;
        }
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
};

export default ResultModal;
