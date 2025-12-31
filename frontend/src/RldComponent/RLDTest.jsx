import React, { useState, useEffect, useRef } from "react";
import ResultModal from "../RldComponent/ResultModal"
import QuestionCard from "../RldComponent/QuestionCard"

// Media
import QUESTION1 from "../Assets/RLD/videos/QUESTION1.mp4";
import QUESTION2 from "../Assets/RLD/videos/QUESTION2.mp4";
import QUESTION4 from "../Assets/RLD/videos/QUESTION4.mp4";
import QUESTION7 from "../Assets/RLD/videos/QUESTION7.mp4";
import q5Image from "../Assets/RLD/images/q5.jpeg";
import q6_iImage from "../Assets/RLD/images/q6_i.png";
import q6_iiImage from "../Assets/RLD/images/q6_ii.png";

//audio
import Q1i from "../Assets/RLD/audios/Q1i.m4a"
import Q1ii from "../Assets/RLD/audios/Q1ii.m4a"
import Q1iii from "../Assets/RLD/audios/Q1iii.m4a"
import Q1iv from "../Assets/RLD/audios/Q1iv.m4a"
import Q2i from "../Assets/RLD/audios/Q2i.m4a"
import Q2ii from "../Assets/RLD/audios/Q2ii.m4a"
import Q3 from "../Assets/RLD/audios/Q3.m4a"
import Q4 from "../Assets/RLD/audios/Q4.m4a"
import Q5i from "../Assets/RLD/audios/Q5i.m4a"
import Q5ii from "../Assets/RLD/audios/Q5ii.m4a"
import Q5iii from "../Assets/RLD/audios/Q5iii.m4a"
import Q6i from "../Assets/RLD/audios/Q6i.m4a"
import Q7 from "../Assets/RLD/audios/Q7.m4a"


// Icons
import { Star} from "lucide-react";

