import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Story1 from "../Assets/Story1.mp4";
import Story2 from "../Assets/Story2.mp4";
import Image3 from "../Assets/Image3.jpg";
import Image4 from "../Assets/Image4.jpg";

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
      navigate("/");
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
    <div className="font-sans min-h-screen bg-gradient-to-b from-pink-200 to-blue-300 flex flex-col items-center justify-center py-10 px-4">
      <div className="flex flex-col items-center text-center w-full max-w-5xl">
        <h2 className="text-xl font-bold text-blue-600 mb-3 drop-shadow-md">
          🧩 පුංචි කතන්දරයක් හරහා ප්‍රකාශන භාෂා හැකියාව බලමු ({currentIndex + 1}
          /4)
        </h2>
        <p className="text-gray-700 mb-5">
          ඔබේ දරුවාට පහත පෙනෙන වීඩියෝව හෝ පින්තූරය හොඳින් අසන්නට සහ නරඹන්න ඉඩ
          හරින්න. පසුව දරුවාට නැවත ඒ කතන්දරය කියන ලෙස එය පටිගත කරන්න.
        </p>

        {/* --- Two-column layout --- */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full border-4 border-yellow-400 mb-6 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left side - Video/Image */}
          <div className="flex-1 flex justify-center items-center">
            {stories[currentIndex].type === "video" ? (
              <video
                src={stories[currentIndex].src}
                controls
                className="w-full max-w-lg rounded-2xl shadow-lg border-4 border-pink-400"
              />
            ) : (
              <img
                src={stories[currentIndex].src}
                alt={`Story ${currentIndex + 1}`}
                className="w-full max-w-lg rounded-2xl shadow-lg border-4 border-pink-300"
              />
            )}
          </div>

          {/* Right side - Transcript & Buttons */}
          <div className="flex-1 flex flex-col items-center md:items-start text-left">
            <div className="border-2 border-yellow-400 bg-yellow-50 p-4 min-h-[120px] rounded-xl text-gray-800 w-full mb-6">
              {transcripts[currentIndex] || "🎤 තවම පටිගත කර නැත"}
            </div>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button
                onClick={() => startRecording(currentIndex)}
                className="border-2 border-green-600 bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-full shadow-md transition-transform hover:scale-105"
              >
                ▶️ පටිගත කිරීම ආරම්භ කරන්න
              </button>
              <button
                onClick={() => stopRecording(currentIndex)}
                className="border-2 border-red-600 bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-full shadow-md transition-transform hover:scale-105"
              >
                🛑 පටිගත කිරීම නවත්වන්න
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {currentIndex > 0 && (
            <button
              onClick={goBack}
              className="border-2 border-yellow-600 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-8 rounded-full shadow-md transition-transform hover:scale-105"
            >
              පෙර
            </button>
          )}
          {currentIndex < stories.length - 1 ? (
            <button
              onClick={goNext}
              className="border-2 border-blue-600 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-8 rounded-full shadow-md transition-transform hover:scale-105"
            >
              ඊළඟ
            </button>
          ) : (
            <button
              onClick={sendResponses}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-8 rounded-full shadow-md transition-transform hover:scale-105"
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
