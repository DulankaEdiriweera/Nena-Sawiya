import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../Components/AdminHeader";
import Swal from "sweetalert2";

const SequencingManage = () => {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/sequencing_bp/all",
      );
      setActivities(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This activity will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `http://localhost:5000/api/sequencing_bp/delete/${id}`,
          );

          fetchActivities();

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Activity deleted successfully.",
            confirmButtonColor: "#16A34A",
          });
        } catch (err) {
          console.error(err);

          Swal.fire({
            icon: "error",
            title: "Delete Failed",
            text: "Something went wrong while deleting.",
            confirmButtonColor: "#DC2626",
          });
        }
      }
    });
  };

  return (
    <div>
      <AdminHeader />

      <div className="p-6 bg-white min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Sequencing Activities Management
        </h2>

        <button
          onClick={() => navigate("/addSequencingTask")}
          className="bg-indigo-400 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg shadow mb-5"
        >
          Add Activity
        </button>

        <div className="overflow-x-auto">
          <div className="border border-gray-300 rounded-2xl shadow-xl overflow-hidden">
            <table className="w-full bg-white">
              <thead className="bg-indigo-500 text-white border-b-2 border-indigo-600">
                <tr>
                  <th className="p-4 text-left border-r border-indigo-400">
                    Level
                  </th>
                  <th className="p-4 text-left border-r border-indigo-400">
                    Task No
                  </th>
                  <th className="p-4 text-left border-r border-indigo-400">
                    Title
                  </th>
                  <th className="p-4 text-left border-r border-indigo-400">
                    Correct Order
                  </th>
                  <th className="p-4 text-left border-r border-indigo-400">
                    Images
                  </th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {activities.map((act) => (
                  <tr
                    key={act._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-4 border-r border-gray-200">
                      {act.level}
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      {act.task_number}
                    </td>
                    <td className="p-4 border-r border-gray-200 max-w-xs truncate">
                      {act.title}
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      {act.correct_order?.join(", ")}
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {act.images?.map((img) => (
                          <img
                            key={img.id}
                            src={`http://localhost:5000${img.url}`}
                            alt="activity"
                            width="80"
                            className="rounded-lg shadow-md"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDelete(act._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequencingManage;
