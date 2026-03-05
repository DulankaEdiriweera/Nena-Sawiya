import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "../../Components/Header";

const BASE = "http://localhost:5000";
const COUNTDOWN = 30;

const levelConfig = {
  EASY:   { label: "පහසු",   emoji: "🌟", gradient: "linear-gradient(135deg, #d1fae5, #a7f3d0)", border: "#34d399", btn: "linear-gradient(135deg, #10b981, #059669)", desc: "ආරම්භකයින් සඳහා" },
  MEDIUM: { label: "මධ්‍යම", emoji: "🔥", gradient: "linear-gradient(135deg, #fef3c7, #fde68a)", border: "#fbbf24", btn: "linear-gradient(135deg, #f59e0b, #d97706)", desc: "ටිකක් අභියෝගාත්මකයි" },
  HARD:   { label: "දුෂ්කර", emoji: "🏆", gradient: "linear-gradient(135deg, #fee2e2, #fecaca)", border: "#f87171", btn: "linear-gradient(135deg, #ef4444, #dc2626)", desc: "ක්‍රීඩා චැම්පියන්ලා සඳහා" },
};

const LEVELS_LIST = ["EASY", "MEDIUM", "HARD"];
const getNextLevel = (current) => {
  const idx = LEVELS_LIST.indexOf(current);
  return idx !== -1 && idx < LEVELS_LIST.length - 1 ? LEVELS_LIST[idx + 1] : null;
};

function GameInstructions() {
  return (
    <div className="bg-white bg-opacity-80 rounded-2xl shadow p-4 mb-6 max-w-2xl mx-auto border border-indigo-100">
      <h3 className="text-base font-black text-indigo-700 mb-2">📋 ක්‍රීඩා උපදෙස් (Game Instructions)</h3>
      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
        <li>පළමුව පිටුවේ රූපයක් <strong>30 තත්පර</strong> පෙන්වනු ලැබේ.</li>
        <li>රූපය නැවතී යාමට පසු, රූපය සම්බන්ධ ප්‍රශ්න කිහිපයක් ඔබට ඉදිරිපත් කෙරේ.</li>
        <li>ඔබේ කාර්යය, අදාල රූපයේ විස්තර මත පදනම්ව පිළිතුරු ලබා දීමයි.</li>
      </ol>
      <p className="text-xs text-indigo-600 font-bold mt-3">
        🧠 මෙම ක්‍රීඩාව දෘශ්‍ය මතකය (Visual Memory) පරීක්ෂා කිරීමට සහ වර්ධනය කිරීමට උපකාරී වේ.
      </p>
    </div>
  );
}

