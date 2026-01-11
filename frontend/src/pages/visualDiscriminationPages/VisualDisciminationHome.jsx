import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";

export default function VisualDiscriminationHome() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/visualDisAdvices");
  };

  const handleProgress = () => {
    
  };

  const handleHelp = () => {
    
  };

  return (
    <div>
      <Header/>
      <div>
        <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 flex items-center justify-center p-4 relative overflow-hidden">
      
      
      <div className="absolute top-20 left-20 w-24 h-24 bg-yellow-300 rounded-full opacity-60"></div>
      <div
        className="absolute top-40 right-32 w-16 h-16 bg-pink-400 rounded-full opacity-60"
      ></div>
      <div
        className="absolute bottom-32 left-40 w-20 h-20 bg-blue-400 rounded-full opacity-60"
      ></div>
      <div
        className="absolute bottom-20 right-20 w-28 h-28 bg-green-300 rounded-full opacity-60"
      ></div>
      
      
      <div className="absolute top-10 right-10 text-yellow-400 text-4xl animate-pulse">⭐</div>
      <div
        className="absolute top-1/4 left-10 text-yellow-300 text-3xl animate-pulse"
        style={{ animationDelay: "0.5s" }}
      >
        ✨
      </div>
      <div
        className="absolute bottom-1/4 right-16 text-yellow-400 text-5xl animate-pulse"
        style={{ animationDelay: "1s" }}
      >
        🌟
      </div>

      <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-12 max-w-3xl w-full relative z-10 border-8 border-purple-200">
        
        
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 rounded-t-3xl"></div>

        
        <div className="text-center mb-6">
          <div className="text-7xl mb-4 animate-bounce">🎨🧠✨</div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3 leading-tight">
            දෘශ්‍ය විභේදන ක්‍රීඩාව සහ මතක ඇගයීමේ ක්‍ර්‍රීඩාව
          </h1>
          <p className="text-2xl font-bold text-purple-600 mb-2">
            Visual Discrimination Game
          </p>
          <p className="text-xl text-gray-600 font-semibold">
            🎮 Memory & Pattern Fun! 🎮
          </p>
        </div>

        
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-8 border-4 border-yellow-300">
          <p className="text-gray-800 text-lg leading-relaxed text-center font-semibold">
            🎯 ප්‍රාථමික ශිෂ්‍යයන්ගේ දෘශ්‍ය සහ මනෝවිද්‍යාත්මක හැකියාවන් වර්ධනය කිරීමට නිර්මාණය කරන ලද ක්‍රීඩාවකි. 🎯
          </p>
        </div>

        
        <div className="space-y-4 mb-10">
          
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-5 border-4 border-blue-300 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-start gap-4">
              <div className="text-5xl flex-shrink-0">👀</div>
              <div>
                <p className="font-bold text-blue-800 text-xl mb-1">
                  රූප සහ පාට හඳුනා ගැනීම
                </p>
                <p className="text-blue-700 text-base">
                  දෘශ්‍ය විභේදන හැකියාව තීක්ෂ්ණ කරන්න
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  🌈 Learn to spot colors & shapes!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-5 border-4 border-purple-300 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-start gap-4">
              <div className="text-5xl flex-shrink-0">🧩</div>
              <div>
                <p className="font-bold text-purple-800 text-xl mb-1">
                  රටා සහ අනුක්‍රමයන් අනුමාන කරන්න
                </p>
                <p className="text-purple-700 text-base">
                  තාර්කික චින්තනය සහ මතක ශක්තිය වැඩිදියුණු කරන්න
                </p>
                <p className="text-purple-600 text-sm mt-1">
                  🎲 Find patterns & solve puzzles!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-5 border-4 border-green-300 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-start gap-4">
              <div className="text-5xl flex-shrink-0">🚀</div>
              <div>
                <p className="font-bold text-green-800 text-xl mb-1">
                  ක්‍රමයෙන් දුක්ෂිතර අභියෝගයන්
                </p>
                <p className="text-green-700 text-base">
                  සංකල්ප හැකියාවන් සහ විමසුම් ශක්තිය වර්ධනය කරන්න
                </p>
                <p className="text-green-600 text-sm mt-1">
                  ⭐ Get better with each level!
                </p>
              </div>
            </div>
          </div>

        </div>

        
        <div className="space-y-4">
          
          <button
            onClick={handleProgress}
            className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-5 px-6 rounded-2xl text-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-4 border-blue-300"
          >
            📊 ප්‍රගති වාර්තාව බලන්න / View Progress
          </button>

          <button
            onClick={handleHelp}
            className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white font-bold py-5 px-6 rounded-2xl text-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-4 border-orange-300"
          >
            ❓ උපදෙස් / Help & Tips
          </button>

          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-6 px-6 rounded-2xl text-2xl shadow-xl transform hover:scale-110 transition-all duration-200 border-4 border-green-300 animate-pulse"
          >
            🎮 ආරම්භ කරන්න / LET'S PLAY! 🎉
          </button>

        </div>

        
        <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-purple-400 via-blue-400 via-green-400 via-yellow-400 to-red-400 rounded-b-3xl"></div>

      </div>
    </div>
      </div>
    </div>
  );
}
