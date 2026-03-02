import { useState } from "react";
import axios from "axios";

export default function AdminAddCountImageGame() {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("EASY");
  const [questionImage, setQuestionImage] = useState(null);
  const [items, setItems] = useState([
    { label: "", imageFile: null, correct_answer: 0, mark: 1 }
  ]);
  const [loading, setLoading] = useState(false);

  const updateItem = (idx, field, value) => {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    setItems(prev => [...prev, { label: "", imageFile: null, correct_answer: 0, mark: 1 }]);
  };

  const removeItem = (idx) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const submit = async () => {
    if (!title || !questionImage) {
      alert("කරුණාකර මාතෘකාව සහ ප්‍රශ්න රූපය ඇතුළු කරන්න");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("level", level);
      fd.append("question_image", questionImage);

      const itemsMeta = items.map((item, idx) => ({
        label: item.label,
        image_url: "",
        correct_answer: item.correct_answer,
        mark: item.mark
      }));
      fd.append("items", JSON.stringify(itemsMeta));

      items.forEach((item, idx) => {
        if (item.imageFile) fd.append(`item_image_${idx}`, item.imageFile);
      });

      await axios.post("http://localhost:5000/api/vd_count/add", fd);
      alert("✅ ක්‍රීඩාව සාර්ථකව එකතු කරන ලදී!");
      setTitle("");
      setLevel("EASY");
      setQuestionImage(null);
      setItems([{ label: "", imageFile: null, correct_answer: 0, mark: 1 }]);
    } catch (err) {
      console.error(err);
      alert("❌ ක්‍රීඩාව එකතු කිරීම අසාර්ථක විය");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-3xl p-6 mb-6 text-white text-center shadow-lg">
          <div className="text-4xl mb-2">🎮</div>
          <h1 className="text-2xl font-bold">ගණන් කිරීමේ ක්‍රීඩාව එකතු කරන්න</h1>
          <p className="text-orange-100 text-sm mt-1">නව ක්‍රීඩාවක් සාදන්න</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">🏷️ ක්‍රීඩාවේ මාතෘකාව</label>
            <input
              className="border-2 border-orange-200 rounded-2xl p-3 w-full focus:outline-none focus:border-orange-400 text-gray-700"
              placeholder="උදා: වනජීවී ගණනය"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">⭐ මට්ටම</label>
            <select
              className="border-2 border-orange-200 rounded-2xl p-3 w-full focus:outline-none focus:border-orange-400 text-gray-700"
              value={level}
              onChange={e => setLevel(e.target.value)}
            >
              <option value="EASY">🟢 පහසු</option>
              <option value="MEDIUM">🟡 මධ්‍යම</option>
              <option value="HARD">🔴 දුෂ්කර</option>
            </select>
          </div>

          {/* Question Image */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">🖼️ ප්‍රශ්න රූපය</label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-orange-300 rounded-2xl p-6 cursor-pointer hover:bg-orange-50 transition">
              {questionImage ? (
                <div className="text-center">
                  <img src={URL.createObjectURL(questionImage)} className="w-40 h-28 object-cover rounded-xl mx-auto mb-2" />
                  <p className="text-sm text-gray-500">{questionImage.name}</p>
                </div>
              ) : (
                <>
                  <span className="text-4xl">📷</span>
                  <span className="text-sm text-gray-400 mt-2">රූපය ඇතුළු කරන්න</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={e => setQuestionImage(e.target.files[0])} />
            </label>
          </div>

          {/* Items */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-3">📋 පිළිතුරු අයිතම</label>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="bg-orange-50 border-2 border-orange-100 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-orange-600 text-sm">අයිතමය {idx + 1}</span>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 text-xl">✕</button>
                    )}
                  </div>

                  <input
                    className="border-2 border-orange-200 rounded-xl p-2 w-full text-sm focus:outline-none focus:border-orange-400"
                    placeholder="නම (උදා: බල්ලා)"
                    value={item.label}
                    onChange={e => updateItem(idx, "label", e.target.value)}
                  />

                  <label className="flex items-center gap-3 border-2 border-dashed border-orange-200 rounded-xl p-3 cursor-pointer hover:bg-orange-100 transition">
                    {item.imageFile ? (
                      <img src={URL.createObjectURL(item.imageFile)} className="w-12 h-12 object-cover rounded-lg" />
                    ) : (
                      <span className="text-2xl">🖼️</span>
                    )}
                    <span className="text-sm text-gray-500">{item.imageFile ? item.imageFile.name : "අයිතම රූපය"}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => updateItem(idx, "imageFile", e.target.files[0])} />
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500 font-bold">✅ නිවැරදි පිළිතුර</label>
                      <input
                        type="number"
                        min="0"
                        className="border-2 border-orange-200 rounded-xl p-2 w-full text-sm focus:outline-none focus:border-orange-400"
                        value={item.correct_answer}
                        onChange={e => updateItem(idx, "correct_answer", Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-bold">⭐ ලකුණු</label>
                      <input
                        type="number"
                        min="1"
                        className="border-2 border-orange-200 rounded-xl p-2 w-full text-sm focus:outline-none focus:border-orange-400"
                        value={item.mark}
                        onChange={e => updateItem(idx, "mark", Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addItem}
              className="mt-3 w-full border-2 border-dashed border-orange-300 rounded-2xl p-3 text-orange-500 font-bold hover:bg-orange-50 transition"
            >
              + නව අයිතමයක් එකතු කරන්න
            </button>
          </div>

          {/* Submit */}
          <button
            onClick={submit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold py-4 rounded-2xl text-lg shadow-md hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "⏳ සුරකිමින්..." : "💾 ක්‍රීඩාව සුරකින්න"}
          </button>
        </div>
      </div>
    </div>
  );
}