const questions = [
  {
    id: "Q1",
    type: "video",
    title: "(1) අවබෝධයෙන් පිලිතුරු දෙමු",
    src: QUESTION1,
    subQuestions: [
      { id: "Q1_i", text: "(i) මෙහි කියවෙන අවස්ථාව කුමක් ද?",audioUrl: Q1i},
      { id: "Q1_ii", text: "(ii) කුරුල්ලෝ පියාඹලා යන්නේ කොහේ ද?",audioUrl:Q1ii},
      { id: "Q1_iii", text: "(iii) මිනිස්සු ගෙවල්වලට ගියේ කොහොම ද?",audioUrl:Q1iii },
      { id: "Q1_iv", text: "(iv) අමායා ගෙදර ඇතුලට ගත්තේ මොනවාද?",audioUrl:Q1iv }
    ]
  },
  {
    id: "Q2",
    type: "video",
    title: "(2) කවුද හොයමු.",
    src: QUESTION2,
    subQuestions: [
      { id: "Q2_i", text: "(i) වැඩිමහල් ළමයා කවුද?",audioUrl:Q2i},
      { id: "Q2_ii", text: "(ii) බාලම ළමයා කවුද?",audioUrl:Q2ii }
    ]
  },
  {
    id: "Q3",
    type: "text",
    title: "(3) වචන මාරු කරමු.",
    text: "මෙම ප්‍රශ්නය වචන සම්බන්ධ කර නිවැරදි වැකි සාදන හැකියාව පරීක්ෂා කරයි.",
    subQuestions: [
      { id: "Q3_i", text: "(i) බලනවා / රූපවහිනිය / අම්මා",audioUrl:Q3 },
      { id: "Q3_ii", text: "(ii) ඉගෙනගෙන / වෙමු / පුරවැසියන් / යහපත් / හොඳින්",audioUrl:Q3 }
    ]
  },
  {
    id: "Q4",
    type: "video",
    title: "(4) උපදෙස් පිළිපදිමු.",
    src: QUESTION4,
    subQuestions: [
      { id: "Q4", text: "(i) ඉතිරි අඹ ගෙඩි ගණන කීය ද?",audioUrl:Q4 }
    ]
  },
  {
    id: "Q5",
    type: "image",
    title: "(5) දිශා සොයමු.",
    src: q5Image,
    subQuestions: [
      { id: "Q5_i", text: "(i) ගෙදරට උඩ දෙසින් ඇත්තේ කුමක් ද?",audioUrl:Q5i },
      { id: "Q5_ii", text: "(ii) ගෙදරට දකුණු පැත්තෙන් තියෙන්නේ කුමක් ද?",audioUrl:Q5ii },
      { id: "Q5_iii", text: "(iii) ගෙදරට වම් පැත්තෙන් ඇත්තේ මොකක් ද?",audioUrl:Q5iii }
    ]
  },
  {
    id: "Q6_i",
    type: "image",
    title: "(6) වර්ග කරමු.",
    src: q6_iImage,
    subQuestions: [
      { id: "Q6_i", text: "(i) කාණ්ඩයට වඩාත්ම ගැළපෙන රූපය තෝරන්න.",audioUrl:Q6i }
    ]
  },
  {
    id: "Q6_ii",
    type: "image",
    title: "(6) වර්ග කරමු.",
    src: q6_iiImage,
    subQuestions: [
      { id: "Q6_ii", text: "(ii) කාණ්ඩයට වඩාත්ම ගැළපෙන රූපය තෝරන්න.",audioUrl:Q6i }
    ]
  },
  {
    id: "Q7",
    type: "video",
    title: "(7) දින ගනිමු.",
    src: QUESTION7,
    subQuestions: [
      { id: "Q7", text: "(i) දවස කියන්න",audioUrl:Q7}
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
  const [videoCompleted, setVideoCompleted] = useState({});
  const [mediaStarted, setMediaStarted] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const transcriptRef = useRef(null);
  const containerRef = useRef(null);

  const current = questions[mainIndex];
  const currentSub = current.subQuestions[subIndex];
  const currentSubKey = currentSub.id;

  const isCurrentMediaCompleted = videoCompleted[current.id] || current.type !== "video";
  const isCurrentMediaStarted = mediaStarted[current.id] || current.type !== "video";

  const totalSubCount = questions.reduce((acc, q) => acc + q.subQuestions.length, 0);
  const answeredCount = Object.values(answers).filter(ans => ans !== "").length;
  const progressPercent = Math.round((answeredCount / totalSubCount) * 100);

  const isLastQuestion = mainIndex === questions.length - 1 && subIndex === current.subQuestions.length - 1;

  useEffect(() => {
    if (transcript && transcriptRef.current) {
      setTimeout(() => {
        transcriptRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      }, 100);
    }
  }, [transcript]);

  useEffect(() => {
    setTranscript("");
  }, [mainIndex, subIndex]);

  const handleSpeak = () => {
    const u = new SpeechSynthesisUtterance(currentSub.text);
    u.lang = "si-LK";
    speechSynthesis.speak(u);
  };

  const handleMediaStart = () => {
    setMediaStarted(prev => ({ ...prev, [current.id]: true }));
  };

  const handleMediaEnd = () => {
    setVideoCompleted(prev => ({ ...prev, [current.id]: true }));
  };

  const handleFinalSubmit = async () => {
    const finalAnswers = { ...answers };
    if (transcript && !finalAnswers[currentSubKey]) {
      finalAnswers[currentSubKey] = transcript;
    }
    questions.forEach(q => {
      q.subQuestions.forEach(sq => {
        if (!finalAnswers[sq.id]) {
          finalAnswers[sq.id] = "";
        }
      });
    });
    await submitAnswersWithState(finalAnswers);
  };

  const handleRecord = () => {
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      alert("ඔබේ බ්‍රවුසරය දේශන අනුහුරු කිරීම සහාය නොදක්වයි");
      return;
    }

    let finalText = "";
    let recognition;
    let silenceTimer = null;
    let isManuallyStopped = false;

    const startRecognition = () => {
      recognition = new Recognition();
      recognition.lang = "si-LK";
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.start();

      recognition.onresult = (e) => {
        let interim = "";
        let finalChunk = "";

        for (let i = e.resultIndex; i < e.results.length; i++) {
          const text = e.results[i][0].transcript;

          if (e.results[i].isFinal) {
            finalChunk += text;
          } else {
            interim += text;
          }
        }

        if (finalChunk) {
          finalText += " " + finalChunk;
        }

        // Show interim results but don't consider it as "answered" yet
        setTranscript((finalText + " " + interim).trim());

        // silence detection (longer for Q3)
        if (silenceTimer) clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => {
          isManuallyStopped = true;
          recognition.stop();
        }, current.id === "Q3" ? 2500 : 1200);
      };

      recognition.onend = () => {
        // 🔁 Chrome auto-stopped → restart if not silence
        if (!isManuallyStopped) {
          startRecognition();
        } else {
          finishRecognition();
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
        alert("දේශන අනුහුරු කිරීමේ දෝෂයක් සිදු විය");
      };
    };

    const finishRecognition = () => {
      setIsRecording(false);

      const cleaned = finalText
        .replace(/[.,!?।]+$/g, "")
        .replace(/\s+/g, " ")
        .trim();

      if (cleaned !== "") {
        setTranscript(cleaned);
        // Submit button will now appear since transcript is set
      }
    };

    setIsRecording(true);
    startRecognition();
  };

  const handleRefreshAnswer = () => {
    // Stop recording if active
    setIsRecording(false);

    // Clear transcript
    setTranscript("");

    // Remove saved answer for this sub-question
    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[currentSubKey];
      return updated;
    });
  };

  const handleSubmitAnswer = () => {
    // Save the current answer (even if empty)
    setAnswers((prev) => ({
      ...prev,
      [currentSubKey]: transcript,
    }));

    // For last question, handle final submit
    if (isLastQuestion) {
      handleFinalSubmit();
      return;
    }

    // Navigate to next question
    setTimeout(() => {
      if (subIndex < current.subQuestions.length - 1) {
        setSubIndex(subIndex + 1);
      } else if (mainIndex < questions.length - 1) {
        setMainIndex(mainIndex + 1);
        setSubIndex(0);
      }
      if (containerRef.current) containerRef.current.scrollTop = 0;
    }, 300);
  };

  const submitAnswersWithState = async (answersToSubmit) => {
    setIsSubmitting(true);
    const allSkipped = Object.values(answersToSubmit).every(ans => ans === "");
    
    if (allSkipped) {
      console.log('All questions skipped - 0%');
      setResult({
        Percentage: 0,
        RLD_level: "Weak",
        Feedback: "දරුවාගේ ප්‍රතිග්‍රාහක භාෂා කුසලතා අඩුයි. අඛණ්ඩ පුහුණු කිරීම අවශ්‍යයි.",
        answers: answersToSubmit
      });
      setIsFinished(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/predict_rld", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answersToSubmit),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      console.log('API Response:', data);
      setResult({ ...data, answers: answersToSubmit });
      setIsFinished(true);
    } catch (error) {
      console.error('Error:', error);
      alert("සේවාදායකය සම්බන්ධ කිරීමට නොහැක: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const restart = () => {
    setAnswers({});
    setMainIndex(0);
    setSubIndex(0);
    setTranscript("");
    setIsFinished(false);
    setResult(null);
    setVideoCompleted({});
    setMediaStarted({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center p-2 md:p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl opacity-30">🎈</div>
        <div className="absolute top-20 right-20 text-5xl  opacity-30">⭐</div>
        <div className="absolute bottom-20 left-20 text-6xl  opacity-30 animation-delay-1000">🌈</div>
        <div className="absolute bottom-10 right-10 text-5xl  opacity-30 animation-delay-2000">🎨</div>
        <div className="absolute top-1/2 left-5 text-4xl  opacity-20">✨</div>
        <div className="absolute top-1/3 right-10 text-4xl  opacity-20">🌟</div>
      </div>

      <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-5xl w-full max-h-[96vh] flex flex-col overflow-hidden relative z-10 border-4 md:border-8 border-white">
        <div className="px-4 md:px-6 pt-3 md:pt-4 pb-2 md:pb-3 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 border-b-4 border-purple-300 flex-shrink-0">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 animate-pulse" />
            <div className="text-center text-lg md:text-xl lg:text-2xl font-extrabold text-purple-700">
              ප්‍රගතිය: {answeredCount} / {totalSubCount}
            </div>
            <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 animate-pulse" />
          </div>
          <div className="w-full bg-purple-200 h-4 md:h-5 rounded-full overflow-hidden border-3 md:border-4 border-purple-300 shadow-inner">
            <div
              className="bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${progressPercent}%` }}
            >
              {progressPercent > 10 && <span className="text-white font-bold text-xs md:text-sm">{progressPercent}%</span>}
            </div>
          </div>
        </div>

        <div ref={containerRef} className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-6 bg-gradient-to-b from-blue-50 to-purple-50" style={{ scrollBehavior: 'smooth' }}>
          {!isFinished ? (
            <QuestionCard
              question={current}
              currentSub={currentSub.text}
              onMediaEnd={handleMediaEnd}
              onMediaStart={handleMediaStart}
              onRecord={handleRecord}
              isRecording={isRecording}
              onSpeak={handleSpeak}
              transcript={transcript}
              currentIndex={mainIndex}
              totalQuestions={questions.length}
              videoCompleted={isCurrentMediaCompleted}
              mediaStarted={isCurrentMediaStarted}
              currentAnswer={answers[currentSubKey]}
              audioUrl={currentSub.audioUrl}  
              onRefresh={handleRefreshAnswer}
              onSubmitAnswer={handleSubmitAnswer}
              showSubmitButton={true}
              isLastQuestion={isLastQuestion}
              isSubmitting={isSubmitting}
            />
          ) : (
            <ResultModal result={result} onClose={restart} />
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .border-3 { border-width: 3px; }
      `}</style>
    </div>
  );
};

export default RLDTest;