import React from "react";
import { useNavigate } from "react-router-dom";

function StudentAdvicePageDis() {
  const navigate = useNavigate();
  
  const handleStart = () => {
    navigate("/level1allin1");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-300 flex items-center justify-center p-4 relative">
      {/* Static decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-50"></div>
      <div
        className="absolute bottom-20 right-20 w-16 h-16 bg-pink-400 rounded-full opacity-50"
      ></div>
      <div
        className="absolute top-1/3 right-10 w-12 h-12 bg-blue-300 rounded-full opacity-50"
      ></div>

      <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-4xl w-full relative overflow-hidden">
        
        {/* Colorful top decoration */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400"></div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🎮✨</div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            ආරම්භ කිරීමට පෙර...
          </h1>
          <p className="text-xl text-gray-600 font-semibold">
            Before You Start...
          </p>
        </div>

        {/* Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-5 transform hover:scale-105 transition-transform duration-200">
            <div className="text-4xl mb-2">📖</div>
            <p className="font-bold text-blue-800 text-lg mb-1">
              Read carefully / හොඳින් කියවන්න
            </p>
            <p className="text-blue-700 text-sm">
              Make sure you understand each question before answering.
              ප්‍රශ්නය හොඳින් කියවා තේරුම් ගන්න.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-5 transform hover:scale-105 transition-transform duration-200">
            <div className="text-4xl mb-2">⏰</div>
            <p className="font-bold text-green-800 text-lg mb-1">
              Take your time / කාලය ගන්න
            </p>
            <p className="text-green-700 text-sm">
              Don't rush; answer at your own pace.
              ඉක්මනට නොකඩවා, ඔබේ වේගයට පිළිතුරු දාන්න.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-5 transform hover:scale-105 transition-transform duration-200">
            <div className="text-4xl mb-2">🖼️</div>
            <p className="font-bold text-purple-800 text-lg mb-1">
              Look carefully at pictures / රූප හොඳින් බලන්න
            </p>
            <p className="text-purple-700 text-sm">
              Pay attention to details like shape, rotation, and color.
              හැඩය, හැරවුම සහ වර්ණ වැනි විශේෂාංග පරීක්ෂා කරන්න.
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl p-5 transform hover:scale-105 transition-transform duration-200">
            <div className="text-4xl mb-2">✅</div>
            <p className="font-bold text-yellow-800 text-lg mb-1">
              Choose the best answer / හොඳම පිළිතුර තෝරන්න
            </p>
            <p className="text-yellow-700 text-sm">
              Only select what you think is correct.
              ඔබට හරි කියා සිතෙන පිළිතුර පමණක් තෝරන්න.
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl p-5 transform hover:scale-105 transition-transform duration-200">
            <div className="text-4xl mb-2">🎯</div>
            <p className="font-bold text-pink-800 text-lg mb-1">
              Stay focused / අවධානයෙන් ඉන්න
            </p>
            <p className="text-pink-700 text-sm">
              Try not to get distracted while answering.
              පිළිතුරු දීමට අවධානයෙන් ඉන්න.
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-5 transform hover:scale-105 transition-transform duration-200">
            <div className="text-4xl mb-2">🙋</div>
            <p className="font-bold text-orange-800 text-lg mb-1">
              Ask for help if needed / උදව් ඉල්ලන්න
            </p>
            <p className="text-orange-700 text-sm">
              If you don't understand instructions, ask your teacher.
              උපදෙස් තේරුම් නොගත්නම් ගුරුවරයාගෙන් උදව් ඉල්ලන්න.
            </p>
          </div>

        </div>

        {/* Time note */}
        <div className="bg-gradient-to-r from-indigo-100 to-cyan-100 border-4 border-indigo-300 rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-3">
            <div className="text-4xl">⏱️</div>
            <div>
              <p className="font-bold text-indigo-800 text-lg">
                Time will be recorded / කාලය සටහන් කරගනු ලැබේ
              </p>
              <p className="text-indigo-700">
                The time you spend answering will be noted.
                ඔබ ගත කරන කාලය සටහන් කරගනී.
              </p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            onClick={handleStart}
            className="px-12 py-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white text-2xl font-bold rounded-full shadow-lg transform hover:scale-110 transition-all duration-200 hover:shadow-2xl"
          >
            🚀 ආරම්භ කරන්න / START! 🎉
          </button>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400"></div>
      </div>
    </div>
  );
}

export default StudentAdvicePageDis;
