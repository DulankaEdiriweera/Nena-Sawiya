import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPuzzlePiece, FaImage, FaRegClone, FaListUl } from "react-icons/fa";
import AdminHeader from "../Components/AdminHeader";

export default function VCAdminDashboard() {
  const navigate = useNavigate();

  const activities = [
    {
      title: "Jigsaw Puzzle",
      subtitle: "Add & manage jigsaw tasks",
      icon: <FaPuzzlePiece size={40} />,
      actions: [
        { label: "Add", path: "/vcAdminAddJigsaw" },
        { label: "List", path: "/vcAdminJigsawList" },
      ],
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Picture Completion",
      subtitle: "Add & manage picture completion tasks",
      icon: <FaImage size={40} />,
      actions: [
        { label: "Add", path: "/admin/vcPicCom/add" },
        { label: "List", path: "/admin/vcPicCom/list" },
      ],
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Shadow / Silhouette Matching",
      subtitle: "Add & manage matching tasks",
      icon: <FaRegClone size={40} />,
      actions: [
        { label: "Add", path: "/admin/addShadowMatch" },
        { label: "List", path: "/admin/shadowMatchList" },
      ],
      color: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <div>
      <div><AdminHeader/></div>
          <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">
              Visual Closure - Admin Dashboard
            </h1>
            <p className="text-slate-600 mt-2">
              Manage Visual Closure intervention activities (Add / View lists).
            </p>
          </div>

          <button
            onClick={() => navigate("/admin-dashboard")}
            className="self-start md:self-auto bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl shadow-sm hover:shadow transition"
            title="Go to VC main dashboard"
          >
            Back Main Dashboard
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activities.map((a, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition"
            >
              <div className={`p-6 bg-gradient-to-r ${a.color} text-white`}>
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-2xl">{a.icon}</div>
                  <div>
                    <h2 className="text-xl font-bold">{a.title}</h2>
                    <p className="text-white/90 text-sm mt-1">{a.subtitle}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex gap-3">
                  {a.actions.map((btn, bIdx) => (
                    <button
                      key={bIdx}
                      onClick={() => navigate(btn.path)}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl hover:bg-slate-800 transition"
                    >
                      {btn.label === "Add" ? (
                        <FaImage size={16} />
                      ) : (
                        <FaListUl size={16} />
                      )}
                      <span className="font-semibold">{btn.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-4 text-xs text-slate-500 leading-relaxed">
                  Tip: Keep images clear and colorful for children. Use levels
                  (easy / medium / hard) consistently so filtering works.
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-10 text-center text-sm text-slate-500">
          Visual Closure • Admin Tools
        </div>
      </div>
    </div>
    </div>

  );
}