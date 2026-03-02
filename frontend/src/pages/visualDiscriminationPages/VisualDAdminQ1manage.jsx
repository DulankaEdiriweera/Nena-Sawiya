import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/vd_picture_mcq";

const LEVEL_LABELS = { EASY: "🟢 පහසු", MEDIUM: "🟡 මධ්‍යම", HARD: "🔴 දුෂ්කර" };
const LEVEL_STYLES = { EASY: "bg-green-100 text-green-700", MEDIUM: "bg-yellow-100 text-yellow-700", HARD: "bg-red-100 text-red-700" };

export default function AdminManageVdPictureMCQ() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/all`);
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleEditOpen = (q) => {
    setEditingId(q._id);
    setEditData({
      level: q.level,
      task_number: q.task_number,
      question_text: q.question_text,
      correct_index: q.answers.findIndex(a => a.mark > 0),
    });
  };

  const handleEditSave = async (id) => {
    try {
      await axios.put(`${API}/update/${id}`, editData);
      showSuccess("✅ ප්‍රශ්නය යාවත්කාලීන කරන ලදී!");
      setEditingId(null);
      fetchAll();
    } catch (err) {
      alert("❌ යාවත්කාලීන කිරීම අසාර්ථක විය");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/delete/${id}`);
      showSuccess("🗑️ ප්‍රශ්නය මකා දමන ලදී.");
      setDeleteConfirmId(null);
      fetchAll();
    } catch (err) {
      alert("❌ මකා දැමීම අසාර්ථක විය");
    }
  };

  const filtered = filterLevel === "ALL" ? questions : questions.filter(q => q.level === filterLevel);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="text-center">
        <div className="text-5xl animate-bounce">🖼️</div>
        <p className="text-indigo-400 font-bold mt-3">පූරණය වෙමින්...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-violet-500 to-indigo-500 rounded-3xl p-6 mb-6 text-white text-center shadow-lg">
          <div className="text-4xl mb-2">📋</div>
          <h1 className="text-2xl font-bold">ප්‍රශ්න කළමනාකරණය</h1>
          <p className="text-violet-200 text-sm mt-1">ප්‍රශ්න {questions.length}ක් ඇත</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-5 justify-center flex-wrap">
          {["ALL", "EASY", "MEDIUM", "HARD"].map(lvl => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-5 py-2 rounded-2xl text-sm font-bold transition ${filterLevel === lvl ? "bg-violet-500 text-white shadow" : "bg-white text-gray-600 border-2 border-gray-200 hover:border-violet-300"}`}
            >
              {lvl === "ALL" ? "🔍 සියල්ල" : LEVEL_LABELS[lvl]}
            </button>
          ))}
        </div>

        {successMsg && (
          <div className="mb-5 p-4 bg-green-100 border-2 border-green-300 text-green-700 rounded-2xl font-bold text-center">
            {successMsg}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">😔</div>
            <p className="text-gray-400 text-lg font-bold">ප්‍රශ්න නොමැත</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(q => (
              <div key={q._id} className="bg-white rounded-3xl shadow-lg overflow-hidden">

                {/* Main row */}
                <div className="p-5 flex items-start gap-4">
                  <img
                    src={`http://localhost:5000${q.question_image}`}
                    className="w-20 h-16 object-contain rounded-2xl border-2 border-gray-100 bg-gray-50 flex-shrink-0"
                    onError={e => e.target.src = "https://via.placeholder.com/80x64?text=No+Img"}
                  />

                  <div className="flex-1 min-w-0">
                    {editingId === q._id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs font-bold text-gray-500">⭐ මට්ටම</label>
                            <select
                              className="w-full mt-1 border-2 border-indigo-200 rounded-xl p-2 text-sm focus:outline-none focus:border-indigo-400"
                              value={editData.level}
                              onChange={e => setEditData({ ...editData, level: e.target.value })}
                            >
                              <option value="EASY">🟢 පහසු</option>
                              <option value="MEDIUM">🟡 මධ්‍යම</option>
                              <option value="HARD">🔴 දුෂ්කර</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500">🔢 කාර්ය අංකය</label>
                            <input
                              type="number"
                              className="w-full mt-1 border-2 border-indigo-200 rounded-xl p-2 text-sm focus:outline-none focus:border-indigo-400"
                              value={editData.task_number}
                              onChange={e => setEditData({ ...editData, task_number: Number(e.target.value) })}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500">✅ නිවැරදි</label>
                            <select
                              className="w-full mt-1 border-2 border-indigo-200 rounded-xl p-2 text-sm focus:outline-none focus:border-indigo-400"
                              value={editData.correct_index}
                              onChange={e => setEditData({ ...editData, correct_index: Number(e.target.value) })}
                            >
                              {[0,1,2,3,4].map(i => <option key={i} value={i}>පිළිතුර {i+1}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500">📝 ප්‍රශ්නයේ පෙළ</label>
                          <input
                            className="w-full mt-1 border-2 border-indigo-200 rounded-xl p-2 text-sm focus:outline-none focus:border-indigo-400"
                            value={editData.question_text}
                            onChange={e => setEditData({ ...editData, question_text: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditSave(q._id)} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2 rounded-2xl text-sm font-bold hover:opacity-90 transition">💾 සුරකින්න</button>
                          <button onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-600 px-5 py-2 rounded-2xl text-sm font-bold hover:bg-gray-300 transition">✕ අවලංගු</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-3 py-1 rounded-full font-bold ${LEVEL_STYLES[q.level]}`}>{LEVEL_LABELS[q.level]}</span>
                          <span className="text-xs text-gray-400">කාර්යය #{q.task_number}</span>
                        </div>
                        <p className="text-gray-800 font-bold text-sm">{q.question_text}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          නිවැරදි: පිළිතුර {q.answers.findIndex(a => a.mark > 0) + 1} · ⭐ {Math.max(...q.answers.map(a => a.mark))}
                        </p>
                      </>
                    )}
                  </div>

                  {editingId !== q._id && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => setExpandedId(expandedId === q._id ? null : q._id)}
                        className="p-2 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 transition"
                        title="පිළිතුරු බලන්න"
                      >
                        <svg className={`w-4 h-4 transition-transform ${expandedId === q._id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleEditOpen(q)}
                        className="p-2 rounded-xl border-2 border-yellow-200 text-yellow-500 hover:bg-yellow-50 transition"
                        title="සංස්කරණය"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(q._id)}
                        className="p-2 rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-50 transition"
                        title="මකන්න"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Expanded answers */}
                {expandedId === q._id && (
                  <div className="border-t-2 border-orange-50 px-5 py-4 bg-orange-50">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-3">🎯 පිළිතුරු විකල්ප</p>
                    <div className="grid grid-cols-5 gap-3">
                      {q.answers.map((a, i) => (
                        <div key={i} className={`rounded-2xl border-2 p-2 ${a.mark > 0 ? "border-green-400 bg-green-50" : "border-gray-200 bg-white"}`}>
                          <img
                            src={`http://localhost:5000${a.image_url}`}
                            className="w-full h-16 object-contain rounded-xl"
                            onError={e => e.target.src = "https://via.placeholder.com/80x64?text=No+Img"}
                          />
                          <p className={`text-center text-xs font-bold mt-1 ${a.mark > 0 ? "text-green-600" : "text-gray-400"}`}>
                            {a.mark > 0 ? `✓ නිවැරදි (${a.mark})` : `${i+1} විකල්පය`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Delete confirm */}
                {deleteConfirmId === q._id && (
                  <div className="border-t-2 border-red-100 bg-red-50 px-5 py-4 flex items-center justify-between">
                    <p className="text-sm text-red-700 font-bold">මෙම ප්‍රශ්නය මකා දැමීමට විශ්වාසද?</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleDelete(q._id)} className="bg-red-500 text-white px-4 py-2 rounded-2xl text-sm font-bold hover:bg-red-600 transition">🗑️ මකන්න</button>
                      <button onClick={() => setDeleteConfirmId(null)} className="bg-white text-gray-600 border-2 border-gray-200 px-4 py-2 rounded-2xl text-sm font-bold hover:bg-gray-50 transition">✕ අවලංගු</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

