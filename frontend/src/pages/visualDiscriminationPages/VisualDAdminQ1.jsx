import { useState } from "react";
import axios from "axios";

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
      alert("කරුණාකර ප්‍රශ්න රූපය සහ පිළිතුරු රූප 5 ම ඇතුළු කරන්න.");
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
      setSuccessMsg("✅ ප්‍රශ්නය සාර්ථකව එකතු කරන ලදී!");
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
      alert("❌ උඩුගත කිරීම අසාර්ථක විය. නැවත උත්සාහ කරන්න.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl p-6 mb-6 text-white text-center shadow-lg">
          <div className="text-4xl mb-2">🖼️</div>
          <h1 className="text-2xl font-bold">නව ප්‍රශ්නයක් එකතු කරන්න</h1>
          <p className="text-indigo-200 text-sm mt-1">දෘශ්‍ය වෙනස හඳුනාගැනීමේ ක්‍රීඩාව</p>
        </div>

        {successMsg && (
          <div className="mb-5 p-4 bg-green-100 border-2 border-green-300 text-green-700 rounded-2xl font-bold text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Settings */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-sm font-bold text-gray-500 uppercase mb-4">⚙️ ප්‍රශ්න සැකසුම්</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">⭐ මට්ටම</label>
                <select
                  className="border-2 border-indigo-200 rounded-2xl p-3 w-full focus:outline-none focus:border-indigo-400 text-gray-700"
                  value={level}
                  onChange={e => setLevel(e.target.value)}
                >
                  <option value="EASY">🟢 පහසු</option>
                  <option value="MEDIUM">🟡 මධ්‍යම</option>
                  <option value="HARD">🔴 දුෂ්කර</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">🔢 කාර්යය අංකය</label>
                <input
                  type="number" min="1"
                  className="border-2 border-indigo-200 rounded-2xl p-3 w-full focus:outline-none focus:border-indigo-400"
                  value={taskNumber}
                  onChange={e => setTaskNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">⭐ ලකුණු</label>
                <input
                  type="number" min="1"
                  className="border-2 border-indigo-200 rounded-2xl p-3 w-full focus:outline-none focus:border-indigo-400"
                  value={mark}
                  onChange={e => setMark(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase mb-2">📝 ප්‍රශ්නය</h2>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">ප්‍රශ්නයේ පෙළ</label>
              <input
                type="text"
                className="border-2 border-indigo-200 rounded-2xl p-3 w-full focus:outline-none focus:border-indigo-400"
                placeholder="උදා: වෙනස් රූපය කුමක්ද?"
                value={questionText}
                onChange={e => setQuestionText(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">🖼️ ප්‍රශ්න රූපය</label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 rounded-2xl p-6 cursor-pointer hover:bg-indigo-50 transition">
                {questionImagePreview ? (
                  <img src={questionImagePreview} className="w-40 h-32 object-contain rounded-xl" />
                ) : (
                  <>
                    <span className="text-4xl">📷</span>
                    <span className="text-sm text-gray-400 mt-2">රූපය ඇතුළු කරන්න</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={e => handleQuestionImageChange(e.target.files[0])} />
              </label>
            </div>
          </div>

          {/* Answers */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-500 uppercase">🎯 පිළිතුරු (5ක් අවශ්‍යයි)</h2>
              <div className="flex items-center gap-2">
                <label className="text-sm font-bold text-gray-600">✅ නිවැරදි:</label>
                <select
                  className="border-2 border-green-300 rounded-xl p-2 text-sm focus:outline-none focus:border-green-500 text-gray-700"
                  value={correctIndex}
                  onChange={e => setCorrectIndex(Number(e.target.value))}
                >
                  {[0,1,2,3,4].map(i => <option key={i} value={i}>පිළිතුර {i+1}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {answerImages.map((_, i) => (
                <div key={i} className={`relative rounded-2xl border-2 p-2 transition ${correctIndex === i ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-indigo-300"}`}>
                  {correctIndex === i && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
                  )}
                  <label className="cursor-pointer block">
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleAnswerImageChange(i, e.target.files[0])} />
                    {answerPreviews[i] ? (
                      <img src={answerPreviews[i]} className="w-full h-16 object-contain rounded-xl" />
                    ) : (
                      <div className="w-full h-16 flex flex-col items-center justify-center bg-gray-50 rounded-xl">
                        <span className="text-xl">🖼️</span>
                      </div>
                    )}
                  </label>
                  <p className={`text-center text-xs font-bold mt-1 ${correctIndex === i ? "text-green-600" : "text-gray-400"}`}>
                    {correctIndex === i ? "✓ නිවැරදි" : `${i+1} විකල්පය`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-4 rounded-2xl text-lg shadow-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "⏳ උඩුගත කෙරෙමින්..." : "💾 ප්‍රශ්නය සුරකින්න"}
          </button>
        </form>
      </div>
    </div>
  );
}

