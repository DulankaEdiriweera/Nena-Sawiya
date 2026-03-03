import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";

const ProgressCardELD = () => {
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

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
        },
      );

      setProgress(res.data);
    } catch (err) {
      console.error(err);
      setError("Not enough assessments to calculate progress.");
    }
  };

  if (error) {
    return (
      <div className="bg-yellow-100 p-4 rounded shadow">
        <p className="text-yellow-700">{error}</p>
      </div>
    );
  }

  if (!progress) {
    return <p>Loading progress...</p>;
  }

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-xl mx-auto mt-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          📊 Progress Overview of ELD
        </h2>

        <div className="space-y-3">
          <p>
            <strong>Previous Score:</strong> {progress.previous_percentage}%
          </p>
          <p>
            <strong>Latest Score:</strong> {progress.latest_percentage}%
          </p>
          <p>
            <strong>Improvement:</strong>{" "}
            {progress.percentage_change > 0 ? (
              <span className="text-green-600 font-semibold">
                +{progress.percentage_change}%
              </span>
            ) : (
              <span className="text-red-600 font-semibold">
                {progress.percentage_change}%
              </span>
            )}
          </p>
          <p>
            <strong>Previous Level:</strong> {progress.previous_level}
          </p>
          <p>
            <strong>Latest Level:</strong> {progress.latest_level}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressCardELD;
