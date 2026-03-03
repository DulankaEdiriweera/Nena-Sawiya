import { useEffect, useState } from "react";
import axios from "axios";

const BASE = "http://localhost:5000";

const LEVELS = [
  { key: "EASY",   label: "පහසු",   emoji: "🟢", color: "from-green-400 to-emerald-500",  bg: "bg-green-50",  border: "border-green-300" },
  { key: "MEDIUM", label: "මධ්‍යම", emoji: "🟡", color: "from-yellow-400 to-orange-400",  bg: "bg-yellow-50", border: "border-yellow-300" },
  { key: "HARD",   label: "දුෂ්කර", emoji: "🔴", color: "from-red-400 to-pink-500",       bg: "bg-red-50",    border: "border-red-300" },
];

export default function CountImageGame() {
  const [level, setLevel] = useState(null);
  const [games, setGames] = useState([]);
  const [gameIdx, setGameIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!level) return;
    setLoading(true);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setGameIdx(0);
    axios.get(`${BASE}/api/vd_count/level/${level}`)
      .then(res => setGames(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [level]);

  const game = games[gameIdx];
  const totalMarks = game?.items?.reduce((sum, i) => sum + i.mark, 0) || 0;

  const submit = () => {
    let total = 0;
    game.items.forEach(item => {
      if (Number(answers[item.label]) === item.correct_answer) {
        total += item.mark;
      }
    });
    setScore(total);
    setSubmitted(true);
  };

  const nextGame = () => {
    setGameIdx(prev => prev + 1);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const reset = () => {
    setLevel(null);
    setGames([]);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setGameIdx(0);
  };

  // ── Level Select ──────────────────────────────────────────
  if (!level) return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-50 to-pink-100 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <div className="text-7xl mb-4 animate-bounce">🐾</div>
        <h1 className="text-4xl font-black text-purple-700 mb-2">ගණන් කරමු!</h1>
        <p className="text-gray-500 text-lg">ඔබේ මට්ටම තෝරන්න</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-5">
        {LEVELS.map(l => (
          <button
            key={l.key}
            onClick={() => setLevel(l.key)}
            className={`bg-gradient-to-br ${l.color} text-white font-black text-2xl px-10 py-8 rounded-3xl shadow-xl hover:scale-105 transition-transform flex flex-col items-center gap-2`}
          >
            <span className="text-5xl">{l.emoji}</span>
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );

  // ── Loading ───────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-purple-100">
      <div className="text-center">
        <div className="text-6xl animate-spin mb-4">🌀</div>
        <p className="text-purple-500 font-bold text-xl">පූරණය වෙමින්...</p>
      </div>
    </div>
  );

  // ── No games ──────────────────────────────────────────────
  if (!games.length) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 to-purple-100 p-6">
      <div className="text-6xl mb-4">😔</div>
      <p className="text-2xl font-bold text-gray-600 mb-6">මෙම මට්ටමේ ක්‍රීඩා නොමැත</p>
      <button onClick={reset} className="bg-purple-500 text-white font-bold px-8 py-4 rounded-2xl text-lg hover:bg-purple-600 transition">
        ← ආපසු යන්න
      </button>
    </div>
  );

  // ── All games done ────────────────────────────────────────
  if (gameIdx >= games.length) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-100 p-6 text-center">
      <div className="text-8xl mb-4">🎉</div>
      <h2 className="text-4xl font-black text-purple-700 mb-2">සියලු ක්‍රීඩා ඉවරයි!</h2>
      <p className="text-gray-500 text-lg mb-8">ඔබ ඉතාම හොඳින් කළා!</p>
      <button onClick={reset} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-10 py-4 rounded-2xl text-xl shadow-lg hover:opacity-90 transition">
        🔄 නැවත ක්‍රීඩා කරන්න
      </button>
    </div>
  );

  const levelInfo = LEVELS.find(l => l.key === level);

  // ── Game Screen ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-50 to-pink-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={reset} className="bg-white text-gray-600 font-bold px-4 py-2 rounded-2xl shadow hover:bg-gray-50 transition text-sm">
            ← ආපසු
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold px-4 py-2 rounded-full bg-gradient-to-r ${levelInfo.color} text-white`}>
              {levelInfo.emoji} {levelInfo.label}
            </span>
            <span className="text-sm bg-white px-3 py-2 rounded-full shadow font-bold text-gray-600">
              {gameIdx + 1} / {games.length}
            </span>
          </div>
        </div>

        {/* Game card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Title */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-5 text-white text-center">
            <h2 className="text-xl font-black">{game.title}</h2>
            <p className="text-purple-200 text-sm mt-1">රූපයේ ඇති ගණන ගණන් කරන්න! 🔢</p>
          </div>

          {/* Question image */}
          <div className="p-4">
            <img
              src={`${BASE}${game.question_image_url}`}
              alt="question"
              className="w-full rounded-2xl shadow-md object-contain max-h-72"
              onError={e => e.target.src = "https://via.placeholder.com/600x300?text=No+Image"}
            />
          </div>

          {/* Items */}
          <div className="px-4 pb-4 space-y-3">
            <p className="text-center text-sm font-bold text-gray-500">⬇️ ගණන් ඇතුළු කරන්න</p>
            {game.items.map((item, idx) => {
              const userAns = Number(answers[item.label]);
              const correct = submitted && userAns === item.correct_answer;
              const wrong = submitted && userAns !== item.correct_answer;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition ${
                    correct ? "bg-green-50 border-green-400" :
                    wrong   ? "bg-red-50 border-red-400" :
                    "bg-gray-50 border-gray-200"
                  }`}
                >
                  {item.image_url && (
                    <img
                      src={`${BASE}${item.image_url}`}
                      className="w-14 h-14 object-contain rounded-xl"
                      onError={e => e.target.style.display = "none"}
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-gray-700 text-sm">{item.label}</p>
                    {submitted && (
                      <p className={`text-xs font-bold ${correct ? "text-green-600" : "text-red-500"}`}>
                        {correct ? `✅ නිවැරදියි! +${item.mark}` : `❌ නිවැරදි: ${item.correct_answer}`}
                      </p>
                    )}
                  </div>
                  <input
                    type="number"
                    min="0"
                    disabled={submitted}
                    className={`w-20 text-center text-xl font-black border-2 rounded-2xl p-2 focus:outline-none transition ${
                      correct ? "border-green-400 bg-green-100 text-green-700" :
                      wrong   ? "border-red-400 bg-red-100 text-red-700" :
                      "border-purple-300 focus:border-purple-500"
                    }`}
                    value={answers[item.label] ?? ""}
                    onChange={e => setAnswers(prev => ({ ...prev, [item.label]: e.target.value }))}
                  />
                </div>
              );
            })}
          </div>

          {/* Score & Actions */}
          <div className="p-4 pt-0">
            {submitted ? (
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-r from-yellow-300 to-orange-300 rounded-2xl p-5">
                  <div className="text-5xl mb-2">{score === totalMarks ? "🏆" : score > totalMarks / 2 ? "😊" : "💪"}</div>
                  <p className="text-2xl font-black text-white">
                    ලකුණු: {score} / {totalMarks}
                  </p>
                  <p className="text-yellow-100 text-sm mt-1">
                    {score === totalMarks ? "සියල්ල නිවැරදියි!" : "දිගටම කරගෙන යන්න!"}
                  </p>
                </div>
                {gameIdx + 1 < games.length ? (
                  <button onClick={nextGame} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-4 rounded-2xl text-lg hover:opacity-90 transition">
                    ඊළඟ ක්‍රීඩාව →
                  </button>
                ) : (
                  <button onClick={reset} className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black py-4 rounded-2xl text-lg hover:opacity-90 transition">
                    🎉 නිමා!
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={submit}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-4 rounded-2xl text-xl shadow-lg hover:opacity-90 transition"
              >
                ✅ පිළිතුරු ඉදිරිපත් කරන්න
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

