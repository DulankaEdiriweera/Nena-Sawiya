import React from "react";
import { useNavigate } from "react-router-dom";
import { FaComments, FaHeadphones, FaEye, FaShapes } from "react-icons/fa";
import AdminHeader from "./AdminHeader";

const MainActivitiesAdminDashboard = () => {
  const navigate = useNavigate();

  const activities = [
    {
      title: "ප්‍රකාශන භාෂා කුසලතාව ඇගයීම",
      subtitle: "Expressive Language Disorder",
      icon: <FaComments size={40} />,
      path: "/eldAdminIntervention",
      color: "from-pink-500 to-rose-600",
    },
    {
      title: "ප්‍රතිග්‍රාහක භාෂා කුසලතාව ඇගයීම",
      subtitle: "Receptive Language Disorder",
      icon: <FaHeadphones size={40} />,
      path: "/rld-admin-dashboard",
      color: "from-purple-500 to-indigo-600",
    },
    {
      title: "දෘශ්‍ය විභේදන සහ මතක ඇගයීම",
      subtitle: "Visual Discrimination",
      icon: <FaEye size={40} />,
      path: "/visualAdminDashboard",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "දෘශ්‍ය සම්පූර්ණතා හැකියාව ඇගයීම",
      subtitle: "Visual Closure Deficits",
      icon: <FaShapes size={40} />,
      path: "/vcAdminDashboard",
      color: "from-yellow-500 to-orange-600",
    },
  ];

  return (
    <div>
      <div>
        <AdminHeader />
      </div>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-12 text-gray-800 text-center">
          Main Intervention Activities Admin Dashboard
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
          {activities.map((activity, index) => (
            <div
              key={index}
              onClick={() => navigate(activity.path)}
              className={`cursor-pointer bg-gradient-to-r ${activity.color} text-white p-8 rounded-2xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl`}
            >
              <div className="flex flex-col items-center space-y-4 text-center">
                {activity.icon}

                <h2 className="text-lg font-semibold">{activity.title}</h2>

                <p className="text-sm opacity-90">{activity.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainActivitiesAdminDashboard;
