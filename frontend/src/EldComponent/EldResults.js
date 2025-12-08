import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-lg w-full">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            ❌ ප්‍රතිඵල හමු නොවීය.
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition-transform hover:scale-105"
          >
            🔙 පෙර
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-200 p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-lg text-center border-4 border-yellow-300">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">
          සමස්ත කතන්දර කීමේ ඇගයීම් ප්‍රතිඵලය
        </h2>

        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-6 shadow-inner mb-6">
          <p className="text-gray-800 text-lg mb-3">
            <span className="font-semibold">සමස්ත ලකුණු:</span>{" "}
            {result.Overall_Percentage}%
          </p>
          <p className="text-gray-800 text-lg mb-3">
            <span className="font-semibold">ප්‍රකාශන භාෂා අපහසුතා මට්ටම:</span> {result.ELD_Level}
          </p>
          <p className="text-gray-800 text-lg">
            <span className="font-semibold">උපදෙස්:</span> {result.Feedback}
          </p>
        </div>

        <button
          onClick={() => navigate("/story")}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition-transform hover:scale-105"
        >
          🔁 නැවත ආරම්භ කරන්න
        </button>
      </div>
    </div>
  );
}

export default ResultPage;
