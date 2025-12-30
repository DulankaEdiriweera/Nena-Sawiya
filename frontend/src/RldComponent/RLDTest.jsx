import { useState, useEffect, useRef } from "react";
import QuestionCard from "./QuestionCard";
import ResultModal from "./ResultModal";
// Media
import q1Video from "../Assets/RLD/videos/q1.mp4";
import q2Video from "../Assets/RLD/videos/q2.mp4";
import q4Video from "../Assets/RLD/videos/q4.mp4";
import q7Video from "../Assets/RLD/videos/q7.mp4";
import q5Image from "../Assets/RLD/images/q5.jpeg";
import q6_iImage from "../Assets/RLD/images/q6_i.png";
import q6_iiImage from "../Assets/RLD/images/q6_ii.png";

// Icons
import { Star } from "lucide-react";

const questions = [
  {
    id: "Q1",
    type: "video",
    title: "(1) අවබෝධයෙන් පිලිතුරු දෙමු",
    src: q1Video,
    subQuestions: [
      { id: "Q1_i", text: "මෙහි කියවෙන අවස්ථාව කුමක් ද?" },
      { id: "Q1_ii", text: "කුරුල්ලෝ පියාඹලා යන්නේ කොහේ ද?" },
      { id: "Q1_iii", text: "මිනිස්සු ගෙවල්වලට ගියේ කොහොම ද?" },
      { id: "Q1_iv", text: "අමායා ගෙදර ඇතුලට ගත්තේ මොනවාද?" }
    ]
  },
  {
    id: "Q2",
    type: "video",
    title: "(2) කවුද හොයමු.",
    src: q2Video,
    subQuestions: [
      { id: "Q2_i", text: "වැඩිමහල් ළමයා කවුද?" },
      { id: "Q2_ii", text: "බාලම ළමයා කවුද?" }
    ]
  },
  {
    id: "Q3",
    type: "text",
    title: "(3) වචන මාරු කරමු.",
    text: "මෙම ප්‍රශ්නය වචන සම්බන්ධ කර නිවැරදි වැකි සාදන හැකියාව පරීක්ෂා කරයි.",
    subQuestions: [
      { id: "Q3_i", text: "බලනවා / රූපවහිනිය / අම්මා" },
      { id: "Q3_ii", text: "ඉගෙනගෙන / වෙමු / පුරවැසියන් / යහපත් / හොඳින්" }
    ]
  },
  {
    id: "Q4",
    type: "video",
    title: "(4) උපදෙස් පිළිපදිමු.",
    src: q4Video,
    subQuestions: [
      { id: "Q4", text: "ඉතිරි ගණන?" }
    ]
  },
  {
    id: "Q5",
    type: "image",
    title: "(5) දිශා සොයමු.",
    src: q5Image,
    subQuestions: [
      { id: "Q5_i", text: "නිවසට උඩ දෙසින් ඇත්තේ කුමක් ද?" },
      { id: "Q5_ii", text: "නිවසට දකුණු පැත්තෙන් තියෙන්නේ කුමක් ද?" },
      { id: "Q5_iii", text: "නිවසට වම් පැත්තෙන් ඇත්තේ මොකක් ද?" }
    ]
  },
  {
    id: "Q6_i",
    type: "image",
    title: "(6) වර්ග කරමු.",
    src: q6_iImage,
    subQuestions: [
      { id: "Q6_i", text: "කාණ්ඩයට වඩාත්ම ගැළපෙන රූපය තෝරන්න." }
    ]
  },
  {
    id: "Q6_ii",
    type: "image",
    title: "(6) වර්ග කරමු.",
    src: q6_iiImage,
    subQuestions: [
      { id: "Q6_ii", text: "කාණ්ඩයට වඩාත්ම ගැළපෙන රූපය තෝරන්න." }
    ]
  },
  {
    id: "Q7",
    type: "video",
    title: "(7) දින ගනිමු.",
    src: q7Video,
    subQuestions: [
      { id: "Q7", text: "පිළිතුර කියන්න" }
    ]
  }
];

