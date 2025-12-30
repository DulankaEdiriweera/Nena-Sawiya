import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import Logo from "../Assets/Logo.png";

const Header = () => {
  return (
    <header className="bg-white shadow-xl relative overflow-hidden z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="flex justify-between items-center py-2">
          {/* Logo and Title */}
          <div className="flex items-center space-x-6 flex-1">
            {/* Logo */}
            <div>
              <img
                src={Logo}
                alt="Nena Sawiya Logo"
                className="w-24 h-24 object-contain"
              />
            </div>

            {/* Project Name */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0A1F44] tracking-wide drop-shadow-md">
              නැණ සවිය
            </h1>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-4 ml-6">
            <button className="px-6 py-3 text-base font-bold text-[#0A1F44] hover:bg-blue-50 rounded-full transition-all border-2 border-[#0A1F44] shadow-md hover:shadow-lg transform hover:scale-105">
              ඇතුල් වන්න
            </button>
            <button className="px-6 py-3 text-base font-bold bg-[#0A1F44] text-white hover:bg-[#081a38] rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
              ලියාපදිංචි වන්න
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