export default function MemoryGamePage() {
  const [screen, setScreen] = useState("level");
  const [level, setLevel] = useState(null);
  const [game, setGame] = useState(null);
  const [loadingGame, setLoadingGame] = useState(false);
  const [noGame, setNoGame] = useState(false);
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);
  const timerRef = useRef(null);

  const startLevel = async (lvl) => {
    setLevel(lvl);
    setLoadingGame(true);
    setNoGame(false);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    try {
      const res = await axios.get(`${BASE}/api/vd_memory/level/${lvl}`);
      if (!res.data || res.data.length === 0) { setNoGame(true); setScreen("level"); setLoadingGame(false); return; }
      // Randomly pick 1 game from the level's collection
      const shuffled = [...res.data].sort(() => Math.random() - 0.5);
      const picked = shuffled[0];
      setGame(picked);
      setTotalMarks(picked.questions.reduce((s, q) => s + (q.mark || 1), 0));
      setTimeLeft(COUNTDOWN);
      setScreen("image");
    } catch {
      setNoGame(true);
      setScreen("level");
    }
    setLoadingGame(false);
  };

  useEffect(() => {
    if (screen !== "image") { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); setScreen("quiz"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [screen]);

  const handleAnswer = (qIdx, oIdx) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const submitAnswers = () => {
    let earned = 0;
    game.questions.forEach((q, i) => {
      if (answers[i] !== undefined && parseInt(answers[i]) === parseInt(q.correct)) earned += q.mark || 1;
    });
    setScore(earned);
    setSubmitted(true);
    setScreen("result");
  };

  const answeredCount = Object.keys(answers).length;
  const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
  const gradeInfo = percentage >= 80 ? { label: "විශිෂ්ටයි! 🌟", color: "#065f46", bg: "#d1fae5" }
    : percentage >= 60 ? { label: "ඉතා හොඳයි! 🎉", color: "#92400e", bg: "#fef3c7" }
    : percentage >= 40 ? { label: "හොඳයි! 👍", color: "#1e40af", bg: "#dbeafe" }
    : { label: "නැවත උත්සාහ කරන්න! 💪", color: "#991b1b", bg: "#fee2e2" };

  const nextLevel = getNextLevel(level);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
        .card { background: white; border-radius: 28px; box-shadow: 0 8px 40px rgba(0,0,0,0.10); }
        .option-btn { width: 100%; padding: 14px 18px; border-radius: 16px; border: 3px solid #e0e7ff; background: white; font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 1rem; cursor: pointer; text-align: left; display: flex; align-items: center; gap: 12px; transition: all 0.2s; }
        .option-btn:hover:not(:disabled) { border-color: #6366f1; background: #f5f3ff; transform: translateX(4px); }
        .option-btn:disabled { cursor: default; }
        @keyframes pop-in { 0% { transform: scale(0.7); opacity: 0; } 80% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
        .pop-in { animation: pop-in 0.4s ease-out; }
      `}</style>

      {/* ===== LEVEL SELECT ===== */}
      {screen === "level" && (
        <div>
          <Header />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 24, paddingTop: 32 }}>
            <GameInstructions />

            <div className="pop-in" style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: "4rem" }}>🧠</div>
              <h1 style={{ fontWeight: 900, fontSize: "2.2rem", color: "#4f46e5", margin: "10px 0 4px" }}>දෘශ්‍ය ක්‍රීඩාව!</h1>
              <p style={{ color: "#9ca3af", fontWeight: 700, fontSize: "1.05rem" }}>ඔබේ මට්ටම තෝරන්න</p>
            </div>

            {noGame && (
              <div style={{ background: "#fff1f2", border: "2px solid #fca5a5", borderRadius: 16, padding: "12px 24px", marginBottom: 20, color: "#dc2626", fontWeight: 700 }}>
                ⚠️ එම මට්ටමට ක්‍රීඩා නොමැත. වෙනත් මට්ටමක් තෝරන්න.
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, width: "100%", maxWidth: 680 }}>
              {Object.entries(levelConfig).map(([key, cfg], i) => (
                <button key={key} onClick={() => startLevel(key)} disabled={loadingGame}
                  style={{ background: cfg.gradient, border: `3px solid ${cfg.border}`, borderRadius: 24, padding: "32px 20px", cursor: "pointer", textAlign: "center", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 6px 24px rgba(0,0,0,0.08)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.06)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.15)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)"; }}
                >
                  <div style={{ fontSize: "3.5rem", marginBottom: 10 }}>{cfg.emoji}</div>
                  <div style={{ fontWeight: 900, fontSize: "1.4rem", color: "#1f2937", marginBottom: 6 }}>{cfg.label}</div>
                  <div style={{ color: "#6b7280", fontWeight: 700, fontSize: "0.85rem" }}>{cfg.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== IMAGE PHASE ===== */}
      {screen === "image" && game && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 24 }}>
          <div className="card pop-in" style={{ width: "100%", maxWidth: 560, padding: "36px 32px", textAlign: "center" }}>
            <h2 style={{ fontWeight: 900, fontSize: "1.6rem", color: "#4f46e5", marginBottom: 6 }}>👀 හොඳින් බලන්න!</h2>
            <p style={{ color: "#9ca3af", fontWeight: 700, marginBottom: 20 }}>ප්‍රශ්න ඇසෙන්න ඉස්සෙල්ලා මේ පින්තූරය මතක තියාගන්න!</p>
            <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="45" cy="45" r="38" fill="none" stroke="#e0e7ff" strokeWidth="7" />
                <circle cx="45" cy="45" r="38" fill="none" stroke={timeLeft <= 5 ? "#ef4444" : "#6366f1"} strokeWidth="7"
                  strokeDasharray="239" strokeDashoffset={239 - (timeLeft / COUNTDOWN) * 239} strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }} />
              </svg>
              <div style={{ position: "absolute", textAlign: "center" }}>
                <span style={{ fontWeight: 900, fontSize: "1.8rem", color: timeLeft <= 5 ? "#ef4444" : "#4f46e5" }}>{timeLeft}</span>
              </div>
            </div>
            <div style={{ borderRadius: 20, overflow: "hidden", border: "4px solid #e0e7ff", marginBottom: 20, background: "#f8fafc" }}>
              <img src={`${BASE}${game.image_url}`} alt="Memory" style={{ width: "100%", maxHeight: 280, objectFit: "contain", display: "block" }} />
            </div>
            <h3 style={{ fontWeight: 800, fontSize: "1.2rem", color: "#374151", marginBottom: 16 }}>{game.title}</h3>
            <button onClick={() => { clearInterval(timerRef.current); setScreen("quiz"); }}
              style={{ background: "none", border: "none", color: "#9ca3af", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem", textDecoration: "underline" }}>
              ඉදිරියට යන්න →
            </button>
          </div>
        </div>
      )}

      {/* ===== QUIZ PHASE ===== */}
      {screen === "quiz" && game && (
        <div style={{ minHeight: "100vh", padding: "24px 16px" }}>
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <div className="card pop-in" style={{ padding: "16px 24px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
              <img src={`${BASE}${game.image_url}`} alt="" style={{ width: 60, height: 50, objectFit: "cover", borderRadius: 12, border: "2px solid #e0e7ff" }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 900, color: "#1f2937", margin: 0 }}>{game.title}</p>
                <p style={{ color: "#9ca3af", fontWeight: 700, fontSize: "0.8rem", margin: "2px 0 0" }}>{answeredCount}/{game.questions.length} ප්‍රශ්නවලට පිළිතුරු දෙන ලදී</p>
              </div>
              <div style={{ background: levelConfig[level].gradient, border: `2px solid ${levelConfig[level].border}`, borderRadius: 12, padding: "4px 12px", fontWeight: 800, fontSize: "0.85rem" }}>
                {levelConfig[level].emoji} {levelConfig[level].label}
              </div>
            </div>
            <div style={{ height: 8, background: "#e0e7ff", borderRadius: 8, marginBottom: 24, overflow: "hidden" }}>
              <div style={{ height: "100%", background: "linear-gradient(90deg, #6366f1, #ec4899)", borderRadius: 8, width: `${(answeredCount / game.questions.length) * 100}%`, transition: "width 0.3s" }} />
            </div>
            {game.questions.map((q, qIdx) => (
              <div key={qIdx} className="card pop-in" style={{ padding: 24, marginBottom: 20 }}>
                <p style={{ fontWeight: 800, fontSize: "1.05rem", color: "#1f2937", marginBottom: 16 }}>
                  <span style={{ background: "#ede9fe", color: "#6d28d9", borderRadius: 8, padding: "2px 10px", fontSize: "0.8rem", marginRight: 8, fontWeight: 800 }}>{qIdx + 1}/{game.questions.length}</span>
                  {q.question}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[qIdx] === oIdx;
                    return (
                      <button key={oIdx} className="option-btn" onClick={() => handleAnswer(qIdx, oIdx)}
                        style={isSelected ? { background: "#ede9fe", borderColor: "#6366f1", color: "#4f46e5" } : {}}>
                        <span style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: isSelected ? "#6366f1" : "#f3f4f6", color: isSelected ? "white" : "#6b7280", fontWeight: 900, flexShrink: 0, fontSize: "0.85rem" }}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        {opt}
                        {isSelected && <span style={{ marginLeft: "auto", fontSize: "1.1rem" }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
                <div style={{ marginTop: 10, textAlign: "right" }}>
                  <span style={{ background: "#f3f4f6", color: "#9ca3af", borderRadius: 8, padding: "2px 10px", fontSize: "0.75rem", fontWeight: 700 }}>🏅 {q.mark} ලකුණු</span>
                </div>
              </div>
            ))}
            <button onClick={submitAnswers} disabled={answeredCount === 0}
              style={{ width: "100%", padding: "16px", borderRadius: 20, border: "none", background: answeredCount === 0 ? "#e5e7eb" : "linear-gradient(135deg, #6366f1, #ec4899)", color: answeredCount === 0 ? "#9ca3af" : "white", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "1.15rem", cursor: answeredCount === 0 ? "not-allowed" : "pointer", boxShadow: answeredCount > 0 ? "0 6px 24px rgba(99,102,241,0.35)" : "none", transition: "all 0.2s", marginBottom: 32 }}>
              {answeredCount === 0 ? "ප්‍රශ්නවලට පිළිතුරු දෙන්න" : `ලකුණු බලන්න 🏆 (${answeredCount}/${game.questions.length})`}
            </button>
          </div>
        </div>
      )}

      {/* ===== RESULT PHASE ===== */}
      {screen === "result" && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 24 }}>
          <div className="card pop-in" style={{ maxWidth: 440, width: "100%", padding: "40px 32px", textAlign: "center" }}>
            <div style={{ fontSize: "4rem", marginBottom: 8 }}>{percentage >= 80 ? "🏆" : percentage >= 60 ? "🎉" : percentage >= 40 ? "👍" : "💪"}</div>
            <h2 style={{ fontWeight: 900, fontSize: "2rem", color: "#4f46e5", marginBottom: 4 }}>ඔබේ ලකුණු!</h2>
            <div style={{ width: 140, height: 140, borderRadius: "50%", background: `conic-gradient(#6366f1 ${percentage * 3.6}deg, #e0e7ff 0deg)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "20px auto", boxShadow: "0 8px 32px rgba(99,102,241,0.25)" }}>
              <div style={{ width: 110, height: 110, borderRadius: "50%", background: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontWeight: 900, fontSize: "2rem", color: "#4f46e5" }}>{percentage}%</span>
              </div>
            </div>
            <div style={{ background: gradeInfo.bg, color: gradeInfo.color, borderRadius: 16, padding: "10px 24px", display: "inline-block", fontWeight: 900, fontSize: "1.15rem", marginBottom: 24 }}>
              {gradeInfo.label}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28 }}>
              <div style={{ background: "#d1fae5", borderRadius: 16, padding: "16px 8px" }}>
                <div style={{ fontWeight: 900, fontSize: "1.6rem", color: "#065f46" }}>{game.questions.filter((q, i) => answers[i] !== undefined && parseInt(answers[i]) === parseInt(q.correct)).length}</div>
                <div style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 700 }}>නිවැරදි ✅</div>
              </div>
              <div style={{ background: "#fee2e2", borderRadius: 16, padding: "16px 8px" }}>
                <div style={{ fontWeight: 900, fontSize: "1.6rem", color: "#991b1b" }}>{game.questions.filter((q, i) => answers[i] !== undefined && parseInt(answers[i]) !== parseInt(q.correct)).length}</div>
                <div style={{ fontSize: "0.72rem", color: "#ef4444", fontWeight: 700 }}>වැරදි ❌</div>
              </div>
              <div style={{ background: "#ede9fe", borderRadius: 16, padding: "16px 8px" }}>
                <div style={{ fontWeight: 900, fontSize: "1.6rem", color: "#4f46e5" }}>{score}/{totalMarks}</div>
                <div style={{ fontSize: "0.72rem", color: "#6366f1", fontWeight: 700 }}>ලකුණු 🏅</div>
              </div>
            </div>
            {/* Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => startLevel(level)}
                  style={{ flex: 1, padding: "14px", borderRadius: 18, border: "none", background: "linear-gradient(135deg, #6366f1, #ec4899)", color: "white", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "1rem", cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.3)" }}>
                  🔄 නැවත ක්‍රීඩා කරන්න
                </button>
                <button onClick={() => { setScreen("level"); setGame(null); setLevel(null); }}
                  style={{ flex: 1, padding: "14px", borderRadius: 18, border: "none", background: "#f3f4f6", color: "#6b7280", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "1rem", cursor: "pointer" }}>
                  🏠 මුල් පිටුව
                </button>
              </div>
              {nextLevel && (
                <button onClick={() => startLevel(nextLevel)}
                  style={{ width: "100%", padding: "14px", borderRadius: 18, border: "none", background: levelConfig[nextLevel].btn, color: "white", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "1rem", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
                  {levelConfig[nextLevel].emoji} {levelConfig[nextLevel].label} මට්ටමට යන්න →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}