import React, { useState } from "react";
import Header from "../Components/Header";
import Logo from "../Assets/Logo.jpeg";
import Owl from "../Assets/Owl.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const components = [
    {
      id: 1,
      title: "ප්‍රකාශන භාෂා කුසලතාව ඇගයීම",
      subtitle: "Expressive Language Disorder",
      description: "අදහස් ප්‍රකාශ කිරීමේ දුෂ්කරතා",
      color: "from-pink-400 to-rose-500",
      bgColor: "bg-gradient-to-br from-pink-100 to-rose-100",
      emoji: "💬",
      path: "/elduserguide",
    },
    {
      id: 2,
      title: "ප්‍රතිග්‍රාහක භාෂා කුසලාතාව ඇගයීම",
      subtitle: "Receptive Language Disorder",
      description: "අදහස් තේරුම් ගැනීමේ දුෂ්කරතා",
      color: "from-purple-400 to-indigo-500",
      bgColor: "bg-gradient-to-br from-purple-100 to-indigo-100",
      emoji: "🔊",
      path: "/RLDTestInstructionsPage",
    },
    {
      id: 3,
      title: "දෘශ්‍ය විභේදන සහ මතක ඇගයීම",
      subtitle: "Visual Discrimination",
      description: "වෙනස්කම් හඳුනාගැනීමේ දුෂ්කරතා",
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-100 to-emerald-100",
      emoji: "👁️",
      path: "/visual",
    },
    {
      id: 4,
      title: "දෘශ්‍ය සම්පූර්ණතා හැකියාව ඇගයීම",
      subtitle: "Visual Closure Deficits",
      description: "අසම්පූර්ණ රූප හඳුනාගැනීමේ දුෂ්කරතා",
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-gradient-to-br from-yellow-100 to-orange-100",
      emoji: "🔷",
      path: "/vcDashboard",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 relative overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <div className="flex justify-center mb-2">
            <img
              src={Owl}
              alt="Mascot"
              className="w-40 h-40 object-contain animate-bounce rounded-3xl"
              style={{ animationDuration: "2s" }}
            />
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-100 rounded-3xl p-10 sm:p-14 text-center shadow-2xl border-4 border-purple-300 pb-2">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 text-purple-800">
            ආයුබෝවන්!
          </h3>

          {/* Description Section */}
          <div className="bg-white/70 rounded-2xl p-6 sm:p-8 mb-8 max-w-3xl mx-auto">
            <p className="text-base sm:text-lg md:text-xl text-gray-800 mb-4 leading-relaxed">
              🌟{" "}
              <strong className="text-purple-700">
                අපේ වෙබ් අඩවිය විශේෂයි ඇයි?
              </strong>
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-3 leading-relaxed">
              📚 ඉගෙනීමේ අපහසුතා ඇති දරුවන් සඳහා විශේෂයෙන් නිර්මාණය කර ඇත.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-3 leading-relaxed">
              👨‍⚕️ වෛද්‍යවරුන්ගේ උපදෙස් මත සකස් කර, බලපත්‍රලාභී වෛද්‍යවරුන් විසින්
              සහතික කර ඇත.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-3 leading-relaxed">
              ✅ ප්‍රාථමික පාසල් ළමුන් සමග සාර්ථකව පරීක්ෂා කර ඇත.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              💖 ඔබේ දරුවාට සතුටින්, ආරක්ෂිතව ඉගෙන ගැනීමට උපකාර වේ.
            </p>
          </div>

          <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-medium text-purple-800">
            සතුටින් ඉගෙන ගන්න දැන්ම ලියාපදිංචි වන්න! 🎯
          </p>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-5 px-12 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all text-lg sm:text-xl hover:from-purple-600 hover:to-pink-600">
            දැන්ම ලියාපදිංචි වන්න ✨
          </button>

          {/* Trust Badge */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-purple-700">
            <span className="bg-white/80 px-4 py-2 rounded-full">
              ✓ වෛද්‍ය අනුමත
            </span>
            <span className="bg-white/80 px-4 py-2 rounded-full">
              ✓ දරුවන් සමඟ පරීක්ෂිත
            </span>
            <span className="bg-white/80 px-4 py-2 rounded-full">
              ✓ ආරක්ෂිත ඉගෙනීම
            </span>
          </div>
        </div>

        <div className="text-center mb-2 pt-12 ">
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-800 font-bold max-w-3xl mx-auto mb-3">
            👉 ඉගෙනීම කියන්නේ දැනුම ලබමින් සතුටු වෙන්න පුළුවන් සුන්දර ගමනක්!
            🌈📘
          </p>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 font-medium">
            ඔබ කැමති ක්‍රියාකාරකමක් තෝරාගන්න
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 pt-20 ">
          {components.map((component) => (
            <div
              key={component.id}
              onClick={() => navigate(component.path)}
              onMouseEnter={() => setHoveredCard(component.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`${
                component.bgColor
              } rounded-3xl p-6 shadow-2xl transform transition-all duration-300 cursor-pointer border-4 border-white ${
                hoveredCard === component.id
                  ? "scale-105 shadow-3xl -translate-y-3"
                  : ""
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`bg-white p-6 rounded-3xl shadow-lg mb-4 transform transition-all ${
                    hoveredCard === component.id ? "scale-110 rotate-12" : ""
                  }`}
                >
                  <span className="text-6xl">{component.emoji}</span>
                </div>

                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${component.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-4`}
                >
                  {component.id}
                </div>

                <h3 className="text-md font-bold text-gray-800 mb-2">
                  {component.title}
                </h3>
                <p className="text-sm text-gray-600 font-semibold mb-3">
                  {component.subtitle}
                </p>
                <p className="text-base text-gray-700 mb-6 font-medium leading-relaxed">
                  {component.description}
                </p>

                <button
                  className={`w-full bg-gradient-to-r ${component.color} text-white font-bold py-3 px-4 rounded-2xl shadow-lg hover:shadow-2xl transform transition-all`}
                >
                  ආරම්භ කරන්න →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 mt-12 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg font-bold mb-2">
            3-5 ශ්‍රේණි සිංහල මාධ්‍ය සිසුන් සඳහා නිර්මාණය කරන ලදී ❤️
          </p>
          <p className="text-purple-100 mt-2">
            © 2025 Learning Disabilities Detection System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
