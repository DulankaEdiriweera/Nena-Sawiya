import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Story1 from "../Assets/Story1.mp4";
import Story2 from "../Assets/Story2.mp4";
import Image3 from "../Assets/Image3.jpg";
import Image4 from "../Assets/Image4.jpg";
import { FaMicrophone, FaStopCircle } from "react-icons/fa";

function StoryAssessment() {
  const [transcripts, setTranscripts] = useState(["", "", "", ""]);
  const [recognizers, setRecognizers] = useState([null, null, null, null]);
  const [isRecording, setIsRecording] = useState([false, false, false, false]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();

  const stories = [
    { type: "video", src: Story1 },
    { type: "video", src: Story2 },
    { type: "image", src: Image3 },
    { type: "image", src: Image4 },
  ];

  const startRecording = (index) => {
    if (isRecording[index]) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "si-LK";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let j = 0; j < event.results.length; j++) {
        interimTranscript += event.results[j][0].transcript;
      }
      const updated = [...transcripts];
      updated[index] = interimTranscript;
      setTranscripts(updated);
    };

    recognition.onend = () => {
      if (isRecording[index]) recognition.start();
    };

    recognition.start();

    const updatedRecognizers = [...recognizers];
    updatedRecognizers[index] = recognition;
    setRecognizers(updatedRecognizers);

    const updatedRecording = [...isRecording];
    updatedRecording[index] = true;
    setIsRecording(updatedRecording);
  };

  const stopRecording = (index) => {
    if (recognizers[index]) {
      recognizers[index].stop();

      const updatedRecognizers = [...recognizers];
      updatedRecognizers[index] = null;
      setRecognizers(updatedRecognizers);

      const updatedRecording = [...isRecording];
      updatedRecording[index] = false;
      setIsRecording(updatedRecording);
    }
  };

  const sendResponses = async () => {
    // Helper function to clean text
    const normalizeText = (text) =>
      text
        .replace(/[.,!?]/g, " ") // remove punctuation
        .replace(/\s+/g, " ") // collapse multiple spaces
        .trim();

    const payload = {
      story1: normalizeText(transcripts[0]),
      story2: normalizeText(transcripts[1]),
      story3: normalizeText(transcripts[2]),
      story4: normalizeText(transcripts[3]),
    };

    //Check if all stories are empty
    if (Object.values(payload).every((s) => !s || s.trim() === "")) {
      alert(
        "⚠️ ඔබේ දරුවා කිසිඳු කතා නොකියා ඇත. කරුණාකර සෑම කතාවක්ම පටිගත කර පසුව ඉදිරිපත් කරන්න."
      );
      navigate("/story");
      return; // Stop sending
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/predict_eld", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      navigate("/eldResults", { state: { result: data } });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send responses.");
    }
  };

  const goNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden">
      {/* Floating Decorations Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 hidden md:block">
        {/* Top Left */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-pink-700 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-28 left-16 text-pink-400 text-7xl animate-pulse">
          ✨
        </div>

        {/* Top Right */}
        <div className="absolute top-20 right-16 w-40 h-40 bg-yellow-500 rounded-full opacity-30 animate-bounce delay-300"></div>
        <div className="absolute top-32 right-5 text-yellow-400 text-6xl animate-pulse delay-500">
          ⭐
        </div>

        {/* Middle Left */}
        <div className="absolute top-1/2 left-6 w-14 h-14 bg-purple-700 rounded-full opacity-30 animate-pulse"></div>

        {/* Middle Right */}
        <div className="absolute top-1/2 right-6 w-14 h-14 bg-blue-700 rounded-full opacity-30 animate-bounce delay-700"></div>

        {/* Bottom Left */}
        <div className="absolute bottom-5 left-5 w-20 h-20 bg-cyan-800 rounded-full opacity-30 animate-bounce delay-500"></div>
        <div className="absolute bottom-32 left-14 text-purple-400 text-8xl animate-pulse">
          🎨
        </div>

        {/* Bottom Right */}
        <div className="absolute bottom-10 right-14 w-40 h-40 bg-green-700 rounded-full opacity-30 animate-bounce delay-1000"></div>
        <div className="absolute bottom-40 right-10 text-red-400 text-7xl animate-pulse delay-700">
          🎈
        </div>
      </div>

      <div className="flex flex-col items-center text-center w-full max-w-5xl relative z-10">
        {/* Header */}
        <h2 className="text-xl md:text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4 drop-shadow-lg">
          🧩 පුංචි කතන්දරයක් හරහා ප්‍රකාශන භාෂා හැකියාව බලමු ({currentIndex + 1}
          /4)
        </h2>

        <p className="text-gray-700 mb-6 text-lg font-semibold bg-white/70 px-6 py-3 rounded-2xl shadow-md">
          🎧 ඔබේ දරුවාට පහත වීඩියෝව හෝ පින්තූරය හොඳින් නරඹන්න. පසුව ඒ කතන්දරය
          නැවත කියන ලෙස පටිගත කරන්න.
        </p>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full border-8 border-purple-200 mb-8 flex flex-col md:flex-row items-center justify-between gap-8 relative">
          {/* Top stripe */}
          <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 rounded-t-3xl"></div>

          {/* Left: Media */}
          <div className="flex-1 flex justify-center items-center">
            {stories[currentIndex].type === "video" ? (
              <video
                src={stories[currentIndex].src}
                controls
                className="w-full max-w-lg rounded-2xl shadow-xl border-4 border-pink-400"
              />
            ) : (
              <img
                src={stories[currentIndex].src}
                alt={`Story ${currentIndex + 1}`}
                className="w-full max-w-lg rounded-2xl shadow-xl border-4 border-pink-300"
              />
            )}
          </div>

          {/* Right: Transcript & Controls */}
          <div className="flex-1 flex flex-col items-center md:items-start text-left w-full">
            <div className="border-4 border-yellow-300 bg-gradient-to-r from-yellow-100 to-orange-100 p-5 min-h-[120px] rounded-2xl text-gray-800 w-full mb-6 font-semibold">
              {transcripts[currentIndex] || "🎤 තවම පටිගත කර නැත"}
            </div>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button
                onClick={() => startRecording(currentIndex)}
                className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 
             text-black font-bold py-3 px-6 rounded-full shadow-lg 
             flex items-center gap-3 transform hover:scale-105 transition-all border-4 border-green-300"
              >
                <FaMicrophone className="text-xl" />
                පටිගත කිරීම ආරම්භ කරන්න
              </button>

              <button
                onClick={() => stopRecording(currentIndex)}
                className="bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 
             text-black font-bold py-3 px-6 rounded-full shadow-lg 
             flex items-center gap-3 transform hover:scale-105 transition-all border-4 border-red-300"
              >
                <FaStopCircle className="text-xl" />
                පටිගත කිරීම නවත්වන්න
              </button>
            </div>
          </div>

          {/* Bottom stripe */}
          <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-purple-400 via-blue-400 via-green-400 via-yellow-400 to-red-400 rounded-b-3xl"></div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          {currentIndex > 0 && (
            <button
              onClick={goBack}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all border-4 border-yellow-300"
            >
              ⬅️ පෙර
            </button>
          )}

          {currentIndex < stories.length - 1 ? (
            <button
              onClick={goNext}
              className="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-black font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all border-4 border-blue-300"
            >
              ➡️ ඊළඟ
            </button>
          ) : (
            <button
              onClick={sendResponses}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-xl transform hover:scale-110 transition-all border-4 border-purple-300 animate-pulse"
            >
              📤 සියලුම ප්‍රතිචාර ඉදිරිපත් කරන්න
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default StoryAssessment;
