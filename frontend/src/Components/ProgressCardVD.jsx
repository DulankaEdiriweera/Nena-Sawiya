import React, { useEffect, useState } from "react";
import axios from "axios";

const levelMap = {
  High: "ඉතා හොඳයි",
  Normal: "සාමාන්‍ය",
  Weak: "දුර්වල",
  "N/A": "N/A",
};

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
      setError("ප්‍රගතිය ගණනය කිරීමට ප්‍රමාණවත් ඇගයීම් නොමැත.");
    }
  };

  if (error) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg shadow-md max-w-md mx-auto mt-6">
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

  return (
    <div className="max-w-xl mx-auto mt-10 bg-gray-50 pb-10">
      <div className="bg-white shadow-md rounded-2xl p-6 max-w-lg mx-auto mt-8 border border-gray-100">

        {/* Pastel Pink Header — same structure as friend's green header */}
        <div className="rounded-xl p-4 mb-6 text-center" style={{ background: "#fce7f3" }}>
          <h2 className="text-xl md:text-2xl font-semibold" style={{ color: "#9d174d" }}>
            දෘශ්‍ය විභේදන භාෂා ප්‍රගති විශ්ලේෂණය
          </h2>
        </div>

        {/* Data Section — same structure as friend's */}
        <div className="space-y-4 text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">පෙර ලකුණු:</span>
            <span>{progress.previous_percentage}%</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">නවතම ලකුණු:</span>
            <span>{progress.latest_percentage}%</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">ප්‍රගතිය:</span>
            {progress.percentage_change > 0 ? (
              <span className="text-green-600 font-semibold">
                +{progress.percentage_change}%
              </span>
            ) : (
              <span className="text-red-600 font-semibold">
                {progress.percentage_change}%
              </span>
            )}
          </div>

          <div className="flex justify-between">
            <span className="font-medium">පෙර මට්ටම:</span>
            <span>{levelMap[progress.previous_level] || progress.previous_level}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">නවතම මට්ටම:</span>
            <span>{levelMap[progress.latest_level] || progress.latest_level}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProgressCardVD;