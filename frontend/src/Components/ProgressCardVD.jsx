import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";

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
        "http://localhost:5000/vd/latest_vd_progress", // VD API
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

  const {
    previous_score,
    latest_score,
    improvement_percentage,
    previous_level,
    latest_level
  } = progress;

  const improvementValue = parseFloat(improvement_percentage); // for coloring

  return (
    <div>
      <Header />
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-xl mx-auto mt-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          📊 Visual Discrimination Progress
        </h2>

        <div className="space-y-3">
          <p>
            <strong>Previous Score:</strong> {previous_score}%
          </p>
          <p>
            <strong>Latest Score:</strong> {latest_score}%
          </p>
          <p>
            <strong>Improvement:</strong>{" "}
            {improvementValue > 0 ? (
              <span className="text-green-600 font-semibold">
                +{improvement_percentage}
              </span>
            ) : (
              <span className="text-red-600 font-semibold">
                {improvement_percentage}
              </span>
            )}
          </p>
          <p>
            <strong>Previous Level:</strong> {previous_level}
          </p>
          <p>
            <strong>Latest Level:</strong> {latest_level}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressCardVD;