import React from "react";
import { Star, Sparkles } from "lucide-react";

const ResultModal = ({ result, onClose }) => {
  if (!result) return null;

  const sinhalaLevelMap = {
    "Weak": "දුර්වල",
    "Average": "සාමාන්‍ය",
    "Normal": "විශිෂ්ඨ"
  };

  const answeredCount = Object.values(result.answers || {}).filter(ans => ans !== "").length;
  const totalCount = Object.keys(result.answers || {}).length;

const getEmoji = (percentage) => {
  if (percentage === 0) return "📝";
  if (percentage >= 85) return "🏆";
  if (percentage >= 70) return "⭐";
  if (percentage >= 55) return "😊";
  if (percentage >= 40) return "👍";
  return "💪";

  };

  const emoji = getEmoji(result.Percentage);

  return (
    <div className="max-h-full overflow-y-auto pb-4">
      <div className="text-center mb-6 md:mb-8">
        <div className="text-6xl md:text-7xl lg:text-8xl mb-3 md:mb-4 animate-bounce">{emoji}</div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-700 mb-2 md:mb-3">
          ඔබේ ප්‍රතිඵල
        </h2>
      </div>

      {result.Feedback && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-6 md:mb-8 text-center shadow-md">
          <p className="text-base md:text-lg lg:text-xl text-blue-800 font-semibold flex items-center justify-center gap-2 md:gap-3">
            <span className="text-2xl md:text-3xl">💡</span>
            {result.Feedback}
            <span className="text-2xl md:text-3xl">💡</span>
          </p>
        </div>
      )}

      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl md:rounded-3xl p-5 md:p-8 mb-6 md:mb-8 border-2 border-purple-200 shadow-lg">
        <div className="text-center space-y-4 md:space-y-6">
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border-2 border-blue-200 shadow-md">
            <p className="text-xl md:text-2xl font-bold text-gray-700 mb-2 md:mb-3 flex items-center justify-center gap-2">
              <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
              <span className="hidden sm:inline">ඔබගේ ලකුණු</span>
              <span className="sm:inline md:hidden">ලකුණු</span>
              <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
            </p>
            <p className="text-5xl md:text-6xl lg:text-7xl font-bold text-purple-600">
              {result.Percentage}%
            </p>
          </div>
          <div className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-5 border-2 border-purple-200 shadow-md">
            <p className="text-lg md:text-xl font-bold text-gray-700 mb-1 md:mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 md:w-7 md:h-7 text-purple-500" />
              මට්ටම
            </p>
            <p className="text-2xl md:text-3xl font-bold text-purple-600">
              {sinhalaLevelMap[result.RLD_level] || result.RLD_level}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="bg-green-50 rounded-xl md:rounded-2xl p-3 md:p-4 border-2 border-green-200">
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-600">{answeredCount}</p>
              <p className="text-sm md:text-base font-semibold text-green-700">
                <span className="hidden sm:inline">පිළිතුරු දුන්නා</span>
                <span className="sm:hidden">දුන්නා</span>
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl md:rounded-2xl p-3 md:p-4 border-2 border-blue-200">
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600">{totalCount}</p>
              <p className="text-sm md:text-base font-semibold text-blue-700">
                <span className="hidden sm:inline">මුළු ප්‍රශ්න</span>
                <span className="sm:hidden">මුළු</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 md:mb-8">
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-700 mb-4 md:mb-6 flex items-center justify-center gap-2 md:gap-3">
          <span className="text-3xl md:text-4xl">🎤</span>
          ඔබගේ පිළිතුරු
          <span className="text-3xl md:text-4xl">🎤</span>
        </h3>
        <div className="grid gap-3 md:gap-4 max-h-[35vh] md:max-h-[40vh] overflow-y-auto pr-1 md:pr-2">
          {Object.entries(result.answers || {})
            .filter(([q, ans]) => ans !== "") // Only show answered questions
            .map(([q, ans], index) => {
              return (
                <div key={q} className="bg-white border-2 border-gray-200 rounded-xl md:rounded-2xl p-3 md:p-5 shadow-md hover:shadow-lg transition-all hover:scale-102">
                  <div className="flex items-start gap-2 md:gap-4">
                    <span className="text-xl md:text-2xl lg:text-3xl font-bold rounded-full w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex items-center justify-center border-2 flex-shrink-0 bg-purple-100 text-purple-700 border-purple-300">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-sm md:text-base lg:text-lg mb-1 md:mb-2">{q}</p>
                      <p className="text-gray-700 text-sm md:text-base lg:text-lg flex items-start gap-1 md:gap-2 bg-gray-50 rounded-lg md:rounded-xl p-2 md:p-3 border border-gray-200">
                        <span className="text-lg md:text-xl flex-shrink-0">💬</span>
                        <span className="font-medium break-words">{ans}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="text-center mt-6 md:mt-8">
        <button onClick={onClose} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 md:px-12 lg:px-16 py-4 md:py-5 lg:py-6 rounded-full hover:from-purple-600 hover:to-blue-600 text-lg md:text-xl lg:text-2xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 md:gap-3 lg:gap-4 mx-auto border-2 border-purple-300">
          <span className="text-2xl md:text-3xl">🔄</span>
          <span className="hidden sm:inline">නැවත ආරම්භ කරන්න</span>
          <span className="sm:hidden">නැවත</span>
        </button>
      </div>

      <style jsx>{`
        .hover\\:scale-102:hover { transform: scale(1.02); }
      `}</style>
    </div>
  );
};

export default ResultModal;