import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Assets/Logo.png";

const Header = () => {
  const navigate = useNavigate();

  // Check if user is logged in
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-xl relative overflow-hidden z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="flex justify-between items-center py-2">
          {/* Logo and Title */}
          <div className="flex items-center space-x-6 flex-1">
            {/* Logo */}
            <div>
              <Link to="/" className="cursor-pointer">
                <img
                  src={Logo}
                  alt="Nena Sawiya Logo"
                  className="w-24 h-24 object-contain hover:scale-105 transition-transform"
                />
              </Link>
            </div>

            {/* Project Name */}
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide text-[#0A1F44]"
              style={{
                textShadow: `
                  1px 1px 0 #cbd5e1,
                  2px 2px 0 #b6c3d6,
                  3px 3px 0 #a1b1cd,
                  4px 4px 0 #8fa1c4,
                  6px 6px 12px rgba(0, 0, 0, 0.35)
                `,
              }}
            >
              නැණ සවිය
            </h1>
          </div>

          {/* Buttons / User Info */}
          <div className="flex items-center space-x-4 ml-6">
            {!token ? (
              <>
                <Link
                  to="/login"
                  className="px-6 py-3 text-base font-bold text-[#0A1F44] hover:bg-blue-50 rounded-full transition-all border-2 border-[#0A1F44] shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  ඇතුල් වන්න
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 text-base font-bold bg-[#0A1F44] text-white hover:bg-[#081a38] rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  ලියාපදිංචි වන්න
                </Link>
              </>
            ) : (
              <>
                <span className="text-[#0A1F44] font-bold text-lg">
                  👋 {name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-full font-bold transition-all shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;