import React, { useEffect, useRef, useState } from "react";
import { Volume2, Mic, Loader2, Sparkles, Play, RefreshCw, ArrowRight, CheckCircle } from "lucide-react";

const QuestionCard = ({
  question,
  currentSub,
  onMediaEnd,
  onMediaStart,
  onRecord,
  isRecording,
  onSpeak,
  transcript,
  currentIndex,
  totalQuestions,
  videoCompleted,
  mediaStarted,
  currentAnswer,
  audioUrl,
  onRefresh,
  onSubmitAnswer,
  showSubmitButton,
  isLastQuestion,
  isSubmitting
}) => {
  const transcriptRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const submitButtonRef = useRef(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (transcript && transcriptRef.current) {
      setTimeout(() => {
        transcriptRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [transcript]);

  // Auto-scroll to submit button when recording finishes and button appears
  useEffect(() => {
    if (!isRecording && transcript && transcript.trim() !== "" && submitButtonRef.current) {
      setTimeout(() => {
        submitButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [isRecording, transcript]);

  // Handle playing custom audio
  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlayingAudio(false);
      } else {
        audioRef.current.play();
        setIsPlayingAudio(true);
      }
    }
  };

  // Setup audio event listeners
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const handleEnded = () => setIsPlayingAudio(false);
      const handlePause = () => setIsPlayingAudio(false);
      
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('pause', handlePause);
      
      return () => {
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('pause', handlePause);
      };
    }
  }, []);

  // Reset audio playing state when question changes
  useEffect(() => {
    setIsPlayingAudio(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [currentSub]);

  const handleStartVideo = () => {
    if (videoRef.current) {
      onMediaStart();
      videoRef.current.play();
    }
  };

  const renderMedia = () => {
    switch (question.type) {
      case "video":
        return (
          <div className="mb-3 md:mb-4 border-2 md:border-3 border-blue-300 rounded-xl md:rounded-2xl overflow-hidden shadow-lg bg-blue-50 p-2">
            <div className="relative">
              <video ref={videoRef} src={question.src} onEnded={onMediaEnd} className="w-full max-h-[28vh] md:max-h-[32vh] rounded-lg md:rounded-xl" controlsList="nodownload" />
              {!mediaStarted && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg md:rounded-xl">
                  <button onClick={handleStartVideo} className="bg-green-500 text-white px-4 md:px-6 lg:px-10 py-3 md:py-4 lg:py-6 rounded-full hover:bg-green-600 text-lg md:text-xl lg:text-2xl font-bold shadow-lg hover:scale-110 transition-all flex items-center gap-2 border-2 md:border-3 border-white">
                    <Play className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 fill-white" />
                    <span className="hidden sm:inline">වීඩියෝව ආරම්භ කරන්න</span>
                    <span className="sm:hidden">ආරම්භ කරන්න</span>
                  </button>
                </div>
              )}
              {videoCompleted && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg md:rounded-xl">
                  <div className="bg-white/90 px-3 md:px-6 py-2 md:py-4 rounded-xl border-2 md:border-3 border-green-400 shadow-lg">
                    <p className="text-base md:text-lg lg:text-xl font-bold text-green-700 flex items-center gap-2">
                      <span className="text-xl md:text-2xl">✅</span>
                      <span className="hidden sm:inline">වීඩියෝව නැරඹීම අවසන්!</span>
                      <span className="sm:hidden">අවසන්!</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
            {!videoCompleted && mediaStarted && (
              <div className="mt-2 bg-yellow-50 border-2 border-yellow-400 rounded-lg md:rounded-xl p-2">
                <p className="text-sm md:text-base font-semibold text-yellow-800 text-center flex items-center justify-center gap-1 md:gap-2">
                  <span className="text-lg md:text-xl">⏯️</span>
                  <span className="hidden sm:inline">කරුණාකර වීඩියෝව සම්පූර්ණයෙන් නරඹන්න</span>
                  <span className="sm:hidden">වීඩියෝව සම්පූර්ණ කරන්න</span>
                </p>
              </div>
            )}
          </div>
        );
      case "image":
        return (
          <div className="mb-3 md:mb-4 border-2 md:border-3 border-pink-300 rounded-xl md:rounded-2xl overflow-hidden shadow-lg bg-pink-50 p-2">
            <img src={question.src} alt="ප්‍රශ්නයේ රූපය" className="w-full max-h-[32vh] md:max-h-[36vh] object-contain rounded-lg md:rounded-xl" />
          </div>
        );
      case "text":
        return (
          <div className="bg-yellow-50 border-2 md:border-3 border-yellow-400 rounded-xl md:rounded-2xl p-3 md:p-5 lg:p-6 mb-3 md:mb-4 shadow-lg">
            <p className="text-base md:text-lg lg:text-xl font-semibold text-gray-800 leading-relaxed text-center">{question.text}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const shouldShowQuestions = question.type !== "video" || videoCompleted;
  
  // Check if submit button should be shown
  // Only show when: 1) Not currently recording AND 2) Has a transcript OR previous answer
  const hasAnswer = transcript && transcript.trim() !== "";
  const canSubmit = !isRecording && (hasAnswer || currentAnswer);

  return (
    <div className="bg-white border-3 md:border-4 border-purple-300 rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 shadow-lg">
      <div className="bg-purple-500 rounded-xl md:rounded-2xl p-2 md:p-3 mb-3 md:mb-4 shadow-md border-2 border-purple-400">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white text-center flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
          <span>{question.title}</span>
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
        </h2>
      </div>
      {renderMedia()}
      {shouldShowQuestions ? (
        <>
          <div className="bg-green-50 border-2 border-green-400 rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center gap-2 md:gap-3 mb-3 md:mb-4 shadow-md">
            <p className="text-base md:text-lg lg:text-xl font-semibold text-gray-800 flex-1 leading-relaxed">{currentSub}</p>
            
            {audioUrl ? (
              // Custom audio player
              <>
                <button 
                  onClick={handlePlayAudio} 
                  className={`p-2 md:p-3 rounded-full transition-all shadow-md hover:scale-110 border-2 flex-shrink-0 ${
                    isPlayingAudio
                      ? "bg-orange-500 border-orange-400 animate-pulse"
                      : "bg-blue-500 hover:bg-blue-600 border-blue-400"
                  }`}
                  title={isPlayingAudio ? "Playing audio..." : "ඇසීමට"}
                >
                  <Volume2 className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
                </button>
                <audio ref={audioRef} src={audioUrl} preload="auto" />
              </>
            ) : (
              // Fallback to text-to-speech
              <button 
                onClick={onSpeak} 
                className="p-2 md:p-3 bg-blue-500 rounded-full hover:bg-blue-600 transition-all shadow-md hover:scale-110 border-2 border-blue-400 flex-shrink-0" 
                title="ඇසීමට"
              >
                <Volume2 className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
              </button>
            )}
          </div>
          <button onClick={onRecord} disabled={isRecording} className={`w-full flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 lg:px-8 py-4 md:py-5 lg:py-6 rounded-xl md:rounded-2xl text-white text-lg md:text-xl lg:text-2xl font-bold shadow-lg transition-all border-2 md:border-3 ${
            isRecording ? "bg-red-500 animate-pulse cursor-not-allowed border-red-400" : "bg-green-500 hover:bg-green-600 hover:scale-105 border-green-400"
          }`}>
            {isRecording ? (
              <>
                <Loader2 className="animate-spin w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                <span className="hidden sm:inline">පටිගත වෙමින්...</span>
                <span className="sm:hidden">පටිගත...</span>
              </>
            ) : (
              <>
                <Mic className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                පිළිතුර කියන්න
              </>
            )}
          </button>
          {currentAnswer && !transcript && (
            <div className="bg-blue-50 border-2 md:border-3 border-blue-400 rounded-xl md:rounded-2xl p-3 md:p-4 mt-3 md:mt-4 shadow-md">
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-2xl md:text-3xl flex-shrink-0">💾</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base lg:text-lg font-bold text-blue-800 mb-1 md:mb-2 flex items-center gap-1 md:gap-2">
                    <span className="text-lg md:text-xl">📝</span>
                    <span className="hidden sm:inline">සුරකින ලද පිළිතුර:</span>
                    <span className="sm:hidden">සුරකින ලද:</span>
                  </p>
                  <p className="text-base md:text-lg lg:text-xl font-semibold text-gray-800 bg-white rounded-lg md:rounded-xl p-2 md:p-3 lg:p-4 border-2 border-blue-300 shadow-sm break-words">{currentAnswer}</p>
                </div>
              </div>
            </div>
          )}
          {transcript && (
            <div ref={transcriptRef} className="bg-green-50 border-2 md:border-3 border-green-500 rounded-xl md:rounded-2xl p-3 md:p-4 mt-3 md:mt-4 shadow-md animate-fadeIn">
              <div className="flex items-start gap-2 md:gap-3">
                <span className="text-3xl md:text-4xl animate-bounce flex-shrink-0">✅</span>

                <div className="flex-1 min-w-0">
                  {/* HEADER ROW */}
                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <p className="text-sm md:text-base lg:text-lg font-bold text-green-800 flex items-center gap-1 md:gap-2">
                      <span className="text-lg md:text-xl">🗣️</span> ඔබේ පිළිතුර:
                    </p>

                    <button
                      onClick={onRefresh}
                      title="නැවත කියමු"
                      className="p-1.5 md:p-2 rounded-full 
                                bg-red-500 hover:bg-red-600
                                text-white shadow-md transition-all hover:scale-110"
                    >
                      <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                  <p className="text-base md:text-lg lg:text-xl font-semibold text-gray-800 bg-white rounded-lg md:rounded-xl p-2 md:p-3 lg:p-4 border-2 border-green-400 shadow-sm break-words">{transcript}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* SUBMIT BUTTON - Shows when there's an answer */}
          {showSubmitButton && canSubmit && (
            <div ref={submitButtonRef} className="mt-4 md:mt-6 flex justify-center animate-fadeIn">
              <button
                onClick={onSubmitAnswer}
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 md:gap-3 px-8 md:px-12 lg:px-16 py-4 md:py-5 lg:py-6 rounded-xl md:rounded-2xl text-lg md:text-xl lg:text-2xl font-bold shadow-lg transition-all border-3 md:border-4 ${
                  isSubmitting
                    ? "bg-gray-400 text-white cursor-not-allowed border-gray-500"
                    : isLastQuestion
                      ? "bg-purple-500 text-white hover:bg-purple-600 hover:scale-105 border-purple-400 animate-pulse"
                      : "bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 border-blue-400"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                    <span className="hidden sm:inline">ඉදිරිපත් කරමින්...</span>
                    <span className="sm:hidden">ඉදිරිපත්...</span>
                  </>
                ) : isLastQuestion ? (
                  <>
                    <CheckCircle className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                    <span className="hidden sm:inline">සම්පූර්ණ කරන්න</span>
                    <span className="sm:hidden">සම්පූර්ණ</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                    <span className="hidden sm:inline">ඊළඟ ප්‍රශ්නය</span>
                    <span className="sm:hidden">ඊළඟ</span>
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-blue-50 border-2 md:border-3 border-blue-400 rounded-xl md:rounded-2xl p-4 md:p-6 text-center shadow-md">
          <p className="text-base md:text-lg lg:text-xl font-bold text-blue-800 flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3">
            <span className="text-2xl md:text-3xl">👆</span>
            <span>කරුණාකර ප්‍රශ්න දැකීමට වීඩියෝව ආරම්භ කරන්න</span>
            <span className="text-2xl md:text-3xl">☝️</span>
          </p>
        </div>
      )}
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .border-3 { border-width: 3px; }
      `}</style>
    </div>
  );
};

export default QuestionCard;