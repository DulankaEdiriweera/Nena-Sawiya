import React, { useEffect, useState } from "react";
import ProgressCardELD from "./ProgressCardELD";

import axios from "axios";

const Progress = () => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/eld/latest_progress",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProgress(res.data);
    } catch (err) {
      console.log("No progress data yet");
      setProgress(null); // No data
    }
  };

  // If no progress data, show a message or nothing
  if (!progress) {
    return (
      <div className="text-center mt-10 p-6 text-gray-600">
        No progress data available yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Render all cards only if progress data exists */}
      <ProgressCardELD progress={progress} />
      {/* Add more cards as needed */}
    </div>
  );
};

export default Progress;