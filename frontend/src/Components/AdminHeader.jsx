import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Assets/Logo.png";

const AdminHeader = () => {
  const navigate = useNavigate();

  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-xl border-b-4 border-blue-900 relative z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center py-3">
          {/* Logo + Title */}
          <div className="flex items-center space-x-5">
            <img
              src={Logo}
              alt="Logo"
              className="w-20 h-20 object-contain hover:scale-105 transition-transform"
            />

            <div>
              <h1
                className="text-2xl sm:text-3xl font-extrabold text-[#0A1F44]"
                style={{
                  textShadow: `
                    1px 1px 0 #cbd5e1,
                    2px 2px 0 #b6c3d6,
                    4px 4px 8px rgba(0, 0, 0, 0.3)
                  `,
                }}
              >
                නැණ සවිය
              </h1>

              <p className="text-sm text-gray-600 font-semibold">
                Admin Control Panel
              </p>
            </div>
          </div>

          {/* Admin Info */}
          <div className="flex items-center space-x-5">
            <div className="text-right">
              <p className="text-sm text-gray-500">Logged in as</p>
              <p className="text-lg font-bold text-[#0A1F44]">
                👤 {name} ({role})
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold shadow-md hover:shadow-lg transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
