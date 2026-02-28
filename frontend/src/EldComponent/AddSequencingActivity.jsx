import React, { useState } from "react";
import axios from "axios";

const AddSequencingActivity = () => {
  const [level, setLevel] = useState("EASY");
  const [title, setTitle] = useState("");
  const [taskNumber, setTaskNumber] = useState("");
  const [correctOrder, setCorrectOrder] = useState("");
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  // Remove an image from the list
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length < 2) {
      setMessage("Please upload at least 2 images.");
      setIsError(true);
      return;
    }

    const formData = new FormData();
    formData.append("level", level);
    formData.append("title", title);
    formData.append("task_number", taskNumber);
    formData.append("correct_order", correctOrder);

    images.forEach((img) => formData.append("images", img));

    try {
      await axios.post(
        "http://localhost:5000/api/sequencing_bp/add",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage("Sequencing activity added successfully.");
      setIsError(false);

      // Reset form
      setLevel("EASY");
      setTitle("");
      setTaskNumber("");
      setCorrectOrder("");
      setImages([]);

    } catch (error) {
      console.error(error);
      setMessage("Error adding activity.");
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white border border-gray-300 rounded-3xl shadow-2xl p-10">

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Add Sequencing Activity
          </h2>
        </div>

        {message && (
          <div className={`mb-6 p-3 rounded-lg text-sm font-medium ${
            isError
              ? "bg-red-100 text-red-600 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="EASY">EASY</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HARD">HARD</option>
          </select>

          <input
            type="text"
            placeholder="Activity Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            type="number"
            placeholder="Task Number"
            value={taskNumber}
            onChange={(e) => setTaskNumber(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            type="text"
            placeholder="Correct Order (example: 1,2,3)"
            value={correctOrder}
            onChange={(e) => setCorrectOrder(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Upload Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />

            {/* Preview Selected Images */}
            <div className="flex flex-wrap gap-3">
              {images.map((img, index) => (
                <div key={index} className="relative w-24 h-24 border rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl"
          >
            Add Activity
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddSequencingActivity;