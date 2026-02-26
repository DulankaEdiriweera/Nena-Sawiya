import React, { useState } from "react";
import axios from "axios";

const AddStoryCloze = () => {
  const [title, setTitle] = useState("");
  const [textWithBlanks, setTextWithBlanks] = useState("");
  const [blanksAnswers, setBlanksAnswers] = useState([""]);
  const [options, setOptions] = useState([""]);
  const [video, setVideo] = useState(null);
  const [taskNumber, setTaskNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleAddBlank = () => setBlanksAnswers([...blanksAnswers, ""]);
  const handleAddOption = () => setOptions([...options, ""]);

  const handleBlankChange = (value, index) => {
    const newBlanks = [...blanksAnswers];
    newBlanks[index] = value;
    setBlanksAnswers(newBlanks);
  };

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video) {
      setMessage("Please upload a video.");
      setIsError(true);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("text_with_blanks", textWithBlanks);
    blanksAnswers.forEach((b) => formData.append("blanks_answers[]", b));
    options.forEach((o) => formData.append("options[]", o));
    formData.append("video", video);
    formData.append("task_number", taskNumber);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/story_bp/add",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage(res.data.message);
      setIsError(false);

      // Reset
      setTitle("");
      setTextWithBlanks("");
      setBlanksAnswers([""]);
      setOptions([""]);
      setVideo(null);
      setTaskNumber("");
    } catch (err) {
      console.error(err);
      setMessage("Error uploading story.");
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center px-4 py-10">
      
      {/* MAIN CONTAINER */}
      <div className="w-full max-w-3xl bg-white border border-gray-300 rounded-3xl shadow-2xl p-10">

        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Add Story Completion Task
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Create a new story completion activity
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

          {/* Title */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Story Text */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Text with Blanks (use ____ for blanks)
            </label>
            <textarea
              value={textWithBlanks}
              onChange={(e) => setTextWithBlanks(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Blanks Answers */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Blank Answers
            </label>
            {blanksAnswers.map((b, i) => (
              <input
                key={i}
                type="text"
                value={b}
                onChange={(e) => handleBlankChange(e.target.value, i)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            ))}
            <button
              type="button"
              onClick={handleAddBlank}
              className="text-indigo-600 text-sm hover:underline"
            >
              + Add Another Blank
            </button>
          </div>

          {/* Options */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Options (Draggable Words)
            </label>
            {options.map((o, i) => (
              <input
                key={i}
                type="text"
                value={o}
                onChange={(e) => handleOptionChange(e.target.value, i)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            ))}
            <button
              type="button"
              onClick={handleAddOption}
              className="text-indigo-600 text-sm hover:underline"
            >
              + Add Another Option
            </button>
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

          {/* Video Upload */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Upload Video
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition"
            >
              Add Story Task
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddStoryCloze;