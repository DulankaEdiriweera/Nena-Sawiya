import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/vd_picture_mcq";

const LEVELS = [
  { id: "EASY",   label: "පහසු",   emoji: "🟢", color: "from-green-400 to-emerald-500",  bg: "bg-green-50",  border: "border-green-200",  ring: "ring-green-400" },
  { id: "MEDIUM", label: "මධ්‍යම", emoji: "🟡", color: "from-yellow-400 to-orange-400",  bg: "bg-yellow-50", border: "border-yellow-200", ring: "ring-yellow-400" },
  { id: "HARD",   label: "දුෂ්කර", emoji: "🔴", color: "from-red-400 to-pink-500",       bg: "bg-red-50",    border: "border-red-200",    ring: "ring-red-400" },
];

export default function UserVdPictureMCQ() {
  const [phase, setPhase] = useState("select");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const startChallenge = async (level) => {
    setSelectedLevel(level);
    setLoading(true);
    try {
      const res = await axios.get(`${API}/level/${level.id}`);
      setQuestions(res.data);
      setSelectedAnswers({});
      setScore(null);
      setCurrentQ(0);
      setSubmitted(false);
      setPhase("playing");
    } catch (err) {
      console.error(err);
      alert("❌ ප්‍රශ්න පූරණය අසාර්ථක විය.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qIndex, aIndex) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: aIndex }));
  };

  const handleSubmit = () => {
    let total = 0;
    questions.forEach((q, qi) => {
      const sel = selectedAnswers[qi];
      if (sel !== undefined) total += q.answers[sel].mark;
    });
    setScore(total);
    setSubmitted(true);
    setPhase("result");
  };

  const totalPossible = questions.reduce((sum, q) => sum + Math.max(...q.answers.map(a => a.mark)), 0);
  const answeredCount = Object.keys(selectedAnswers).length;

  // ── Level Select ──────────────────────────────────────────
  if (phase === "select") return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-50 to-pink-100 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <div className="text-7xl mb-4 animate-bounce">👁️</div>
        <h1 className="text-4xl font-black text-purple-700 mb-2">වෙනස හොයමු!</h1>
        <p className="text-gray-500 text-lg">ඔබේ මට්ටම තෝරන්න</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-5">
        {LEVELS.map(lvl => (
          <button
            key={lvl.id}
            onClick={() => startChallenge(lvl)}
            disabled={loading}
            className={`bg-gradient-to-br ${lvl.color} text-white font-black text-2xl px-10 py-8 rounded-3xl shadow-xl hover:scale-105 transition-transform flex flex-col items-center gap-2 disabled:opacity-60`}
          >
            <span className="text-5xl">{lvl.emoji}</span>
            {lvl.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="mt-8 text-center">
          <div className="text-4xl animate-spin">🌀</div>
          <p className="text-purple-500 font-bold mt-2">පූරණය වෙමින්...</p>
        </div>
      )}
    </div>
  );

  // ── Result Screen ─────────────────────────────────────────
  if (phase === "result") {
    const percent = totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 0;
    const resultEmoji = percent === 100 ? "🏆" : percent >= 60 ? "😊" : "💪";

    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-50 to-pink-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="text-7xl mb-4">{resultEmoji}</div>
          <h2 className="text-3xl font-black text-purple-700 mb-1">ක්‍රීඩාව ඉවරයි!</h2>
          <p className="text-gray-400 mb-6">{selectedLevel?.label} මට්ටම</p>

          <div className="bg-gradient-to-r from-yellow-300 to-orange-300 rounded-2xl p-6 mb-6">
            <p className="text-4xl font-black text-white">{score} / {totalPossible}</p>
            <p className="text-yellow-100 text-sm mt-1">ලකුණු</p>
          </div>

          {/* Breakdown */}
          <div className="space-y-2 mb-6 text-left">
            {questions.map((q, qi) => {
              const sel = selectedAnswers[qi];
              const correct = q.answers.findIndex(a => a.mark > 0);
              const isCorrect = sel === correct;
              return (
                <div key={qi} className={`flex items-center gap-3 px-4 py-2 rounded-2xl text-sm font-bold ${isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                  <span>{isCorrect ? "✅" : "❌"}</span>
                  <span className="flex-1 truncate">ප්‍රශ්නය {qi+1}</span>
                  <span>{isCorrect ? `+${Math.max(...q.answers.map(a=>a.mark))}` : "0"}</span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => startChallenge(selectedLevel)}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-3 rounded-2xl hover:opacity-90 transition"
            >
              🔄 නැවත උත්සාහ
            </button>
            <button
              onClick={() => setPhase("select")}
              className="flex-1 bg-gray-100 text-gray-700 font-black py-3 rounded-2xl hover:bg-gray-200 transition"
            >
              ← මට්ටම වෙනස් කරන්න
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Playing Screen ────────────────────────────────────────
  const q = questions[currentQ];
  if (!q) return null;
  const isLast = currentQ === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-50 to-pink-100">
      {/* Top bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={() => setPhase("select")} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 flex justify-between">
            <span className="text-sm font-bold text-gray-600">ප්‍රශ්නය {currentQ+1} / {questions.length}</span>
            <span className="text-sm font-bold text-gray-400">{answeredCount}/{questions.length} පිළිතුරු</span>
          </div>
          <span className={`text-xs font-black px-3 py-1 rounded-full bg-gradient-to-r ${selectedLevel?.color} text-white`}>
            {selectedLevel?.emoji} {selectedLevel?.label}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Question card */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
          <p className="text-xl font-black text-gray-800 mb-4">{currentQ+1}. {q.question_text}</p>
          <div className="flex justify-center">
            <img
              src={`http://localhost:5000${q.question_image}`}
              className="max-w-xs w-full rounded-2xl border-2 border-gray-100 shadow"
              onError={e => e.target.src = "https://via.placeholder.com/300?text=No+Image"}
            />
          </div>
        </div>

        {/* Answers */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
          <p className="text-sm font-bold text-gray-400 uppercase mb-4">🎯 නිවැරදි පිළිතුර තෝරන්න</p>
          <div className="grid grid-cols-5 gap-3">
            {q.answers.map((a, ai) => {
              const isSelected = selectedAnswers[currentQ] === ai;
              const isCorrectAns = a.mark > 0;
              let cls = "border-gray-200 hover:border-purple-400";
              if (submitted) {
                cls = isCorrectAns ? "border-green-400 bg-green-50" : isSelected ? "border-red-400 bg-red-50" : "border-gray-200";
              } else if (isSelected) {
                cls = "border-purple-500 bg-purple-50";
              }
              return (
                <div
                  key={ai}
                  onClick={() => handleSelect(currentQ, ai)}
                  className={`relative cursor-pointer rounded-2xl border-2 p-2 transition ${cls} ${!submitted ? "hover:scale-105" : ""}`}
                >
                  {submitted && isCorrectAns && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-black">✓</div>
                  )}
                  {submitted && isSelected && !isCorrectAns && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-black">✗</div>
                  )}
                  <img
                    src={`http://localhost:5000${a.image_url}`}
                    className="w-full h-16 object-contain rounded-xl"
                    onError={e => e.target.src = "https://via.placeholder.com/80?text=No+Img"}
                  />
                  <p className={`text-center text-xs font-bold mt-1 ${isSelected && !submitted ? "text-purple-600" : "text-gray-400"}`}>
                    {ai+1} විකල්පය
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setCurrentQ(c => Math.max(0, c-1))}
            disabled={currentQ === 0}
            className="bg-white border-2 border-gray-200 text-gray-600 font-bold px-5 py-3 rounded-2xl hover:bg-gray-50 disabled:opacity-40 transition"
          >
            ← කලින්
          </button>

          {isLast ? (
            <button
              onClick={handleSubmit}
              disabled={answeredCount < questions.length}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black px-8 py-3 rounded-2xl shadow-lg hover:opacity-90 disabled:opacity-50 transition"
            >
              ✅ සියලු පිළිතුරු ඉදිරිපත් කරන්න
            </button>
          ) : (
            <button
              onClick={() => setCurrentQ(c => Math.min(questions.length-1, c+1))}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-5 py-3 rounded-2xl hover:opacity-90 transition"
            >
              ඊළඟ →
            </button>
          )}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2">
          {questions.map((_, qi) => (
            <button
              key={qi}
              onClick={() => setCurrentQ(qi)}
              className={`rounded-full transition-all ${
                qi === currentQ ? "w-6 h-3 bg-purple-600" :
                selectedAnswers[qi] !== undefined ? "w-3 h-3 bg-purple-300" :
                "w-3 h-3 bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
