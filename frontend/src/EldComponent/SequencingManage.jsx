import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/sequencing_bp/delete/${id}`,
        );
        fetchActivities();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-300 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Sequencing Activities Management
      </h2>
      <button
        onClick={() => navigate("/addSequencingTask")} // navigate to the add page
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow mb-5"
      >
        Add Activity
      </button>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-2xl rounded-lg overflow-hidden">
          <thead className="bg-indigo-400 text-white">
            <tr>
              <th className="p-3 text-left">Level</th>
              <th className="p-3 text-left">Task No</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Correct Order</th>
              <th className="p-3 text-left">Images</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((act) => (
              <tr
                key={act._id}
                className="border-b hover:bg-gray-50 transition duration-200"
              >
                <td className="p-3">{act.level}</td>
                <td className="p-3">{act.task_number}</td>
                <td className="p-3 max-w-xs truncate">{act.title}</td>
                <td className="p-3">{act.correct_order?.join(", ")}</td>
                <td className="p-3 flex flex-wrap gap-2">
                  {act.images?.map((img) => (
                    <img
                      key={img.id}
                      src={`http://localhost:5000${img.url}`}
                      alt="activity"
                      width="80"
                      className="rounded shadow"
                    />
                  ))}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(act._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
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
  );
};

export default SequencingManage;
