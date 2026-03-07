import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "../../Components/Header";

const BASE = "http://localhost:5000";
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const LEVELS_LIST = [
  { key: "EASY",   label: "පහසු",   emoji: "😊", bg: "from-emerald-400 to-teal-500" },
  { key: "MEDIUM", label: "මධ්‍යම", emoji: "🤔", bg: "from-amber-400 to-orange-500" },
  { key: "HARD",   label: "දුෂ්කර", emoji: "😤", bg: "from-rose-400 to-pink-500" },
];
const LEVELS = Object.fromEntries(LEVELS_LIST.map(l => [l.key, l]));
const getNextLevel = (key) => { const i = LEVELS_LIST.findIndex(l => l.key === key); return i !== -1 && i < LEVELS_LIST.length - 1 ? LEVELS_LIST[i + 1] : null; };

function GameInstructions() {
  return (
    <div className="bg-white bg-opacity-80 rounded-2xl shadow p-4 mb-6 max-w-2xl mx-auto border border-violet-100">
      <h3 className="text-base font-black text-violet-700 mb-2">📋 ක්‍රීඩා උපදෙස් (Game Instructions)</h3>
      <p className="text-sm text-gray-700 leading-relaxed">
        මෙම ක්‍රීඩාවේදී ඔබට අකුරු හෝ ඉලක්කම් කිහිපයක් පෙන්වනු ලැබේ. ඔබ කළ යුත්තේ, ආවෘතව හෝ අනිත් දිශාවට හැරී ඇති (rotated/flipped) අකුරු හෝ ඉලක්කම් ඇතුළත් වස්තු අතරින් නිවැරදි එක හඳුනාගෙන එය නිවැරදි ස්ථානයට <strong>Drag and Drop</strong> කිරීමයි.
      </p>
      <p className="text-xs text-green-600 font-bold mt-3">🔄 නැවත ක්‍රීඩා කිරීමට "නැවත ක්‍රීඩා කරන්න" බොත්තම තෝරන්න.</p>
      <p className="text-xs text-gray-500 mt-1">🎮 වෙනත් මට්ටමක් සඳහා "වෙනත් මට්ටමක් ක්‍රීඩා කරන්න" බොත්තම තෝරන්න.</p>
    </div>
  );
}

