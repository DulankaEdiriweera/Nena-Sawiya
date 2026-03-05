import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPuzzlePiece, FaBookOpen, FaImages, FaBrain } from "react-icons/fa";
import AdminHeader from "../../Components/AdminHeader";


const activities = [
  {
    title: "Drag and Drop Activity",
    description: "Manage drag and drop tasks for learners",
    path: "/AdminVdDragmanage",
    accent: "from-indigo-500 to-indigo-600",
    light: "bg-indigo-50",
    text: "text-indigo-600",
    icon: <FaPuzzlePiece size={22} />,
  },
  {
    title: "Spot the Difference Activity",
    description: "Create spot the difference challenges",
    path: "/AdminManageVdPictureMCQ1",
    accent: "from-emerald-500 to-emerald-600",
    light: "bg-emerald-50",
    text: "text-emerald-600",
    icon: <FaBookOpen size={22} />,
  },
  {
    title: "Object Counting Challenge",
    description: "Manage object counting activities",
    path: "/AdminManageCountImageGames1",
    accent: "from-amber-500 to-amber-600",
    light: "bg-amber-50",
    text: "text-amber-600",
    icon: <FaImages size={22} />,
  },
  {
    title: "Memory Activity",
    description: "Visual memory and recall exercises",
    path: "/AdminViewMemoryGames1",
    accent: "from-pink-500 to-pink-600",
    light: "bg-pink-50",
    text: "text-pink-600",
    icon: <FaBrain size={22} />,
  },
];

export default function VDAdminDashboard() {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(null);

  const handleNav = (path, index) => {
    setClicked(index);
    setTimeout(() => {
      setClicked(null);
      navigate(path);
    }, 150);
  };

  return (
    <div>
      <div><AdminHeader/></div>
      <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Blur Effects */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-100 rounded-full blur-3xl opacity-50" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            VD
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
              Admin Dashboard
            </p>
            <h1 className="text-2xl font-bold text-gray-800">
              Visual Discrimination & Memory Activity
            </h1>
          </div>
        </div>

        {/* Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Activity Modules
          </h2>
          <span className="px-3 py-1 text-xs font-semibold bg-gray-200 text-gray-600 rounded-full">
            {activities.length} Active
          </span>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((act, i) => (
            <div
              key={i}
              onClick={() => handleNav(act.path, i)}
              className={`group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-200 ${
                clicked === i ? "scale-95" : "hover:-translate-y-2"
              }`}
            >
              {/* Top Gradient Strip */}
              <div
                className={`h-2 w-full rounded-t-2xl bg-gradient-to-r ${act.accent}`}
              />

              <div className="p-6 flex flex-col gap-4">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${act.light} ${act.text} group-hover:scale-110 transition`}
                >
                  {act.icon}
                </div>

                {/* Text */}
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">
                    {act.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {act.description}
                  </p>
                </div>

                {/* Button */}
                <div
                  className={`mt-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all w-fit ${
                    act.light
                  } ${act.text} group-hover:bg-gradient-to-r ${
                    act.accent
                  } group-hover:text-white`}
                >
                  Manage →
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-xs text-gray-400">
          VD · Visual Discrimination & Memory Activity · 2025
        </div>
      </div>
    </div>

    </div>
    
  );
}