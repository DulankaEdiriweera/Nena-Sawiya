import { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../../Components/AdminHeader";

const BASE = "http://localhost:5000";

export default function AdminManageCountImageGames() {
  const [games, setGames] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/api/vd_count/all`);
      setGames(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGames(); }, []);

  const deleteGame = async (id, title) => {
    if (!window.confirm(`"${title}" මකා දැමීමට විශ්වාසද?`)) return;
    await axios.delete(`${BASE}/api/vd_count/delete/${id}`);
    fetchGames();
  };

  const updateItem = (idx, field, value) => {
    setEditing(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === idx ? { ...item, [field]: value } : item)
    }));
  };

  const saveEdit = async () => {
    await axios.put(`${BASE}/api/vd_count/update/${editing._id}`, editing);
    setEditing(null);
    fetchGames();
  };

  const levelBadge = (level) => {
    const map = { EASY: "bg-green-100 text-green-700", MEDIUM: "bg-yellow-100 text-yellow-700", HARD: "bg-red-100 text-red-700" };
    const label = { EASY: "🟢 පහසු", MEDIUM: "🟡 මධ්‍යම", HARD: "🔴 දුෂ්කර" };
    return <span className={`text-xs font-bold px-3 py-1 rounded-full ${map[level]}`}>{label[level]}</span>;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="text-center">
        <div className="text-5xl animate-bounce">🎮</div>
        <p className="text-orange-400 font-bold mt-3">පූරණය වෙමින්...</p>
      </div>
    </div>
  );

  return (
    <div>
      <div><AdminHeader/></div>

      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl p-6 mb-6 text-white text-center shadow-lg">
          <div className="text-4xl mb-2">📋</div>
          <h1 className="text-2xl font-bold">ක්‍රීඩා කළමනාකරණය</h1>
          <p className="text-purple-200 text-sm mt-1">ක්‍රීඩා {games.length}ක් ඇත</p>
        </div>

        {games.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-400 text-lg font-bold">ක්‍රීඩා නොමැත</p>
          </div>
        ) : (
          <div className="space-y-4">
            {games.map((g) => (
              <div key={g._id} className="bg-white rounded-3xl shadow-lg overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 items-start">
                      <img
                        src={`${BASE}${g.question_image_url}`}
                        className="w-24 h-20 object-cover rounded-2xl shadow-sm"
                        onError={e => e.target.src = "https://via.placeholder.com/96x80?text=No+Image"}
                      />
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{g.title}</h3>
                        <div className="mt-1">{levelBadge(g.level)}</div>
                        <p className="text-sm text-gray-400 mt-1">අයිතම: {g.items?.length || 0}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => setEditing(JSON.parse(JSON.stringify(g)))}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-4 py-2 rounded-xl transition text-sm"
                      >
                        ✏️ සංස්කරණය
                      </button>
                      <button
                        onClick={() => deleteGame(g._id, g.title)}
                        className="bg-red-400 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-xl transition text-sm"
                      >
                        🗑️ මකන්න
                      </button>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {g.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-orange-50 rounded-xl px-3 py-2">
                        {item.image_url && (
                          <img src={`${BASE}${item.image_url}`} className="w-8 h-8 object-cover rounded-lg"
                            onError={e => e.target.style.display = "none"} />
                        )}
                        <div>
                          <p className="text-xs font-bold text-gray-700">{item.label}</p>
                          <p className="text-xs text-gray-400">✅ {item.correct_answer} | ⭐ {item.mark}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-t-3xl p-5 text-white">
              <h3 className="text-xl font-bold">✏️ ක්‍රීඩාව සංස්කරණය කරන්න</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-600 block mb-1">🏷️ මාතෘකාව</label>
                <input
                  className="border-2 border-purple-200 rounded-2xl p-3 w-full focus:outline-none focus:border-purple-400"
                  value={editing.title}
                  onChange={e => setEditing({ ...editing, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-600 block mb-1">⭐ මට්ටම</label>
                <select
                  className="border-2 border-purple-200 rounded-2xl p-3 w-full focus:outline-none focus:border-purple-400"
                  value={editing.level}
                  onChange={e => setEditing({ ...editing, level: e.target.value })}
                >
                  <option value="EASY">🟢 පහසු</option>
                  <option value="MEDIUM">🟡 මධ්‍යම</option>
                  <option value="HARD">🔴 දුෂ්කර</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-600 block mb-2">📋 අයිතම</label>
                {editing.items.map((item, idx) => (
                  <div key={idx} className="bg-purple-50 rounded-2xl p-3 mb-3 space-y-2">
                    <p className="text-xs font-bold text-purple-600">අයිතමය {idx + 1}: {item.label}</p>
                    <div>
                      <label className="text-xs text-gray-500">නම</label>
                      <input
                        className="border-2 border-purple-200 rounded-xl p-2 w-full text-sm focus:outline-none focus:border-purple-400"
                        value={item.label}
                        onChange={e => updateItem(idx, "label", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-500">✅ නිවැරදි පිළිතුර</label>
                        <input
                          type="number"
                          min="0"
                          className="border-2 border-purple-200 rounded-xl p-2 w-full text-sm focus:outline-none focus:border-purple-400"
                          value={item.correct_answer}
                          onChange={e => updateItem(idx, "correct_answer", Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">⭐ ලකුණු</label>
                        <input
                          type="number"
                          min="1"
                          className="border-2 border-purple-200 rounded-xl p-2 w-full text-sm focus:outline-none focus:border-purple-400"
                          value={item.mark}
                          onChange={e => updateItem(idx, "mark", Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={saveEdit}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-3 rounded-2xl hover:opacity-90 transition"
                >
                  💾 සුරකින්න
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="flex-1 bg-gray-200 text-gray-600 font-bold py-3 rounded-2xl hover:bg-gray-300 transition"
                >
                  ✕ අවලංගු
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

    </div>
    
  );
}

