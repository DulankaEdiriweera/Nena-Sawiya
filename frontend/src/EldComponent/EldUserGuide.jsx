import React from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";

const ELDUserGuide = () => {
  return (
    <div>
      <div>
        <Header />
      </div>
      <div
        className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 
                    flex justify-center items-start py-10 px-4"
      >
        <div className="max-w-4xl w-full bg-white shadow-xl rounded-2xl p-8">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-center text-blue-900 mb-6">
            ප්‍රකාශන භාෂා හැකියාව – පරිශීලක මාර්ගෝපදේශය
          </h1>

          {/* Section: Before You Start */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-orange-600 mb-3">
              ආරම්භ කිරීමට පෙර
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-gray-800">
              <li>
                <strong>වැඩිහිටි අධීක්ෂණය අවශ්‍ය වේ:</strong>
                මෙම තක්සේරුව ගුරුවරයෙකු, දෙමාපියෙකු හෝ වගකිවයුතු වැඩිහිටියෙකු
                සමඟ සිදු කළ යුතුය.
              </li>
              <li>
                <strong>නිස්කලංක පරිසරයක් තෝරන්න:</strong>
                අවම පසුබිම් ශබ්දයක් සහිත නිහඬ කාමරයක තක්සේරුව සිදු කරන්න.
              </li>
              <li>
                <strong>උපාංග සකස් කිරීම:</strong>
                ක්‍රියා කරන මයික්‍රෆෝනයක් සහිත උපාංගයක් භාවිතා කර ආරම්භ කිරීමට
                පෙර මයික්‍රෆෝනය පරීක්ෂා කරන්න.
              </li>
              <li>
                <strong>ළමයාගේ සූදානම:</strong>
                දරුවා සුවපහසු හා සන්සුන් බවට වග බලා ගන්න. පැහැදිලිව සහ ටිකක්
                හයියෙන් කතා කිරීමට දිරිමත් කරන්න.
              </li>
            </ul>
          </section>

          {/* Section: How to Do */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-orange-600 mb-3">
              කරන්නේ කෙසේද
            </h2>

            <ol className="list-decimal pl-6 space-y-2 text-gray-800">
              <li>
                දරුවා කතා කිරීමට පෙර <strong>“පටිගත කිරීම ආරම්භ කරන්න”</strong>{" "}
                ක්ලික් කරන්න.
              </li>
              <li>
                ලබා දී ඇති කතාව හෝ ප්‍රශ්නය පැහැදිලිව කියවන්න හෝ වාදනය කරන්න.
              </li>
              <li>දරුවාට තමන්ගේම වචනවලින් පිළිතුරු දීමට ඉඩ දෙන්න.</li>
              <li>කතා කරන අතරතුර දරුවාට බාධාව නොකරන්න.</li>
              <li>
                දරුවා අවසන් කළ පසු <strong>“පටිගත කිරීම නවත්වන්න”</strong>{" "}
                ක්ලික් කරන්න.
              </li>
              <li>
                <strong>“ඊළඟ”</strong> ක්ලික් කර ඊළඟ කතාවට යන්න.
              </li>
            </ol>
          </section>

          {/* Section: After Completion */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-orange-600 mb-3">
              සියලුම කාර්යයන් සම්පූර්ණ කිරීමෙන් පසු
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-gray-800">
              <li>
                සියලුම කාර්යයන් අවසන් කළ පසු
                <strong> “ඉදිරිපත් කරන්න”</strong> ක්ලික් කරන්න.
              </li>
              <li>
                ඉදිරිපත් කිරීමෙන් පසු ප්‍රතිඵල සහ ප්‍රතිපෝෂණය පෙන්වනු ලැබේ.
              </li>
              <li>
                මෙම ප්‍රතිපෝෂණය <strong>පරීක්ෂණ අරමුණු සඳහා පමණක්</strong> වේ.
              </li>
            </ul>
          </section>

          {/* Footer Note */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl text-sm text-blue-900">
            ⚠️ මෙය විභාගයක් නොව, දරුවාගේ භාෂා හැකියාවන් තේරුම් ගැනීම සඳහායි.
          </div>

          {/* Start Button */}
          <div className="mt-8 flex justify-center">
            <Link to="/story">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-xl transform hover:scale-110 transition-all border-4 border-purple-300 animate-pulse">
                ආරම්භ කරන්න
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ELDUserGuide;