export default function UserVdDragTextImage() {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [activities, setActivities]       = useState([]);
  const [actIndex, setActIndex]           = useState(0);
  const [loading, setLoading]             = useState(false);
  const [draggableItems, setDraggableItems] = useState([]);
  const [dropZones, setDropZones]         = useState({});
  const [results, setResults]             = useState({});
  const [score, setScore]                 = useState(0);
  const [dragging, setDragging]           = useState(null);
  const [finished, setFinished]           = useState(false);
  const totalMarks = useRef(0);

  const activity  = activities[actIndex] || null;
  const nextLevel = getNextLevel(selectedLevel);

  useEffect(() => {
    if (!selectedLevel) return;
    setLoading(true);
    axios.get(`${BASE}/api/vd_drag_text/level/${selectedLevel}`)
      .then(r => { setActivities(shuffle(r.data).slice(0, 1)); setActIndex(0); })
      .catch(console.error).finally(() => setLoading(false));
  }, [selectedLevel]);

  useEffect(() => {
    if (!activity) return;
    // ALL items (correct + distractors) go into the draggable pool
    setDraggableItems(shuffle(activity.items.map((item, i) => ({ ...item, id: `item-${i}` }))));
    const zones = {};
    activity.targets.forEach(t => { if (t !== "distractor") zones[t] = null; });
    setDropZones(zones);
    setResults({});
    setScore(0);
    setFinished(false);
    // Total marks = only correct-answer items (exclude distractors)
    totalMarks.current = activity.items
      .filter(it => it.group !== "distractor")
      .reduce((s, it) => s + (it.mark || 2), 0);
  }, [activity]);

  const handleDragStart = (e, item) => { setDragging(item); e.dataTransfer.effectAllowed = "move"; };
  const handleDragOver  = (e) => e.preventDefault();

  const handleDropOnZone = (e, target) => {
    e.preventDefault();
    if (!dragging) return;
    const prev = dropZones[target];
    setDraggableItems(cur => { let u = cur.filter(it => it.id !== dragging.id); if (prev) u = [...u, prev]; return u; });
    const isCorrect = dragging.group === target; // distractors have group="distractor", never matches
    setScore(s => { let n = s; if (prev && results[prev.id] === "correct") n -= (prev.mark || 2); if (isCorrect) n += (dragging.mark || 2); return n; });
    setDropZones(z => ({ ...z, [target]: dragging }));
    setResults(r => { const n = { ...r }; if (prev) delete n[prev.id]; n[dragging.id] = isCorrect ? "correct" : "wrong"; return n; });
    setDragging(null);
  };

  const handleDropToPool = (e) => {
    e.preventDefault();
    if (!dragging) return;
    setDropZones(z => { const n = { ...z }; Object.keys(n).forEach(k => { if (n[k]?.id === dragging.id) n[k] = null; }); return n; });
    setScore(s => results[dragging.id] === "correct" ? s - (dragging.mark || 2) : s);
    setResults(r => { const n = { ...r }; delete n[dragging.id]; return n; });
    setDraggableItems(items => items.find(it => it.id === dragging.id) ? items : [...items, dragging]);
    setDragging(null);
  };

  const checkFinished = () => {
    if (Object.values(dropZones).some(v => v === null)) return alert("සියලු රූප තබා ඉදිරියට යන්න!");
    setFinished(true);
  };

  const restart = () => {
    setDraggableItems(shuffle(activity.items.map((item, i) => ({ ...item, id: `item-${i}` }))));
    const zones = {}; activity.targets.forEach(t => { if (t !== "distractor") zones[t] = null; });
    setDropZones(zones); setResults({}); setScore(0); setFinished(false);
  };

  const nextActivity = () => { if (actIndex < activities.length - 1) setActIndex(i => i + 1); else setSelectedLevel(null); };
  const goNextLevel  = () => { setActivities([]); setResults({}); setScore(0); setActIndex(0); setFinished(false); setSelectedLevel(nextLevel.key); };

  // ── Level select ──
  if (!selectedLevel) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200">
      <Header />
      <div className="flex flex-col items-center justify-center p-6 pt-10">
        <div className="text-center mb-10">
          <div className="text-6xl mb-3">🧩</div>
          <h1 className="text-4xl font-black text-violet-700">අකුරු ගලපන්න!</h1>
          <p className="text-gray-500 mt-2 text-lg">ඔබේ මට්ටම තෝරන්න</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
          {LEVELS_LIST.map(l => (
            <button key={l.key} onClick={() => setSelectedLevel(l.key)}
              className={`flex-1 py-7 rounded-3xl bg-gradient-to-br ${l.bg} text-white font-black text-xl shadow-xl hover:scale-105 transition-transform flex flex-col items-center gap-2`}>
              <span className="text-5xl">{l.emoji}</span>{l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const cfg = LEVELS[selectedLevel];

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 flex items-center justify-center">
      <div className="text-center"><div className="text-7xl animate-bounce mb-3">🌟</div><p className="text-2xl font-black text-violet-500">පූරණය වෙමින්...</p></div>
    </div>
  );

  if (!activity) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="text-6xl mb-3">📭</div>
        <p className="text-2xl font-black text-gray-500">{cfg.label} මට්ටමේ ක්‍රියාකාරකම් නැත!</p>
        <button onClick={() => setSelectedLevel(null)} className="mt-5 px-6 py-3 bg-violet-500 text-white font-bold rounded-2xl hover:bg-violet-600">← ආපසු යන්න</button>
      </div>
    </div>
  );

  // ── Finished ──
  if (finished) {
    const percent = totalMarks.current > 0 ? Math.round((score / totalMarks.current) * 100) : 0;
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border-4 border-violet-200">
          <div className="text-7xl mb-3">{percent === 100 ? "🏆" : percent >= 60 ? "🌟" : "💪"}</div>
          <h2 className="text-3xl font-black text-violet-700 mb-1">{percent === 100 ? "නියමයි!" : percent >= 60 ? "හොඳයි!" : "නැවත උත්සාහ කරන්න!"}</h2>
          <div className={`rounded-2xl p-5 my-5 bg-gradient-to-r ${cfg.bg}`}>
            <span className="text-5xl font-black text-white">{score}</span>
            <span className="text-white text-xl"> / {totalMarks.current}</span>
            <p className="text-white/70 text-sm mt-1">ලකුණු</p>
          </div>
          <div className="space-y-2 mb-5">
            {Object.keys(dropZones).map(t => {
              const placed = dropZones[t]; const correct = placed?.group === t;
              return (
                <div key={t} className={`flex items-center gap-3 p-2 rounded-xl ${correct ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                  <span className="text-2xl font-black w-10 text-center">{t}</span>
                  {placed && <img src={`${BASE}${placed.image_url}`} alt="" className="w-10 h-10 object-contain rounded-lg" />}
                  <span className="ml-auto text-xl">{correct ? "✅" : "❌"}</span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button onClick={restart} className="flex-1 py-3 border-2 border-violet-200 text-violet-600 font-black rounded-2xl hover:bg-violet-50">🔄 නැවත කරන්න</button>
              <button onClick={nextActivity} className={`flex-1 py-3 bg-gradient-to-r ${cfg.bg} text-white font-black rounded-2xl`}>
                {actIndex < activities.length - 1 ? "ඊළඟ ➡️" : "🏠 මුල් පිටුව"}
              </button>
            </div>
            {nextLevel && (
              <button onClick={goNextLevel} className={`w-full py-3 bg-gradient-to-r ${nextLevel.bg} text-white font-black rounded-2xl hover:opacity-90`}>
                {nextLevel.emoji} {nextLevel.label} මට්ටමට යන්න →
              </button>
            )}
            <button onClick={() => setSelectedLevel(null)} className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-black rounded-2xl hover:opacity-90">
              🎮 වෙනත් මට්ටමක් ක්‍රීඩා කරන්න
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main game ──
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 select-none p-4 md:p-8">
      <GameInstructions />

      <div className="flex items-center justify-between mb-5 max-w-3xl mx-auto">
        <button onClick={() => setSelectedLevel(null)} className="text-violet-500 font-bold text-sm hover:text-violet-700">← මට්ටම්</button>
        <span className={`px-3 py-1 rounded-full text-sm font-black bg-gradient-to-r ${cfg.bg} text-white`}>{cfg.emoji} {cfg.label}</span>
        <span className="text-gray-400 text-sm">{actIndex + 1} / {activities.length}</span>
      </div>

      <div className="text-center mb-5">
        <h1 className="text-2xl md:text-3xl font-black text-violet-700">🧩 {activity.instruction}</h1>
        <p className="text-gray-400 text-sm mt-1">පෙරලූ රූපය නිවැරදි අකුරට ඇදගෙන යන්න!</p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-2xl px-6 py-2 shadow border border-violet-100 flex items-center gap-3">
          <span className="text-xl">⭐</span>
          <span className="text-lg font-black text-violet-700">ලකුණු: {score}</span>
          <span className="text-gray-400 text-sm">/ {totalMarks.current}</span>
        </div>
      </div>

      {/* Drop zones — only real targets (not "distractor") */}
      <div className="flex flex-wrap justify-center gap-5 mb-8 max-w-3xl mx-auto">
        {Object.keys(dropZones).map(target => {
          const placed = dropZones[target]; const status = placed ? results[placed.id] : null;
          return (
            <div key={target} className="flex flex-col items-center gap-1.5">
              <div className="w-20 h-20 bg-white border-4 border-violet-300 rounded-2xl flex items-center justify-center text-3xl font-black text-violet-700 shadow">{target}</div>
              <span className="text-lg">⬇️</span>
              <div onDrop={e => handleDropOnZone(e, target)} onDragOver={handleDragOver}
                className={`w-20 h-20 rounded-2xl border-4 border-dashed flex items-center justify-center transition-all
                  ${placed ? status === "correct" ? "border-green-400 bg-green-50 shadow-lg" : "border-red-400 bg-red-50 shadow-lg"
                    : "border-violet-300 bg-white/60 hover:border-violet-500 hover:bg-violet-50"}`}>
                {placed ? (
                  <div className="relative w-full h-full">
                    <img src={`${BASE}${placed.image_url}`} alt="" draggable onDragStart={e => handleDragStart(e, placed)}
                      className="w-full h-full object-contain rounded-xl cursor-grab p-1" />
                    <span className="absolute top-0 right-0 text-base">{status === "correct" ? "✅" : "❌"}</span>
                  </div>
                ) : <span className="text-2xl opacity-20">🖼️</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Draggable pool — ALL images including distractors */}
      <div onDrop={handleDropToPool} onDragOver={handleDragOver}
        className="bg-white/70 backdrop-blur rounded-3xl border-2 border-violet-200 p-4 shadow-inner max-w-2xl mx-auto min-h-[130px]">
        <p className="text-center text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide">
          🎲 මෙම රූප ඉහත නිවැරදි අකුරට ඇදගෙන යන්න
        </p>
        {draggableItems.length === 0
          ? <p className="text-center text-gray-300 text-base py-4">සියල්ල තබා ඇත! ✨</p>
          : (
            <div className="flex flex-wrap justify-center gap-3">
              {draggableItems.map(item => (
                <img key={item.id} src={`${BASE}${item.image_url}`} alt="" draggable
                  onDragStart={e => handleDragStart(e, item)}
                  className="w-20 h-20 object-contain bg-white rounded-2xl border-2 border-violet-200 shadow cursor-grab hover:scale-110 hover:shadow-lg hover:border-violet-400 transition-all p-1" />
              ))}
            </div>
          )}
      </div>

      <div className="text-center mt-7 flex flex-col items-center gap-3">
        <button onClick={checkFinished}
          className={`px-10 py-4 bg-gradient-to-r ${cfg.bg} text-white font-black text-xl rounded-2xl shadow-lg hover:scale-105 transition-transform`}>
          ✅ මගේ පිළිතුරු පරීක්ෂා කරන්න!
        </button>
        <button onClick={() => setSelectedLevel(null)}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-black text-base rounded-2xl shadow hover:opacity-90 transition">
          🎮 වෙනත් මට්ටමක් ක්‍රීඩා කරන්න
        </button>
      </div>
    </div>
  );
}