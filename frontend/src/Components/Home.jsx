import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Logo from "../Assets/Logo.jpeg";
import { useNavigate } from "react-router-dom";
import Slide1 from "../Assets/HomePageSlider/student.png";
import Slide2 from "../Assets/HomePageSlider/StudentParent.png";
import Slide3 from "../Assets/HomePageSlider/StudentTeacher.jpeg";

const Home = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const navigate = useNavigate();

  const slides = [Slide1, Slide2, Slide3];

  useEffect(() => {
    const t = setInterval(
      () => setSlideIndex((p) => (p + 1) % slides.length),
      3000,
    );
    return () => clearInterval(t);
  }, []);

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
        {/* Hero Section - Slideshow */}
        <div className="flex justify-center mb-5">
          <div
            className="relative w-full rounded-3xl overflow-hidden shadow-2xl"
            style={{ height: "550px" }}
          >
            {slides.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`slide-${i}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === slideIndex ? "opacity-100" : "opacity-0"}`}
              />
            ))}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all ${i === slideIndex ? "bg-white scale-125" : "bg-white/50"}`}
                />
              ))}
            </div>
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
                අපේ වෙබ් අඩවිය විශේෂ ඇයි?
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
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 pt-20 "></div>
      {/* Interventions Button Section */}
      <div className="text-center mb-16">
        <h3 className="text-2xl sm:text-3xl font-bold text-purple-800 mb-6">
          🧩 දුෂ්කරතා මග හරවා ගනිමු
        </h3>

        <p className="text-gray-700 mb-6 text-base sm:text-lg">
          දරුවන්ගේ ඉගෙනීමේ අපහසුතා සඳහා විශේෂ උපකාරක ක්‍රියාමාර්ග
        </p>

        <button
          onClick={() => navigate("/intervention-dashboard")}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 
               text-white font-bold py-4 px-10 
               rounded-full shadow-xl hover:shadow-2xl 
               transform hover:scale-105 transition-all 
               text-lg sm:text-xl"
        >
          ක්‍රියාකාරකම් වෙත යන්න →
        </button>
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
