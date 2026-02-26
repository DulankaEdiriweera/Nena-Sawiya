import React, { useState } from "react";
import axios from "axios";

const AddPictureMCQ = () => {
  const [level, setLevel] = useState("EASY");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [taskNumber, setTaskNumber] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage("Please upload an image.");
      setIsError(true);
      return;
    }

    if (!correctAnswer) {
      setMessage("Please specify the correct answer.");
      setIsError(true);
      return;
    }

    const formData = new FormData();
    formData.append("level", level);
    formData.append("question", question);
    options.forEach((opt) => formData.append("options", opt));
    formData.append("correct_answer", correctAnswer);
    formData.append("task_number", taskNumber);
    formData.append("image", image);

    try {
      await axios.post(
        "http://localhost:5000/api/picture_mcq/add",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage("MCQ added successfully.");
      setIsError(false);

      // Reset form
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setTaskNumber("");
      setImage(null);
      setLevel("EASY");

    } catch (error) {
      console.error(error);
      setMessage("Error adding MCQ.");
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center px-4 py-10">
      
      {/* Main Container */}
      <div className="w-full max-w-3xl bg-white border border-gray-300 rounded-3xl shadow-2xl p-10">

        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Add Picture MCQ
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Create a new picture-based multiple choice question
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-3 rounded-lg text-sm font-medium ${
              isError
                ? "bg-red-100 text-red-600 border border-red-300"
                : "bg-green-100 text-green-700 border border-green-300"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Level */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Difficulty Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            >
              <option value="EASY">EASY</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HARD">HARD</option>
            </select>
          </div>

          {/* Question */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Options */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Options
            </label>
            {options.map((opt, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(i, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            ))}
          </div>

          {/* Correct Answer */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Correct Answer
            </label>
            <input
              type="text"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Task Number */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Task Number
            </label>
            <input
              type="number"
              value={taskNumber}
              onChange={(e) => setTaskNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
              required
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition"
            >
              Add MCQ
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddPictureMCQ;