import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../Components/Header";

const BASE = "http://localhost:5000";
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const LEVELS = [
  { key: "EASY",   label: "පහසු",   emoji: "🟢", color: "from-green-400 to-emerald-500" },
  { key: "MEDIUM", label: "මධ්‍යම", emoji: "🟡", color: "from-yellow-400 to-orange-400" },
  { key: "HARD",   label: "දුෂ්කර", emoji: "🔴", color: "from-red-400 to-pink-500"      },
];

// Helper: get the next level key after current
const getNextLevel = (currentKey) => {
  const idx = LEVELS.findIndex(l => l.key === currentKey);
  return idx !== -1 && idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
};

const INSTRUCTIONS = [
  "තිරයේ විවිධ වස්තු/රූප කිහිපයක් ඔබට පෙන්වනු ඇත.",
  "එකම ආකාරයට පෙනෙන වස්තු කීයක් තිබේදැයි හොඳින් ගණන් කරන්න.",
  "සෑම වස්තුවක් ඉදිරියෙම ඇති කොටුව තුළ එම වස්තුවේ ගණන ටයිප් කරන්න.",
  "සියලුම වස්තු සඳහා නිවැරදි ගණන ඇතුළත් කරන්න.",
  "සියල්ල අවසන් වූ පසු Submit බොත්තම ඔබා ඔබගේ පිළිතුරු සම්මත කරන්න.",
];

function GameInstructions() {
  return (
    <div className="bg-white bg-opacity-80 rounded-2xl shadow p-4 mb-6 max-w-2xl mx-auto border border-purple-100">
      <h3 className="text-base font-black text-purple-700 mb-2">📋 ක්‍රීඩා උපදෙස් (Game Instructions)</h3>
      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
        {INSTRUCTIONS.map((tip, i) => <li key={i}>{tip}</li>)}
      </ol>
      <p className="text-xs text-green-600 font-bold mt-3">✅ සියලුම ගණන් නිවැරදි නම්, ඔබ ක්‍රීඩාව සාර්ථකව අවසන් කරයි. 🎉</p>
      <p className="text-xs text-gray-500 mt-1">🎮 ඔබට නැවත ක්‍රීඩා කිරීමට හෝ වෙනත් මට්ටමක් තෝරාගත හැක.</p>
    </div>
  );
}

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
      .then(res => {
        const randomGame = shuffle(res.data).slice(0, 1);
        setGames(randomGame);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [level]);

  const game = games[gameIdx];
  const totalMarks = game?.items?.reduce((sum, i) => sum + i.mark, 0) || 0;
  const nextLevel = getNextLevel(level);

  const submit = () => {
    let total = 0;
    game.items.forEach(item => {
      if (Number(answers[item.label]) === item.correct_answer) total += item.mark;
    });
    setScore(total);
    setSubmitted(true);
  };

  const nextGame = () => { setGameIdx(p => p + 1); setAnswers({}); setSubmitted(false); setScore(0); };
  const reset = () => { setLevel(null); setGames([]); setAnswers({}); setSubmitted(false); setScore(0); setGameIdx(0); };
  const goNextLevel = () => { setGames([]); setAnswers({}); setSubmitted(false); setScore(0); setGameIdx(0); setLevel(nextLevel.key); };

  // ── Level Select (Header only here) ──
  if (!level) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200">
      <Header />
      <div className="flex flex-col items-center justify-center p-6 pt-10">
        <div className="text-center mb-10">
          <div className="text-7xl mb-4 animate-bounce">🐾</div>
          <h1 className="text-4xl font-black text-purple-700 mb-2">වස්තු ගණන් කිරීමේ ක්‍රීඩාව කරමු!</h1>
          <p className="text-gray-500 text-lg">ඔබේ මට්ටම තෝරන්න</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-5">
          {LEVELS.map(l => (
            <button key={l.key} onClick={() => setLevel(l.key)}
              className={`bg-gradient-to-br ${l.color} text-white font-black text-2xl px-10 py-8 rounded-3xl shadow-xl hover:scale-105 transition-transform flex flex-col items-center gap-2`}>
              <span className="text-5xl">{l.emoji}</span>{l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-indigo-200">
      <div className="text-center">
        <div className="text-6xl animate-spin mb-4">🌀</div>
        <p className="text-purple-500 font-bold text-xl">පූරණය වෙමින්...</p>
      </div>
    </div>
  );

  if (!games.length) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-indigo-200 p-6">
      <div className="text-6xl mb-4">😔</div>
      <p className="text-2xl font-bold text-gray-600 mb-6">මෙම මට්ටමේ ක්‍රීඩා නොමැත</p>
      <button onClick={reset} className="bg-purple-500 text-white font-bold px-8 py-4 rounded-2xl text-lg hover:bg-purple-600 transition">← ආපසු යන්න</button>
    </div>
  );

  // ── All done ──
  if (gameIdx >= games.length) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-indigo-200 p-6 text-center">
      <div className="text-8xl mb-4">🎉</div>
      <h2 className="text-4xl font-black text-purple-700 mb-2">ක්‍රියාකාරකම ඉවරයි!</h2>
      <p className="text-gray-500 text-lg mb-8">ඔබ ඉතාම හොඳින් කළා!</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={() => { setGameIdx(0); setAnswers({}); setSubmitted(false); setScore(0); }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-lg hover:opacity-90 transition">
          🔄 නැවත ක්‍රීඩා කරන්න
        </button>
        {nextLevel && (
          <button onClick={goNextLevel}
            className={`bg-gradient-to-r ${nextLevel.color} text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-lg hover:opacity-90 transition`}>
            {nextLevel.emoji} {nextLevel.label} මට්ටමට යන්න →
          </button>
        )}
        <button onClick={reset}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-lg hover:opacity-90 transition">
          🎮 වෙනත් මට්ටමක් ක්‍රීඩා කරන්න
        </button>
      </div>
    </div>
  );

  const levelInfo = LEVELS.find(l => l.key === level);

  // ── Main game (no Header) ──
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 p-4">
      <GameInstructions />

      <div className="max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={reset} className="bg-white text-gray-600 font-bold px-4 py-2 rounded-2xl shadow hover:bg-gray-50 transition text-sm">← ආපසු</button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold px-4 py-2 rounded-full bg-gradient-to-r ${levelInfo.color} text-white`}>
              {levelInfo.emoji} {levelInfo.label}
            </span>
            <span className="text-sm bg-white px-3 py-2 rounded-full shadow font-bold text-gray-600">{gameIdx + 1} / {games.length}</span>
          </div>
        </div>

        {/* Game card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-5 text-white text-center">
            <h2 className="text-xl font-black">{game.title}</h2>
            <p className="text-purple-200 text-sm mt-1">රූපයේ ඇති වස්තූන් ගණන් කරන්න! 🔢</p>
          </div>

          <div className="p-4">
            <img
              src={`${BASE}${game.question_image_url}`}
              alt="question"
              className="w-full rounded-2xl shadow-md object-contain max-h-72"
              onError={e => e.target.src = "https://via.placeholder.com/600x300?text=No+Image"}
            />
          </div>

          <div className="px-4 pb-4 space-y-3">
            <p className="text-center text-sm font-bold text-gray-500">⬇️ ගණන් ඇතුළු කරන්න</p>
            {game.items.map((item, idx) => {
              const userAns = Number(answers[item.label]);
              const correct = submitted && userAns === item.correct_answer;
              const wrong = submitted && userAns !== item.correct_answer;
              return (
                <div key={idx} className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition ${correct ? "bg-green-50 border-green-400" : wrong ? "bg-red-50 border-red-400" : "bg-gray-50 border-gray-200"}`}>
                  {item.image_url && (
                    <img src={`${BASE}${item.image_url}`} className="w-14 h-14 object-contain rounded-xl" onError={e => e.target.style.display = "none"} />
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
                    type="number" min="0" disabled={submitted}
                    className={`w-20 text-center text-xl font-black border-2 rounded-2xl p-2 focus:outline-none transition ${correct ? "border-green-400 bg-green-100 text-green-700" : wrong ? "border-red-400 bg-red-100 text-red-700" : "border-purple-300 focus:border-purple-500"}`}
                    value={answers[item.label] ?? ""}
                    onChange={e => setAnswers(prev => ({ ...prev, [item.label]: e.target.value }))}
                  />
                </div>
              );
            })}
          </div>

          <div className="p-4 pt-0">
            {submitted ? (
              <div className="text-center space-y-3">
                <div className="bg-gradient-to-r from-yellow-300 to-orange-300 rounded-2xl p-5">
                  <div className="text-5xl mb-2">{score === totalMarks ? "🏆" : score > totalMarks / 2 ? "😊" : "💪"}</div>
                  <p className="text-2xl font-black text-white">ලකුණු: {score} / {totalMarks}</p>
                  <p className="text-yellow-100 text-sm mt-1">{score === totalMarks ? "සියල්ල නිවැරදියි!" : "දිගටම කරගෙන යන්න!"}</p>
                </div>
                {gameIdx + 1 < games.length ? (
                  <button onClick={nextGame} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-4 rounded-2xl text-lg hover:opacity-90 transition">
                    ඊළඟ ක්‍රීඩාව →
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button onClick={() => { setGameIdx(0); setAnswers({}); setSubmitted(false); setScore(0); }}
                      className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black py-4 rounded-2xl text-lg hover:opacity-90 transition">
                      🔄 නැවත ක්‍රීඩා කරන්න
                    </button>
                    {nextLevel && (
                      <button onClick={goNextLevel}
                        className={`w-full bg-gradient-to-r ${nextLevel.color} text-white font-black py-3 rounded-2xl text-base hover:opacity-90 transition`}>
                        {nextLevel.emoji} {nextLevel.label} මට්ටමට යන්න →
                      </button>
                    )}
                    <button onClick={reset}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-black py-3 rounded-2xl text-base hover:opacity-90 transition">
                      🎮 වෙනත් මට්ටමක් ක්‍රීඩා කරන්න
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={submit} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-4 rounded-2xl text-xl shadow-lg hover:opacity-90 transition">
                ✅ පිළිතුරු ඉදිරිපත් කරන්න
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}