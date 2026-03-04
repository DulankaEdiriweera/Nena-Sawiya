import { useState } from "react";
import axios from "axios";
import AdminHeader from "../../Components/AdminHeader";

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
      alert("Please enter a title and question image");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("level", level);
      fd.append("question_image", questionImage);

      const itemsMeta = items.map((item) => ({
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
      alert("✅ Game added successfully!");
      setTitle("");
      setLevel("EASY");
      setQuestionImage(null);
      setItems([{ label: "", imageFile: null, correct_answer: 0, mark: 1 }]);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add game");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div><AdminHeader/></div>
      <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');`}</style>
      
      <div className="min-h-screen p-6" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #fdf2ff 100%)" }}>
        <div className="max-w-2xl mx-auto">

          {/* Page Header */}
          <div className="rounded-2xl p-6 mb-6 text-white text-center shadow-lg" style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
            <div className="text-4xl mb-2">🎮</div>
            <h1 className="text-2xl font-bold">Add Count Image Game</h1>
            <p className="text-sm mt-1" style={{ color: "#ddd6fe" }}>Create a new counting activity</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 space-y-5" style={{ border: "1.5px solid #ede9fe" }}>

            {/* Title */}
            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: "#4b5563" }}>🏷️ Game Title</label>
              <input
                className="rounded-xl p-3 w-full focus:outline-none text-gray-700"
                style={{ border: "2px solid #ddd6fe" }}
                placeholder="e.g. Wildlife Counting"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: "#4b5563" }}>⭐ Difficulty Level</label>
              <div className="flex gap-3">
                {[
                  ["EASY", "🟢 Easy", "#d1fae5", "#065f46"],
                  ["MEDIUM", "🟡 Medium", "#fef9c3", "#713f12"],
                  ["HARD", "🔴 Hard", "#fee2e2", "#7f1d1d"]
                ].map(([val, label, bg, col]) => (
                  <button key={val} type="button" onClick={() => setLevel(val)}
                    className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all"
                    style={{
                      background: level === val ? bg : "#f9fafb",
                      color: level === val ? col : "#9ca3af",
                      border: `2px solid ${level === val ? col : "#e5e7eb"}`,
                      transform: level === val ? "scale(1.04)" : "scale(1)"
                    }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Image */}
            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: "#4b5563" }}>🖼️ Question Image</label>
              <label className="flex flex-col items-center justify-center p-6 cursor-pointer rounded-xl transition"
                style={{ border: "2px dashed #a78bfa", background: "#faf5ff" }}>
                {questionImage ? (
                  <div className="text-center">
                    <img src={URL.createObjectURL(questionImage)} className="w-40 h-28 object-cover rounded-xl mx-auto mb-2" />
                    <p className="text-sm text-gray-500">{questionImage.name}</p>
                  </div>
                ) : (
                  <>
                    <span className="text-4xl">📷</span>
                    <span className="text-sm mt-2" style={{ color: "#7c3aed" }}>Click to upload image</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={e => setQuestionImage(e.target.files[0])} />
              </label>
            </div>

            {/* Items */}
            <div>
              <label className="block text-sm font-bold mb-3" style={{ color: "#4b5563" }}>📋 Answer Items</label>
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div key={idx} className="rounded-xl p-4 space-y-3" style={{ background: "#faf5ff", border: "1.5px solid #ede9fe" }}>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm" style={{ color: "#7c3aed" }}>Item {idx + 1}</span>
                      {items.length > 1 && (
                        <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 text-xl">✕</button>
                      )}
                    </div>
                    <input
                      className="rounded-xl p-2 w-full text-sm focus:outline-none"
                      style={{ border: "2px solid #ddd6fe" }}
                      placeholder="Label (e.g. Dog)"
                      value={item.label}
                      onChange={e => updateItem(idx, "label", e.target.value)}
                    />
                    <label className="flex items-center gap-3 p-3 cursor-pointer rounded-xl"
                      style={{ border: "2px dashed #c4b5fd" }}>
                      {item.imageFile ? (
                        <img src={URL.createObjectURL(item.imageFile)} className="w-12 h-12 object-cover rounded-lg" />
                      ) : (
                        <span className="text-2xl">🖼️</span>
                      )}
                      <span className="text-sm text-gray-500">{item.imageFile ? item.imageFile.name : "Item image"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => updateItem(idx, "imageFile", e.target.files[0])} />
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold" style={{ color: "#6b7280" }}>✅ Correct Answer</label>
                        <input type="number" min="0"
                          className="rounded-xl p-2 w-full text-sm focus:outline-none mt-1"
                          style={{ border: "2px solid #ddd6fe" }}
                          value={item.correct_answer}
                          onChange={e => updateItem(idx, "correct_answer", Number(e.target.value))} />
                      </div>
                      <div>
                        <label className="text-xs font-bold" style={{ color: "#6b7280" }}>⭐ Marks</label>
                        <input type="number" min="1"
                          className="rounded-xl p-2 w-full text-sm focus:outline-none mt-1"
                          style={{ border: "2px solid #ddd6fe" }}
                          value={item.mark}
                          onChange={e => updateItem(idx, "mark", Number(e.target.value))} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addItem}
                className="mt-3 w-full p-3 font-bold rounded-xl transition"
                style={{ border: "2px dashed #a78bfa", color: "#7c3aed", background: "transparent" }}>
                + Add New Item
              </button>
            </div>

            {/* Submit */}
            <button onClick={submit} disabled={loading}
              className="w-full text-white font-bold py-4 rounded-xl text-lg shadow transition"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", opacity: loading ? 0.6 : 1 }}>
              {loading ? "⏳ Saving..." : "💾 Save Game"}
            </button>
          </div>
        </div>
      </div>
    </div>

    </div>
    
  );
}