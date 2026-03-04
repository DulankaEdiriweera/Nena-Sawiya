import { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../../Components/AdminHeader";

const API = "http://localhost:5000/api/vd_picture_mcq";

const LS = {
  EASY:   { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-400", label: "Easy" },
  MEDIUM: { bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-400",   label: "Medium" },
  HARD:   { bg: "bg-rose-100",    text: "text-rose-700",    dot: "bg-rose-400",    label: "Hard" },
};

export default function AdminManageVdPictureMCQ() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  // New image file states
  const [newQuestionImage, setNewQuestionImage] = useState(null);
  const [newAnswerImages, setNewAnswerImages] = useState({});
  const [questionImagePreview, setQuestionImagePreview] = useState(null);
  const [answerImagePreviews, setAnswerImagePreviews] = useState({});

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/all`);
      setQuestions(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
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
      answers: q.answers,
      question_image: q.question_image,
    });
    setNewQuestionImage(null);
    setNewAnswerImages({});
    setQuestionImagePreview(null);
    setAnswerImagePreviews({});
  };

  const handleQuestionImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewQuestionImage(file);
    setQuestionImagePreview(URL.createObjectURL(file));
  };

  const handleAnswerImageChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewAnswerImages(prev => ({ ...prev, [index]: file }));
    setAnswerImagePreviews(prev => ({ ...prev, [index]: URL.createObjectURL(file) }));
  };

  const handleEditSave = async (id) => {
    try {
      const formData = new FormData();
      formData.append("level", editData.level);
      formData.append("task_number", editData.task_number);
      formData.append("question_text", editData.question_text);
      formData.append("correct_index", editData.correct_index);

      // Append new question image if changed
      if (newQuestionImage) {
        formData.append("question_image", newQuestionImage);
      }

      // Append new answer images if changed, keyed by index
      Object.entries(newAnswerImages).forEach(([index, file]) => {
        formData.append(`answer_image_${index}`, file);
      });

      await axios.put(`${API}/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showSuccess("✅ Question updated successfully!");
      setEditingId(null);
      setNewQuestionImage(null);
      setNewAnswerImages({});
      setQuestionImagePreview(null);
      setAnswerImagePreviews({});
      fetchAll();
    } catch (err) {
      alert("❌ Failed to update question");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/delete/${id}`);
      showSuccess("🗑️ Question deleted.");
      setDeleteConfirmId(null);
      fetchAll();
    } catch (err) {
      alert("❌ Failed to delete question");
    }
  };

  const filtered = filterLevel === "ALL" ? questions : questions.filter(q => q.level === filterLevel);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl animate-bounce">⏳</div>
        <p className="text-slate-400 font-bold mt-3">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">Visual Discrimination & Memory</p>
            <h1 className="text-2xl font-black text-slate-800">Picture MCQ Management</h1>
            <p className="text-slate-400 text-sm mt-1">{questions.length} question{questions.length !== 1 ? "s" : ""} available</p>
          </div>
          <a href="/adminVD1"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-sm text-sm">
            + Add New Activity
          </a>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 w-fit">
          {[["ALL","All"],["EASY","Easy"],["MEDIUM","Medium"],["HARD","Hard"]].map(([lvl, label]) => {
            const s = LS[lvl] || {};
            const active = filterLevel === lvl;
            const count = lvl === "ALL" ? questions.length : questions.filter(q => q.level === lvl).length;
            return (
              <button key={lvl} onClick={() => setFilterLevel(lvl)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 ${active ? lvl === "ALL" ? "bg-indigo-600 text-white shadow" : `${s.bg} ${s.text} shadow` : "text-slate-400 hover:text-slate-600"}`}>
                {label}
                <span className={`text-xs rounded-full px-1.5 py-0.5 ${active && lvl !== "ALL" ? s.bg : "bg-slate-100 text-slate-500"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Success Toast */}
        {successMsg && (
          <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl font-bold text-center text-sm">
            {successMsg}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-bold text-slate-400">No questions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(q => {
              const s = LS[q.level] || LS.EASY;
              return (
                <div key={q._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                  {/* Main Row */}
                  <div className="p-5 flex items-start gap-4">
                    <img
                      src={`http://localhost:5000${q.question_image}`}
                      className="w-20 h-16 object-contain rounded-xl border border-slate-200 bg-slate-50 flex-shrink-0"
                      onError={e => e.target.src = "https://via.placeholder.com/80x64?text=No+Img"}
                    />

                    <div className="flex-1 min-w-0">
                      {editingId === q._id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="text-xs font-bold text-slate-500 uppercase">Level</label>
                              <select
                                className="w-full mt-1 border-2 border-indigo-200 rounded-xl p-2 text-sm focus:outline-none focus:border-indigo-400"
                                value={editData.level}
                                onChange={e => setEditData({ ...editData, level: e.target.value })}
                              >
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-bold text-slate-500 uppercase">Task No.</label>
                              <input type="number"
                                className="w-full mt-1 border-2 border-indigo-200 rounded-xl p-2 text-sm focus:outline-none focus:border-indigo-400"
                                value={editData.task_number}
                                onChange={e => setEditData({ ...editData, task_number: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-slate-500 uppercase">Correct</label>
                              <select
                                className="w-full mt-1 border-2 border-indigo-200 rounded-xl p-2 text-sm focus:outline-none focus:border-indigo-400"
                                value={editData.correct_index}
                                onChange={e => setEditData({ ...editData, correct_index: Number(e.target.value) })}
                              >
                                {[0,1,2,3,4].map(i => <option key={i} value={i}>Answer {i+1}</option>)}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Question Text</label>
                            <input
                              className="w-full mt-1 border-2 border-indigo-200 rounded-xl p-2 text-sm focus:outline-none focus:border-indigo-400"
                              value={editData.question_text}
                              onChange={e => setEditData({ ...editData, question_text: e.target.value })}
                            />
                          </div>

                          {/* Question Image Update */}
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Question Image</label>
                            <div className="mt-1 flex items-center gap-3">
                              <img
                                src={questionImagePreview || `http://localhost:5000${editData.question_image}`}
                                className="w-20 h-16 object-contain rounded-xl border border-slate-200 bg-slate-50"
                                onError={e => e.target.src = "https://via.placeholder.com/80x64?text=No+Img"}
                              />
                              <label className="cursor-pointer inline-flex items-center gap-2 bg-slate-100 hover:bg-indigo-50 border-2 border-dashed border-slate-300 hover:border-indigo-300 text-slate-500 hover:text-indigo-500 font-bold px-4 py-2 rounded-xl text-xs transition">
                                📷 Change Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleQuestionImageChange}
                                />
                              </label>
                              {newQuestionImage && (
                                <span className="text-xs text-emerald-600 font-bold">✓ New image selected</span>
                              )}
                            </div>
                          </div>

                          {/* Answer Images Update */}
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Answer Images</label>
                            <div className="grid grid-cols-5 gap-2">
                              {editData.answers && editData.answers.map((a, i) => (
                                <div key={i} className={`rounded-xl border-2 p-2 ${editData.correct_index === i ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white"}`}>
                                  <img
                                    src={answerImagePreviews[i] || `http://localhost:5000${a.image_url}`}
                                    className="w-full h-14 object-contain rounded-lg"
                                    onError={e => e.target.src = "https://via.placeholder.com/80x64?text=No+Img"}
                                  />
                                  <label className="cursor-pointer mt-1 w-full flex items-center justify-center gap-1 bg-slate-100 hover:bg-indigo-50 border border-dashed border-slate-300 hover:border-indigo-300 text-slate-400 hover:text-indigo-400 font-bold py-1 rounded-lg text-xs transition">
                                    {newAnswerImages[i] ? <span className="text-emerald-500">✓</span> : "📷"}
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={e => handleAnswerImageChange(i, e)}
                                    />
                                  </label>
                                  <p className={`text-center text-xs font-bold mt-1 ${editData.correct_index === i ? "text-emerald-600" : "text-slate-400"}`}>
                                    {editData.correct_index === i ? "✓ Correct" : `Opt ${i+1}`}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button onClick={() => handleEditSave(q._id)}
                              className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition">
                              💾 Save
                            </button>
                            <button onClick={() => setEditingId(null)}
                              className="bg-slate-100 text-slate-600 px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 transition">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-3 py-1 rounded-full font-bold inline-flex items-center gap-1.5 ${s.bg} ${s.text}`}>
                              <span className={`w-2 h-2 rounded-full ${s.dot}`}></span>
                              {s.label}
                            </span>
                            <span className="text-xs text-slate-400">Task #{q.task_number}</span>
                          </div>
                          <p className="text-slate-800 font-bold text-sm">{q.question_text}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            Correct: Answer {q.answers.findIndex(a => a.mark > 0) + 1} · {Math.max(...q.answers.map(a => a.mark))}pt
                          </p>
                        </>
                      )}
                    </div>

                    {editingId !== q._id && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => setExpandedId(expandedId === q._id ? null : q._id)}
                          className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 transition" title="View answers">
                          <svg className={`w-4 h-4 transition-transform ${expandedId === q._id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <button onClick={() => handleEditOpen(q)}
                          className="p-2 rounded-xl border border-indigo-200 text-indigo-500 hover:bg-indigo-50 transition" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => setDeleteConfirmId(q._id)}
                          className="p-2 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 transition" title="Delete">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Expanded Answers */}
                  {expandedId === q._id && (
                    <div className="border-t border-slate-100 px-5 py-4 bg-slate-50">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-3">Answer Options</p>
                      <div className="grid grid-cols-5 gap-3">
                        {q.answers.map((a, i) => (
                          <div key={i} className={`rounded-xl border-2 p-2 ${a.mark > 0 ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white"}`}>
                            <img
                              src={`http://localhost:5000${a.image_url}`}
                              className="w-full h-16 object-contain rounded-lg"
                              onError={e => e.target.src = "https://via.placeholder.com/80x64?text=No+Img"}
                            />
                            <p className={`text-center text-xs font-bold mt-1 ${a.mark > 0 ? "text-emerald-600" : "text-slate-400"}`}>
                              {a.mark > 0 ? `✓ Correct (${a.mark}pt)` : `Option ${i+1}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Delete Confirm */}
                  {deleteConfirmId === q._id && (
                    <div className="border-t border-rose-100 bg-rose-50 px-5 py-4 flex items-center justify-between">
                      <p className="text-sm text-rose-700 font-bold">Are you sure you want to delete this question?</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleDelete(q._id)}
                          className="bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-rose-600 transition">
                          Yes, Delete
                        </button>
                        <button onClick={() => setDeleteConfirmId(null)}
                          className="bg-white text-slate-600 border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}