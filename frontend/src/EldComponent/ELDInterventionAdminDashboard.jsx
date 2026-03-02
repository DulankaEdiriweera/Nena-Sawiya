import React from "react";
import { useNavigate } from "react-router-dom";
import { FaImages, FaBookOpen, FaPuzzlePiece } from "react-icons/fa";
import AdminHeader from "../Components/AdminHeader";

const ELDInterventionAdminDashboard = () => {
  const navigate = useNavigate();

  const activities = [
    {
      title: "Story Cloze Activity",
      icon: <FaBookOpen size={40} />,
      path: "/storyClozeManage",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Picture Describing Activity",

      icon: <FaImages size={40} />,
      path: "/pictureMCQManage",
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Sequencing Activity",
      icon: <FaPuzzlePiece size={40} />,
      path: "/sequencingManage",
      color: "from-blue-500 to-indigo-600",
    },
  ];

  return (
    <div>
      <div>
        <AdminHeader />
      </div>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-10 text-gray-800">
          ELD Intervention Activities Admin Dashboard
        </h1>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {activities.map((activity, index) => (
            <div
              key={index}
              onClick={() => navigate(activity.path)}
              className={`cursor-pointer bg-gradient-to-r ${activity.color} text-white p-8 rounded-2xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl`}
            >
              <div className="flex flex-col items-center space-y-4">
                {activity.icon}
                <h2 className="text-xl font-semibold text-center">
                  {activity.title}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ELDInterventionAdminDashboard;
