import React, { useEffect, useState } from "react";
import axios from "axios";

const ProgressCardVD = () => {
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/vd/latest_vd_progress",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProgress(res.data);
    } catch (err) {
      console.error("VD Progress error:", err);
      setError("ප්‍රගතිය ලබා ගැනීමට නොහැකි විය.");
    }
  };

  if (error) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg shadow-md max-w-2xl mx-auto mt-6">
        <p className="text-yellow-800 text-center font-medium">{error}</p>
      </div>
    );
  }

  if (!progress) {
    return (
      <p className="text-gray-500 text-center mt-6">
        ප්‍රගතිය පූරණය වෙමින් පවතී...
      </p>
    );
  }

  const sinhalaLevel = {
    High: "ඉතා හොඳයි",
    Normal: "සාමාන්‍ය",
    Weak: "දුර්වල",
    "N/A": "N/A",
  };

  const getChangeColor = (change) => {
    if (change > 0) return "text-green-500";
    if (change < 0) return "text-red-500";
    return "text-gray-500";
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-8 max-w-2xl mx-auto mt-8 border border-gray-100">
      {/* Title */}
      <h2 className="text-3xl font-bold text-center mb-8">
        👁️ Progress Overview of VD
      </h2>

      {/* Scores */}
      <div className="space-y-4 mb-6">
        <p className="text-lg">
          <span className="font-bold">Previous Score:</span>{" "}
          {progress.previous_percentage}%
        </p>
        <p className="text-lg">
          <span className="font-bold">Latest Score:</span>{" "}
          {progress.latest_percentage}%
        </p>
        <p className="text-lg">
          <span className="font-bold">Change:</span>{" "}
          <span className={`font-bold ${getChangeColor(progress.percentage_change)}`}>
            {progress.percentage_change > 0
              ? `+${progress.percentage_change}%`
              : `${progress.percentage_change}%`}
          </span>
        </p>
      </div>

      <hr className="my-6 border-gray-200" />

      {/* Levels */}
      <div className="space-y-4 mb-6">
        <p className="text-lg">
          <span className="font-bold">Previous Level (Rule):</span>{" "}
          {progress.previous_level}
        </p>
        <p className="text-lg">
          <span className="font-bold">Latest Level (Rule):</span>{" "}
          {progress.latest_level}
        </p>
        <p className="text-lg">
          <span className="font-bold">Latest Sinhala Level:</span>{" "}
          {sinhalaLevel[progress.latest_level] || progress.latest_level}
        </p>
      </div>

      {/* Tip */}
      <p className="text-gray-500 text-sm mt-4">
        ⭐ Tip: Do the VD activities regularly to improve your score!
      </p>
    </div>
  );
};

export default ProgressCardVD;