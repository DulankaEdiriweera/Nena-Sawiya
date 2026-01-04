import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Components/Header";

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
    <div>
      <div>
        <Header />
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 p-6 relative overflow-hidden">
        {/* Floating Decorations Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 hidden md:block">
          {/* Top Left */}
          <div className="absolute top-10 left-10 w-40 h-40 bg-pink-700 rounded-full opacity-30"></div>
          <div className="absolute top-28 left-16 text-pink-400 text-7xl animate-pulse">
            ✨
          </div>

          {/* Top Right */}
          <div className="absolute top-20 right-16 w-40 h-40 bg-yellow-500 rounded-full opacity-30 delay-300"></div>
          <div className="absolute top-32 right-5 text-yellow-400 text-6xl animate-pulse delay-500">
            ⭐
          </div>

          {/* Middle Left */}
          <div className="absolute top-1/2 left-6 w-14 h-14 bg-purple-700 rounded-full opacity-30 animate-pulse"></div>

          {/* Middle Right */}
          <div className="absolute top-1/2 right-6 w-14 h-14 bg-blue-700 rounded-full opacity-30 delay-700"></div>

          {/* Bottom Left */}
          <div className="absolute bottom-5 left-5 w-20 h-20 bg-cyan-800 rounded-full opacity-30 delay-500"></div>
          <div className="absolute bottom-32 left-14 text-purple-400 text-8xl animate-pulse">
            🎨
          </div>

          {/* Bottom Right */}
          <div className="absolute bottom-10 right-14 w-40 h-40 bg-green-700 rounded-full opacity-30 delay-1000"></div>
          <div className="absolute bottom-40 right-10 text-red-400 text-7xl animate-pulse delay-700">
            🎈
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-xl text-center border-8 border-purple-200 relative z-10">
          {/* Top Color Strip */}
          <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 rounded-t-3xl"></div>

          {/* Title */}
          <h2 className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-8">
            සමස්ත කතන්දර කීමේ ඇගයීම් ප්‍රතිඵලය
          </h2>

          {/* Result Box */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-4 border-yellow-300 rounded-2xl p-6 shadow-inner mb-8 text-left">
            <p className="text-gray-800 text-lg mb-3">
              ⭐ <span className="font-bold">සමස්ත ලකුණු:</span>{" "}
              <span className="font-normal">{result.Overall_Percentage}%</span>
            </p>

            <p className="text-gray-800 text-lg mb-3">
              🧠 <span className="font-bold">ප්‍රකාශන භාෂා අපහසුතා මට්ටම:</span>{" "}
              <span className="font-normal">{result.ELD_Level}</span>
            </p>

            <p className="text-gray-800 text-lg">
              💡 <span className="font-bold">උපදෙස්:</span>{" "}
              <span className="font-normal">{result.Feedback}</span>
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={() => navigate("/story")}
            className="bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 
                 text-black font-bold py-4 px-8 rounded-full shadow-xl 
                 transform hover:scale-110 transition-all border-4 border-green-300 animate-pulse"
          >
            නැවත ආරම්භ කරන්න
          </button>

          {/* Bottom Color Strip */}
          <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-purple-400 via-blue-400 via-green-400 via-yellow-400 to-red-400 rounded-b-3xl"></div>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
