import { useState } from "react";
import axios from "axios";
import AdminHeader from "../../Components/AdminHeader";

export default function AdminVdPictureMCQ() {
  const [level, setLevel] = useState("EASY");
  const [taskNumber, setTaskNumber] = useState(1);
  const [questionText, setQuestionText] = useState("");
  const [questionImage, setQuestionImage] = useState(null);
  const [questionImagePreview, setQuestionImagePreview] = useState(null);
  const [answerImages, setAnswerImages] = useState(Array(5).fill(null));
  const [answerPreviews, setAnswerPreviews] = useState(Array(5).fill(null));
  const [correctIndex, setCorrectIndex] = useState(0);
  const [mark, setMark] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleQuestionImageChange = (file) => {
    setQuestionImage(file);
    setQuestionImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleAnswerImageChange = (index, file) => {
    const updatedFiles = [...answerImages];
    const updatedPreviews = [...answerPreviews];
    updatedFiles[index] = file;
    updatedPreviews[index] = file ? URL.createObjectURL(file) : null;
    setAnswerImages(updatedFiles);
    setAnswerPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!questionImage || answerImages.includes(null)) {
      alert("Please upload the question image and all 5 answer images.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("level", level);
    formData.append("task_number", taskNumber);
    formData.append("question", questionText);
    formData.append("question_image", questionImage);
    answerImages.forEach((file) => formData.append("answer_images", file));
    formData.append("correct_index", correctIndex);
    for (let i = 0; i < 5; i++) formData.append("marks", mark);

    try {
      await axios.post("http://localhost:5000/api/vd_picture_mcq/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMsg("✅ Question added successfully!");
      setQuestionText("");
      setQuestionImage(null);
      setQuestionImagePreview(null);
      setAnswerImages(Array(5).fill(null));
      setAnswerPreviews(Array(5).fill(null));
      setCorrectIndex(0);
      setMark(1);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');`}</style>
      <AdminHeader />
      <div className="min-h-screen p-6" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #fdf2ff 100%)" }}>
        <div className="max-w-3xl mx-auto">

          {/* Page Header */}
          <div className="rounded-2xl p-6 mb-6 text-white text-center shadow-lg" style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
            <div className="text-4xl mb-2">🖼️</div>
            <h1 className="text-2xl font-bold">Add Picture MCQ Question</h1>
            <p className="text-sm mt-1" style={{ color: "#ddd6fe" }}>Visual difference identification game</p>
          </div>

          {successMsg && (
            <div className="mb-5 p-4 rounded-2xl font-bold text-center" style={{ background: "#f0fdf4", border: "2px solid #86efac", color: "#16a34a" }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Settings */}
            <div className="bg-white rounded-2xl shadow p-6" style={{ border: "1.5px solid #ede9fe" }}>
              <h2 className="text-sm font-bold text-gray-400 uppercase mb-4">⚙️ Question Settings</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1" style={{ color: "#4b5563" }}>⭐ Level</label>
                  <select
                    className="rounded-xl p-3 w-full focus:outline-none text-gray-700"
                    style={{ border: "2px solid #ddd6fe" }}
                    value={level}
                    onChange={e => setLevel(e.target.value)}>
                    <option value="EASY">🟢 Easy</option>
                    <option value="MEDIUM">🟡 Medium</option>
                    <option value="HARD">🔴 Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1" style={{ color: "#4b5563" }}>🔢 Task Number</label>
                  <input type="number" min="1"
                    className="rounded-xl p-3 w-full focus:outline-none"
                    style={{ border: "2px solid #ddd6fe" }}
                    value={taskNumber}
                    onChange={e => setTaskNumber(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1" style={{ color: "#4b5563" }}>⭐ Marks</label>
                  <input type="number" min="1"
                    className="rounded-xl p-3 w-full focus:outline-none"
                    style={{ border: "2px solid #ddd6fe" }}
                    value={mark}
                    onChange={e => setMark(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-2xl shadow p-6 space-y-4" style={{ border: "1.5px solid #ede9fe" }}>
              <h2 className="text-sm font-bold text-gray-400 uppercase">📝 Question</h2>
              <div>
                <label className="block text-sm font-bold mb-1" style={{ color: "#4b5563" }}>Question Text</label>
                <input type="text"
                  className="rounded-xl p-3 w-full focus:outline-none"
                  style={{ border: "2px solid #ddd6fe" }}
                  placeholder="e.g. Which image is different?"
                  value={questionText}
                  onChange={e => setQuestionText(e.target.value)}
                  required />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1" style={{ color: "#4b5563" }}>🖼️ Question Image</label>
                <label className="flex flex-col items-center justify-center p-6 cursor-pointer rounded-xl transition"
                  style={{ border: "2px dashed #a78bfa", background: "#faf5ff" }}>
                  {questionImagePreview ? (
                    <img src={questionImagePreview} className="w-40 h-32 object-contain rounded-xl" />
                  ) : (
                    <>
                      <span className="text-4xl">📷</span>
                      <span className="text-sm mt-2" style={{ color: "#7c3aed" }}>Click to upload image</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleQuestionImageChange(e.target.files[0])} />
                </label>
              </div>
            </div>

            {/* Answers */}
            <div className="bg-white rounded-2xl shadow p-6" style={{ border: "1.5px solid #ede9fe" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-400 uppercase">🎯 Answers (5 required)</h2>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-bold" style={{ color: "#4b5563" }}>✅ Correct:</label>
                  <select
                    className="rounded-xl p-2 text-sm focus:outline-none text-gray-700"
                    style={{ border: "2px solid #86efac" }}
                    value={correctIndex}
                    onChange={e => setCorrectIndex(Number(e.target.value))}>
                    {[0, 1, 2, 3, 4].map(i => <option key={i} value={i}>Answer {i + 1}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {answerImages.map((_, i) => (
                  <div key={i} className="relative rounded-2xl p-2 transition"
                    style={{
                      border: `2px solid ${correctIndex === i ? "#4ade80" : "#e5e7eb"}`,
                      background: correctIndex === i ? "#f0fdf4" : "white"
                    }}>
                    {correctIndex === i && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: "#22c55e" }}>✓</div>
                    )}
                    <label className="cursor-pointer block">
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleAnswerImageChange(i, e.target.files[0])} />
                      {answerPreviews[i] ? (
                        <img src={answerPreviews[i]} className="w-full h-16 object-contain rounded-xl" />
                      ) : (
                        <div className="w-full h-16 flex flex-col items-center justify-center rounded-xl" style={{ background: "#f9fafb" }}>
                          <span className="text-xl">🖼️</span>
                        </div>
                      )}
                    </label>
                    <p className="text-center text-xs font-bold mt-1"
                      style={{ color: correctIndex === i ? "#16a34a" : "#9ca3af" }}>
                      {correctIndex === i ? "✓ Correct" : `Option ${i + 1}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full text-white font-bold py-4 rounded-xl text-lg shadow-lg transition"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", opacity: loading ? 0.5 : 1 }}>
              {loading ? "⏳ Uploading..." : "💾 Save Question"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}