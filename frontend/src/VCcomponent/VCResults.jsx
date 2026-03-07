import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Trophy, Star, Clock, Award, CheckCircle, Home, Download } from "lucide-react";
//import AlertTriangle  from "lucide-react";
import Header from "../Components/Header";

const VCResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [results, setResults] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Prefer location.state, fallback to sessionStorage
    if (location.state) {
      setResults(location.state);
      sessionStorage.setItem("vcResults", JSON.stringify(location.state));
    } else {
      const stored = sessionStorage.getItem("vcResults");
      if (stored) {
        try {
          setResults(JSON.parse(stored));
        } catch (e) {
          navigate("/vcDashboard");
        }
      } else {
        navigate("/vcDashboard");
      }
    }

    const t = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(t);
  }, [location, navigate]);

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl font-bold text-purple-700">ප්‍රතිඵල පූරණය වෙමින්...</p>
        </div>
      </div>
    );
  }

  // Backend fields (new)
  const {
    VC_Level,
    // Confidence,
    Feedback,
    marks_level1,
    marks_level2,
    marks_level3,
    total_marks,
    final_marks_percent,
    //rule_based_label,
    //ml_label_en,
    //ml_vs_rule_mismatch,
    levelMarks, // UI summary from assessment
  } = results;

  // Color based on VC_Level Sinhala
  const getPerformanceColor = () => {
    if (VC_Level === "ඉතා හොදයි") return "green";
    if (VC_Level === "සාමාන්‍ය") return "yellow";
    return "orange";
  };

  const performanceColor = getPerformanceColor();

  const colorClasses = {
    green: {
      gradient: "from-green-400 to-emerald-500",
      bg: "bg-green-100",
      border: "border-green-400",
      text: "text-green-700",
    },
    yellow: {
      gradient: "from-yellow-400 to-amber-500",
      bg: "bg-yellow-100",
      border: "border-yellow-400",
      text: "text-yellow-700",
    },
    orange: {
      gradient: "from-orange-400 to-red-500",
      bg: "bg-orange-100",
      border: "border-orange-400",
      text: "text-orange-700",
    },
  };

  const colors = colorClasses[performanceColor];
  const shouldShowInterventionButton = VC_Level !== "ඉතා හොදයි";

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Prefer backend marks/time (marks are backend), time from UI summary if available
  const lvl1Time = levelMarks?.level1?.timeTaken ?? 0;
  const lvl2Time = levelMarks?.level2?.timeTaken ?? 0;
  const lvl3Time = levelMarks?.level3?.timeTaken ?? 0;

  const lvl1Correct = levelMarks?.level1?.correctCount ?? null;
  const lvl2Correct = levelMarks?.level2?.correctCount ?? null;
  const lvl3Correct = levelMarks?.level3?.correctCount ?? null;

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200 p-4 md:p-6 relative overflow-hidden">
        {/* Confetti */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  fontSize: `${Math.random() * 20 + 20}px`,
                }}
              >
                {["🎉", "⭐", "🎊", "✨", "🌟"][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6 animate-bounce">
          <div className="inline-block bg-white rounded-full p-6 shadow-2xl border-4 border-purple-400">
            <Trophy className="w-16 h-16 text-yellow-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-purple-700 mt-4 drop-shadow-lg">සුභ පැතුම්! 🎊</h1>
          <p className="text-xl md:text-2xl text-purple-600 mt-2 font-semibold">ඔබ ක්‍රීඩාව සම්පූර්ණ කළා!</p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {/* Overall */}
          <div
            className={`bg-gradient-to-r ${colors.gradient} rounded-2xl p-6 shadow-2xl border-4 ${colors.border} transform hover:scale-105 transition-all`}
          >
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Award className="w-12 h-12 text-white" />
                <h2 className="text-3xl md:text-4xl font-bold text-white">ඔබේ මට්ටම: {VC_Level}</h2>
                <Award className="w-12 h-12 text-white" />
              </div>

              <div className="bg-white bg-opacity-30 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-6xl font-bold text-white mb-2">{total_marks}/25</p>
                <p className="text-2xl font-semibold text-white">ලකුණු ({final_marks_percent}%)</p>
              </div>

              {/* <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-3">
                <p className="text-white font-semibold flex items-center justify-center">
                  <Star className="w-5 h-5 mr-2" />
                  විශ්වාසනීයත්වය: {Confidence}%
                </p>
              </div> */}

              {/* Optional: mismatch warning */}
              {/* {ml_vs_rule_mismatch && (
                <div className="mt-4 bg-white bg-opacity-25 rounded-lg p-3 border-2 border-white">
                  <p className="text-white font-bold flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    සටහන: (ML) {ml_label_en} සහ (Marks) {rule_based_label} අතර වෙනසක් ඇත.
                  </p>
                </div>
              )} */}
            </div>
          </div>

          {/* Feedback */}
          <div className={`${colors.bg} rounded-2xl p-6 shadow-2xl border-4 ${colors.border}`}>
            <h3 className={`text-2xl font-bold ${colors.text} mb-4 flex items-center`}>
              <Award className="w-8 h-8 mr-3" />
              ප්‍රතිචාරය
            </h3>
            <div className="bg-white rounded-xl p-5 border-2 border-gray-300">
              <p className="text-xl font-semibold text-gray-800 leading-relaxed">{Feedback}</p>
            </div>
          </div>

          {/* Level Breakdown */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl border-4 border-blue-300">
            <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
              <Star className="w-8 h-8 mr-3 text-yellow-500" />
              මට්ටම් විස්තරය
            </h3>

            <div className="space-y-4">
              {/* Level 1 */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border-4 border-purple-300">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xl font-bold text-purple-700">මට්ටම 1 - හැඩතල හඳුනා ගැනීම</h4>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-2xl font-bold text-purple-700">{marks_level1}/5</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-700">කාලය:</span>
                    </div>
                    <p className="text-lg font-bold text-blue-700 mt-1">{formatTime(lvl1Time)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm font-semibold text-gray-700">නිවැරදි:</span>
                    </div>
                    <p className="text-lg font-bold text-green-700 mt-1">
                      {lvl1Correct !== null ? `${lvl1Correct}/3` : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Level 2 */}
              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-4 border-4 border-blue-300">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xl font-bold text-blue-700">මට්ටම 2 - රූප හඳුනා ගැනීම</h4>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-2xl font-bold text-blue-700">{marks_level2}/10</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-700">කාලය:</span>
                    </div>
                    <p className="text-lg font-bold text-blue-700 mt-1">{formatTime(lvl2Time)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm font-semibold text-gray-700">නිවැරදි:</span>
                    </div>
                    <p className="text-lg font-bold text-green-700 mt-1">
                      {lvl2Correct !== null ? `${lvl2Correct}/3` : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Level 3 */}
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 border-4 border-green-300">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xl font-bold text-green-700">මට්ටම 3 - අකුරු සහ වචන</h4>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-2xl font-bold text-green-700">{marks_level3}/10</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-700">කාලය:</span>
                    </div>
                    <p className="text-lg font-bold text-blue-700 mt-1">{formatTime(lvl3Time)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm font-semibold text-gray-700">නිවැරදි:</span>
                    </div>
                    <p className="text-lg font-bold text-green-700 mt-1">
                      {lvl3Correct !== null ? `${lvl3Correct}/4` : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xl font-bold py-4 px-8 rounded-full shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2"
            >
              <Home className="w-6 h-6" />
              <span>මුල් පිටුවට</span>
            </button>

            {shouldShowInterventionButton && (
              <button
                onClick={() => navigate("/vcStudentDashboard")}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xl font-bold py-4 px-8 rounded-full shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2"
              >
                <CheckCircle className="w-6 h-6" />
                <span>අභ්‍යාස ක්‍රියාකාරකම් වෙත යන්න</span>
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl font-bold py-4 px-8 rounded-full shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2"
            >
              <Download className="w-6 h-6" />
              <span>මුද්‍රණය කරන්න</span>
            </button>
          </div>

          {/* Motivation */}
          <div className="text-center">
            <div className="inline-block bg-white rounded-2xl px-8 py-5 shadow-lg border-4 border-yellow-300">
              <p className="text-2xl font-bold text-purple-700 flex items-center justify-center">
                <Star className="w-8 h-8 text-yellow-500 mr-3 animate-pulse" />
                මතක තබා ගන්න! 🌈 සෑම දරුවෙකුම වෙනස් ආකාරයකින් සහ තමන්ගේම වේගයකින් ඉගෙන ගනී.
                ඔබ අද ඔබේ උපරිමය කළා, ඒක තමයි වැදගත්ම!
                <Star className="w-8 h-8 text-yellow-500 ml-3 animate-pulse" />
              </p>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fall {
            to {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }
          .animate-fall {
            animation: fall 3s linear forwards;
          }
        `}</style>
      </div>
    </div>
  );
};

export default VCResults;