const RLDTest = () => {
  const [answers, setAnswers] = useState({});
  const [mainIndex, setMainIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState(null);

  const transcriptRef = useRef(null);
  const containerRef = useRef(null);

  const current = questions[mainIndex];
  const currentSub = current.subQuestions[subIndex].text;

  // Progress calculation based on actual answers
  const totalSubCount = questions.reduce((acc, q) => acc + q.subQuestions.length, 0);
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalSubCount) * 100);

  // Auto-scroll to transcript when it appears
  useEffect(() => {
    if (transcript && transcriptRef.current) {
      setTimeout(() => {
        transcriptRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      }, 100);
    }
  }, [transcript]);

  // Speak question
  const handleSpeak = () => {
    const u = new SpeechSynthesisUtterance(currentSub);
    u.lang = "si-LK";
    speechSynthesis.speak(u);
  };

  // Next sub question
  const nextSubQuestion = () => {
    if (subIndex < current.subQuestions.length - 1) {
      setSubIndex(subIndex + 1);
    } else if (mainIndex < questions.length - 1) {
      setMainIndex(mainIndex + 1);
      setSubIndex(0);
    }
    setTranscript("");

    // Scroll to top for next question
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  // Record answer
  const handleRecord = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      alert("ඔබේ බ්‍රවුසරය දේශන අනුහුරු කිරීම සහාය නොදක්වයි");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "si-LK";
    recognition.interimResults = false;

    setIsRecording(true);
    recognition.start();

    recognition.onresult = (e) => {
      let text = e.results[0][0].transcript.replace(/[.,!?।]+$/g, "").trim();
      const key = current.subQuestions[subIndex].id;

      setAnswers((prev) => {
        const newAnswers = { ...prev, [key]: text };

        // Check if this is the last question
        const isLastQuestion = mainIndex === questions.length - 1 &&
          subIndex === current.subQuestions.length - 1;

        if (isLastQuestion) {
          // Submit with the new answers directly
          setTimeout(() => submitAnswersWithState(newAnswers), 700);
        }

        return newAnswers;
      });

      setTranscript(text);
      setIsRecording(false);

      // Only move to next question if not the last one
      const isLastQuestion = mainIndex === questions.length - 1 &&
        subIndex === current.subQuestions.length - 1;

      if (!isLastQuestion) {
        setTimeout(nextSubQuestion, 2000);
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
      alert("දේශන අනුහුරු කිරීමේ දෝෂයක් සිදු විය");
    };
  };

  // Submit answers with specific state
  const submitAnswersWithState = async (answersToSubmit) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/predict_rld", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answersToSubmit),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('API Response:', data);
      setResult({ ...data, answers: answersToSubmit });
      setIsFinished(true);
    } catch (error) {
      console.error('Error:', error);
      alert("සේවාදායකය සම්බන්ධ කිරීමට නොහැක: " + error.message);
    }
  };

  // Restart
  const restart = () => {
    setAnswers({});
    setMainIndex(0);
    setSubIndex(0);
    setTranscript("");
    setIsFinished(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center p-4">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl animate-bounce opacity-30">🎈</div>
        <div className="absolute top-20 right-20 text-5xl animate-pulse opacity-30">⭐</div>
        <div className="absolute bottom-20 left-20 text-6xl animate-bounce opacity-30 animation-delay-1000">🌈</div>
        <div className="absolute bottom-10 right-10 text-5xl animate-pulse opacity-30 animation-delay-2000">🎨</div>
        <div className="absolute top-1/2 left-5 text-4xl animate-spin-slow opacity-20">✨</div>
        <div className="absolute top-1/3 right-10 text-4xl animate-spin-slow opacity-20">🌟</div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden relative z-10 border-8 border-white">
        {/* Progress Bar - Fixed at top with fun design */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 border-b-4 border-purple-300">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Star className="w-6 h-6 text-yellow-500 animate-pulse" />
            <div className="text-center text-2xl md:text-3xl font-extrabold text-purple-700">
              ප්‍රගතිය: {answeredCount} / {totalSubCount}
            </div>
            <Star className="w-6 h-6 text-yellow-500 animate-pulse" />
          </div>
          <div className="w-full bg-purple-200 h-6 rounded-full overflow-hidden border-4 border-purple-300 shadow-inner">
            <div
              className="bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${progressPercent}%` }}
            >
              {progressPercent > 10 && (
                <span className="text-white font-bold text-sm">
                  {progressPercent}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable content area */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-blue-50 to-purple-50"
          style={{ scrollBehavior: 'smooth' }}
        >
          {!isFinished ? (
            <QuestionCard
              question={current}
              currentSub={currentSub}
              onMediaEnd={() => {}}
              onRecord={handleRecord}
              isRecording={isRecording}
              onSpeak={handleSpeak}
              transcript={transcript}
              currentIndex={mainIndex}
              totalQuestions={questions.length}
            />
          ) : (
            <ResultModal result={result} onClose={restart} />
          )}
        </div>
      </div>

      {/* Add CSS for animations */}
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
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default RLDTest;