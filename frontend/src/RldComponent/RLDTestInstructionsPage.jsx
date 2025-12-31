import React, { useState } from 'react';
import { BookOpen, Mic, Video, Volume2, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import RLDTest from '../RldComponent/RLDTest';
import Header from '../Components/Header';

const RLDTestInstructionsPage = () => {
  const [showTest, setShowTest] = useState(false);

  if (showTest) {
    return <RLDTest />;
  }

  const handleStart = () => {
    setShowTest(true);
  };

  return (
    <><Header /><div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl animate-bounce opacity-30">🎈</div>
        <div className="absolute top-20 right-20 text-5xl animate-pulse opacity-30">⭐</div>
        <div className="absolute bottom-20 left-20 text-6xl animate-bounce opacity-30 animation-delay-1000">🌈</div>
        <div className="absolute bottom-10 right-10 text-5xl animate-pulse opacity-30 animation-delay-2000">🎨</div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto relative z-10 border-8 border-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white px-8 py-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <BookOpen className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl font-extrabold">ප්‍රතිග්‍රාහක භාෂා සංවර්ධන පරීක්ෂණය</h1>
          </div>
          <p className="text-lg md:text-xl font-semibold">Receptive Language Development Test</p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-6 border-4 border-yellow-300">
            <h2 className="text-2xl font-bold text-purple-700 mb-3 flex items-center gap-2">
              <span className="text-3xl">👋</span> සාදරයෙන් පිළිගනිමු!
            </h2>
            <p className="text-lg text-gray-700">
              මෙම පරීක්ෂණය ඔබේ දරුවාගේ ප්‍රතිග්‍රාහක භාෂා සංවර්ධනය තක්සේරු කිරීම සඳහා නිර්මාණය කර ඇත. දරුවාට වීඩියෝ, පින්තූර සහ ප්‍රශ්න පෙන්වනු ලබන අතර ඔවුන්ගේ ප්‍රතිචාර පටිගත කරනු ලැබේ.
            </p>
          </div>

          {/* Important Notes */}
          <div className="bg-red-50 rounded-2xl p-6 mb-6 border-4 border-red-300">
            <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              වැදගත් සටහන්
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>මාපියන්/භාරකරුවන් දරුවා සමඟ සිටින්න</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>නිශ්ශබ්ද පරිසරයක පරීක්ෂණය සිදු කරන්න</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>මයික්‍රෆෝන් ප්‍රවේශය ඉඩ දෙන්න</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>දරුවාට උදව් නොකර ස්වාධීනව පිළිතුරු දීමට ඉඩ දෙන්න</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span className="font-semibold">සෑම ප්‍රශ්නයකටම පිළිතුරු දීම අනිවාර්ය වේ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>දරුවා පිළිතුර නොදන්නේ නම් "දන්නෑ" යැයි කීමට ඉඩ දෙන්න</span>
              </li>
            </ul>
          </div>

          {/* How it Works */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
              <span className="text-3xl">📋</span> මෙය ක්‍රියා කරන ආකාරය
            </h3>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="bg-blue-50 rounded-xl p-5 border-3 border-blue-300">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-lg text-blue-700 mb-2 flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      වීඩියෝ/පින්තූර නරඹන්න
                    </h4>
                    <p className="text-gray-700">දරුවාට වීඩියෝ හෝ පින්තූර පෙන්වනු ලැබේ. වීඩියෝව අවසන් වන තෙක් බලන්න.</p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-green-50 rounded-xl p-5 border-3 border-green-300">
                <div className="flex items-start gap-4">
                  <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-lg text-green-700 mb-2 flex items-center gap-2">
                      <Volume2 className="w-5 h-5" />
                      ප්‍රශ්නය අසන්න
                    </h4>
                    <p className="text-gray-700">ස්පීකර් බොත්තම ක්ලික් කර ප්‍රශ්නය දරුවාට ශබ්දයෙන් අසන්න.</p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-purple-50 rounded-xl p-5 border-3 border-purple-300">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-lg text-purple-700 mb-2 flex items-center gap-2">
                      <Mic className="w-5 h-5" />
                      පිළිතුර පටිගත කරන්න
                    </h4>
                    <p className="text-gray-700">මයික්‍රෆෝන් බොත්තම ක්ලික් කර දරුවාගේ පිළිතුර පටිගත කරන්න. පටිගත කිරීම ස්වයංක්‍රීයව නතර වේ.</p>
                    <p className="text-gray-600 text-sm mt-2 italic">💡 දරුවා පිළිතුර නොදන්නේ නම්, "දන්නෑ" යැයි කීමට ඉඩ දෙන්න.</p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-pink-50 rounded-xl p-5 border-3 border-pink-300">
                <div className="flex items-start gap-4">
                  <div className="bg-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-bold text-lg text-pink-700 mb-2 flex items-center gap-2">
                      <ChevronRight className="w-5 h-5" />
                      ඊළඟ ප්‍රශ්නයට යන්න
                    </h4>
                    <p className="text-gray-700">"මීළඟ" බොත්තම ක්ලික් කර ඊළඟ ප්‍රශ්නයට යන්න. සියලු ප්‍රශ්න අවසන් වූ පසු ඉදිරිපත් කරන්න.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Answer Guidelines */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 mb-6 border-4 border-teal-300">
            <h3 className="text-xl font-bold text-teal-700 mb-3 flex items-center gap-2">
              <span className="text-2xl">💬</span> පිළිතුරු ගැන මාර්ගෝපදේශ
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-teal-500 font-bold">✓</span>
                <span>සෑම ප්‍රශ්නයකටම දරුවා පිළිතුරු දිය යුතුය</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 font-bold">✓</span>
                <span>පිළිතුර නොදන්නේ නම්, දරුවාට "දන්නෑ" යැයි කීමට අවසර දෙන්න</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 font-bold">✓</span>
                <span>දරුවාගේ ස්වාභාවික ප්‍රතිචාරය පටිගත කරන්න</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 font-bold">✓</span>
                <span>පිළිතුර වැරදි බව පෙනුනත් නිවැරදි නොකරන්න</span>
              </li>
            </ul>
          </div>

          {/* Answer Guidelines */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 mb-6 border-4 border-teal-300">
            <h3 className="text-xl font-bold text-teal-700 mb-3 flex items-center gap-2">
              <span className="text-2xl">💬</span> පිළිතුරු ගැන මාර්ගෝපදේශ
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-teal-500 font-bold">✓</span>
                <span>සෑම ප්‍රශ්නයකටම දරුවා පිළිතුරු දිය යුතුය</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 font-bold">✓</span>
                <span>පිළිතුර නොදන්නේ නම්, දරුවාට "දන්නෑ" යැයි කීමට අවසර දෙන්න</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 font-bold">✓</span>
                <span>දරුවාගේ ස්වාභාවික ප්‍රතිචාරය පටිගත කරන්න</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 font-bold">✓</span>
                <span>පිළිතුර වැරදි බව පෙනුනත් නිවැරදි නොකරන්න</span>
              </li>
            </ul>
          </div>

          {/* Technical Requirements */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6 border-3 border-gray-300">
            <h3 className="text-xl font-bold text-gray-700 mb-3">තාක්ෂණික අවශ්‍යතා</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>ක්‍රියාකාරී මයික්‍රෆෝනය සහිත උපාංගයක්</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>ස්ථාවර අන්තර්ජාල සම්බන්ධතාවයක්</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Chrome හෝ Edge බ්‍රව්සරය (දේශන අනුහුරු සඳහා)</span>
              </li>
            </ul>
          </div>

          {/* Duration */}
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-6 mb-6 border-4 border-indigo-300 text-center">
            <p className="text-lg font-semibold text-gray-700">
              ⏱️ ආසන්න කාලය: <span className="text-2xl font-bold text-purple-700">15-20 විනාඩි</span>
            </p>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white py-5 rounded-2xl text-2xl font-extrabold shadow-lg hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 transition-all hover:scale-105 border-4 border-purple-400 flex items-center justify-center gap-3"
          >
            පරීක්ෂණය ආරම්භ කරන්න
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Footer Note */}
          <p className="text-center text-gray-500 text-sm mt-6">
            ඔබට ප්‍රශ්න තිබේ නම්, කරුණාකර පරිපාලකයා සම්බන්ධ කර ගන්න
          </p>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .border-3 { border-width: 3px; }
      `}</style>
    </div></>
    
  );
};

export default RLDTestInstructionsPage;