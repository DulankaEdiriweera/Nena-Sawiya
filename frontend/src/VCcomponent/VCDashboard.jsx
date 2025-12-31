import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Sparkles, Star, Zap, Heart, Smile, Rocket } from 'lucide-react';
import Header from '../Components/Header';

const VCDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header/>
      <div>
        <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-200 p-4 md:p-6">
      {/* Floating decorative elements */}
      <div className="fixed top-10 left-10 animate-bounce">
        <Star className="w-8 h-8 text-yellow-500 opacity-60" />
      </div>
      <div className="fixed top-20 right-20 animate-pulse">
        <Sparkles className="w-10 h-10 text-pink-500 opacity-60" />
      </div>
      <div className="fixed bottom-20 left-20 animate-bounce">
        <Heart className="w-8 h-8 text-red-400 opacity-60" />
      </div>

      {/* Header with fun animation */}
      <div className="text-center mb-6 animate-bounce">
        <div className="inline-block bg-white rounded-full p-5 shadow-2xl border-4 border-purple-300">
          <Eye className="w-12 h-12 md:w-16 md:h-16 text-purple-600 animate-pulse" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-purple-700 mt-4 drop-shadow-lg">
          දෘශ්‍ය වසා ගැනීමේ ක්‍රීඩාව 🎮
        </h1>
        <p className="text-xl md:text-2xl text-purple-600 mt-2 font-semibold">
          Visual Closure Fun Game!
        </p>
      </div>

      {/* Main content card */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-5 border-4 border-blue-300 transform hover:scale-105 transition-transform duration-200 shadow-2xl">
        {/* Welcome message with emoji */}
        <div className="text-center mb-6 bg-white rounded-xl p-5 shadow-lg">
          <div className="text-5xl mb-3 animate-bounce">
            <Smile className="w-16 h-16 text-yellow-500 inline-block" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-purple-600 mb-3">
            ආයුබෝවන් පුංචි යාළුවා! 👋
          </h2>
          <p className="text-lg md:text-xl text-gray-700 font-semibold">
            අපි මේ සතුටු ක්‍රීඩාවෙන් හැඩ සහ රූප හඳුනා ගමු! 🌈
          </p>
        </div>

        {/* Instructions card - more playful */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-5 mb-5 border-4 border-yellow-400 shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-orange-500 mr-3 animate-spin" />
            <h3 className="text-xl md:text-2xl font-bold text-orange-700">මෙන්න උපදෙස්:</h3>
            <Sparkles className="w-8 h-8 text-orange-500 ml-3 animate-spin" />
          </div>
          <ul className="space-y-3 text-base md:text-lg text-gray-800 bg-white rounded-xl p-4">
            <li className="flex items-start hover:bg-yellow-50 p-2 rounded-lg transition-colors">
              <span className="text-3xl mr-3">🎯</span>
              <span className="font-semibold">මට්ටම් 3ක් තියෙනවා - සරලයි සිට අපහසුයි දක්වා!</span>
            </li>
            <li className="flex items-start hover:bg-yellow-50 p-2 rounded-lg transition-colors">
              <span className="text-3xl mr-3">🖼️</span>
              <span className="font-semibold">රූපය හොඳින් බලන්න සහ නිවැරදි උත්තරය තෝරන්න</span>
            </li>
            <li className="flex items-start hover:bg-yellow-50 p-2 rounded-lg transition-colors">
              <span className="text-3xl mr-3">⏱️</span>
              <span className="font-semibold">එක් එක් මට්ටම සඳහා කාලය මනිනවා</span>
            </li>
            <li className="flex items-start hover:bg-yellow-50 p-2 rounded-lg transition-colors">
              <span className="text-3xl mr-3">✨</span>
              <span className="font-semibold">සෑම ප්‍රශ්නයක්ම වැදගත්, හොඳින් සිතන්න!</span>
            </li>
          </ul>
        </div>

        {/* What you'll do section - more colorful */}
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-5 mb-6 border-4 border-pink-300 shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-pink-600 mr-3 animate-pulse" />
            <h3 className="text-xl md:text-2xl font-bold text-pink-700">මොනවද කරන්නේ?</h3>
            <Star className="w-8 h-8 text-pink-600 ml-3 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transform hover:scale-105 transition-all border-4 border-purple-200">
              <div className="text-5xl mb-2 animate-bounce">🔷</div>
              <h4 className="font-bold text-purple-600 mb-2 text-lg">මට්ටම 1</h4>
              <p className="text-gray-700 font-semibold">හැඩතල හඳුනා ගැනීම</p>
              <p className="text-purple-500 text-sm mt-1">(ප්‍රශ්න 3)</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transform hover:scale-105 transition-all border-4 border-blue-200">
              <div className="text-5xl mb-2 animate-bounce">🎨</div>
              <h4 className="font-bold text-blue-600 mb-2 text-lg">මට්ටම 2</h4>
              <p className="text-gray-700 font-semibold">රූප හඳුනා ගැනීම</p>
              <p className="text-blue-500 text-sm mt-1">(ප්‍රශ්න 3)</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transform hover:scale-105 transition-all border-4 border-green-200">
              <div className="text-5xl mb-2 animate-bounce">📝</div>
              <h4 className="font-bold text-green-600 mb-2 text-lg">මට්ටම 3</h4>
              <p className="text-gray-700 font-semibold">අකුරු සහ වචන</p>
              <p className="text-green-500 text-sm mt-1">(ප්‍රශ්න 4)</p>
            </div>
          </div>
        </div>

        {/* Ready message - more exciting */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center bg-gradient-to-r from-green-200 to-emerald-200 text-green-800 px-6 py-4 rounded-full text-lg font-bold shadow-lg border-4 border-green-300 animate-pulse">
            <Zap className="w-7 h-7 mr-2 text-yellow-500" />
            සූදානම්ද? අපි පටන් ගමු!
            <Rocket className="w-7 h-7 ml-2 text-orange-500" />
          </div>
        </div>

        {/* Start button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/vcAssessment')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-2xl font-bold py-6 px-12 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse"
          >
            ක්‍රීඩාව ආරම්භ කරන්න! 🎮
          </button>
        </div>

        {/* Tips section - more encouraging */}
        <div className="mt-6 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl p-5 border-4 border-pink-300 shadow-lg">
          <h3 className="text-lg md:text-xl font-bold text-pink-700 mb-3 flex items-center justify-center">
            <span className="mr-2 text-2xl">💡</span> 
            උපදෙස්:
            <span className="ml-2 text-2xl">💡</span>
          </h3>
          <ul className="space-y-2 text-gray-700 bg-white rounded-xl p-4">
            <li className="flex items-start hover:bg-pink-50 p-2 rounded-lg transition-colors">
              <span className="mr-2">🌸</span>
              <span className="font-semibold">පහසුවෙන් හුස්ම ගන්න, කලබල වෙන්න එපා</span>
            </li>
            <li className="flex items-start hover:bg-pink-50 p-2 rounded-lg transition-colors">
              <span className="mr-2">👀</span>
              <span className="font-semibold">රූපය හොඳින් බලන්න</span>
            </li>
            <li className="flex items-start hover:bg-pink-50 p-2 rounded-lg transition-colors">
              <span className="mr-2">✅</span>
              <span className="font-semibold">නිවැරදි උත්තරය තෝරන්න</span>
            </li>
            <li className="flex items-start hover:bg-pink-50 p-2 rounded-lg transition-colors">
              <span className="mr-2">🌟</span>
              <span className="font-semibold">ඔබට පුළුවන්! විශ්වාසය තබන්න!</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer decoration - more playful */}
      <div className="text-center mt-6">
        <div className="inline-block bg-white rounded-full px-8 py-3 shadow-lg border-4 border-purple-300">
          <p className="text-purple-700 text-lg md:text-xl font-bold flex items-center">
            <Heart className="w-6 h-6 text-red-500 mr-2 animate-pulse" />
            සතුටින් ඉගෙන ගන්න!
            <Heart className="w-6 h-6 text-red-500 ml-2 animate-pulse" />
          </p>
        </div>
      </div>

      {/* Additional floating stars */}
      <div className="fixed bottom-10 right-10 animate-bounce">
        <Sparkles className="w-8 h-8 text-purple-500 opacity-60" />
      </div>
    </div>
      </div>
    </div>
  );
};

export default VCDashboard;