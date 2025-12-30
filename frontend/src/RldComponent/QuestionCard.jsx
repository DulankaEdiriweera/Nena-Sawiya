import React, { useEffect, useRef } from "react";
import { Volume2, Mic, Loader2, Sparkles } from "lucide-react";

const QuestionCard = ({
  question,
  currentSub,
  onMediaEnd,
  onRecord,
  isRecording,
  onSpeak,
  transcript,
  currentIndex,
  totalQuestions,
}) => {
  const transcriptRef = useRef(null);

  // Auto-scroll to transcript when it appears
  useEffect(() => {
    if (transcript && transcriptRef.current) {
      setTimeout(() => {
        transcriptRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }, 100);
    }
  }, [transcript]);

  const renderMedia = () => {
    switch (question.type) {
      case "video":
        return (
          <div className="mb-6 border-8 border-blue-300 rounded-3xl overflow-hidden shadow-xl bg-blue-100 p-3">
            <video
              src={question.src}
              controls
              onEnded={onMediaEnd}
              className="w-full max-h-[35vh] rounded-2xl"
            />
          </div>
        );
      case "image":
        return (
          <div className="mb-6 border-8 border-pink-300 rounded-3xl overflow-hidden shadow-xl bg-pink-100 p-3">
            <img
              src={question.src}
              alt="ප්‍රශ්නයේ රූපය"
              className="w-full max-h-[40vh] object-contain rounded-2xl"
            />
          </div>
        );
      case "text":
        return (
          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 border-8 border-yellow-400 rounded-3xl p-8 mb-6 shadow-xl">
            <p className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed text-center">
              {question.text}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border-8 border-yellow-300 rounded-3xl p-6 md:p-8 shadow-2xl">
      {/* Question title with fun styling */}
      <div className="bg-gradient-to-r from-orange-400 to-pink-400 rounded-3xl p-4 mb-6 shadow-lg border-4 border-orange-300">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8" />
          {question.title}
          <Sparkles className="w-8 h-8" />
        </h2>
      </div>

      {/* Media section with playful borders */}
      {renderMedia()}

      {/* Question text with speaker */}
      <div className="bg-gradient-to-r from-green-200 to-emerald-200 border-6 border-green-400 rounded-3xl p-6 flex items-center gap-4 mb-6 shadow-lg">
        <p className="text-2xl md:text-3xl font-bold text-gray-800 flex-1 leading-relaxed">
          {currentSub}
        </p>
        <button
          onClick={onSpeak}
          className="p-4 md:p-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full hover:from-blue-500 hover:to-blue-700 transition-all shadow-xl hover:scale-110 border-4 border-blue-300"
          title="ඇසීමට"
        >
          <Volume2 className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </button>
      </div>

      {/* Record button - extra large and colorful */}
      <button
        onClick={onRecord}
        disabled={isRecording}
        className={`w-full flex items-center justify-center gap-4 px-10 py-7 rounded-3xl text-white text-2xl md:text-3xl font-extrabold shadow-2xl transition-all border-6 ${
          isRecording
            ? "bg-gradient-to-r from-red-400 to-red-600 animate-pulse cursor-not-allowed border-red-500"
            : "bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 hover:from-green-500 hover:via-emerald-600 hover:to-teal-600 hover:scale-105 border-green-500"
        }`}
      >
        {isRecording ? (
          <>
            <Loader2 className="animate-spin w-10 h-10 md:w-12 md:h-12" />
            පටිගත වෙමින්...
          </>
        ) : (
          <>
            <Mic className="w-10 h-10 md:w-12 md:h-12" />
            පිළිතුර කියන්න
          </>
        )}
      </button>

      {/* Transcript display with celebration */}
      {transcript && (
        <div
          ref={transcriptRef}
          className="bg-gradient-to-r from-green-100 to-teal-100 border-6 border-green-500 rounded-3xl p-6 mt-6 shadow-2xl animate-fadeIn"
        >
          <div className="flex items-start gap-4">
            <span className="text-5xl animate-bounce">✅</span>
            <div className="flex-1">
              <p className="text-xl md:text-2xl font-extrabold text-green-800 mb-3 flex items-center gap-2">
                <span className="text-3xl">🗣️</span> ඔබේ පිළිතුර:
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800 bg-white rounded-2xl p-6 border-4 border-green-400 shadow-inner">
                {transcript}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom spacing */}
      <div className="h-6"></div>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .border-6 {
          border-width: 6px;
        }
      `}</style>
    </div>
  );
};

export default QuestionCard;