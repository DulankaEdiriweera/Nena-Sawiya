import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../Components/AdminHeader";
import Swal from "sweetalert2";

const PictureMCQManage = () => {
  const navigate = useNavigate();
  const [mcqs, setMcqs] = useState([]);
  const [editMCQ, setEditMCQ] = useState(null);

  useEffect(() => {
    fetchMCQs();
  }, []);

  const fetchMCQs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/picture_mcq/all");
      setMcqs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This MCQ will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `http://localhost:5000/api/picture_mcq/delete/${id}`,
          );

          fetchMCQs(); // Refresh the MCQ list

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "MCQ has been deleted successfully.",
            confirmButtonColor: "#16A34A",
          });
        } catch (err) {
          console.error(err);

          Swal.fire({
            icon: "error",
            title: "Delete Failed",
            text: "Something went wrong while deleting the MCQ.",
            confirmButtonColor: "#DC2626",
          });
        }
      }
    });
  };

  const openEditModal = (mcq) => {
    setEditMCQ({
      ...mcq,
      imageFile: null, // for new image upload
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditMCQ({ ...editMCQ, [name]: value });
  };

  const handleOptionChange = (value, index) => {
    const newOptions = [...editMCQ.options];
    newOptions[index] = value;
    setEditMCQ({ ...editMCQ, options: newOptions });
  };

  const handleAddOption = () => {
    setEditMCQ({ ...editMCQ, options: [...editMCQ.options, ""] });
  };

  const handleImageChange = (e) => {
    setEditMCQ({ ...editMCQ, imageFile: e.target.files[0] });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("level", editMCQ.level);
      formData.append("question", editMCQ.question);
      formData.append("task_number", editMCQ.task_number);
      formData.append("correct_answer", editMCQ.correct_answer);
      editMCQ.options.forEach((o) => formData.append("options", o));
      if (editMCQ.imageFile) formData.append("image", editMCQ.imageFile);

      await axios.put(
        `http://localhost:5000/api/picture_mcq/update/${editMCQ._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      setEditMCQ(null);
      fetchMCQs();

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "MCQ has been updated successfully.",
        confirmButtonColor: "#16A34A",
      });
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong while updating the MCQ.",
        confirmButtonColor: "#DC2626",
      });
    }
  };

  return (
    <div>
      <div>
        <AdminHeader />
      </div>
      <div className="p-6 bg-white min-h-screen">
        {/* Back Icon + Title Row */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/eldAdminIntervention")}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 hover:scale-110 transition-transform shadow-sm"
          >
            ←
          </button>

          <h2 className="text-3xl font-bold text-gray-800">
           Picture Describing Task Management
          </h2>
        </div>

        <button
          onClick={() => navigate("/addPictureMCQ")} // navigate to the add page
          className="bg-indigo-400 hover:bg-indigo-600 text-white px-6 py-2 rounded shadow mb-5"
        >
          Add Activity
        </button>

        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-2xl rounded-lg overflow-hidden">
            <thead className="bg-indigo-400 text-white">
              <tr>
                <th className="p-3 text-left">Level</th>
                <th className="p-3 text-left">Task No</th>
                <th className="p-3 text-left">Question</th>
                <th className="p-3 text-left">Options</th>
                <th className="p-3 text-left">Correct Answer</th>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mcqs.map((mcq) => (
                <tr
                  key={mcq._id}
                  className="border-b hover:bg-gray-50 transition duration-200"
                >
                  <td className="p-3">{mcq.level}</td>
                  <td className="p-3">{mcq.task_number}</td>
                  <td className="p-3 max-w-xs truncate">{mcq.question}</td>
                  <td className="p-3">
                    {mcq.options?.map((o, i) => (
                      <div key={i}>• {o}</div>
                    ))}
                  </td>
                  <td className="p-3">{mcq.correct_answer}</td>
                  <td className="p-3">
                    <img
                      src={`http://localhost:5000${mcq.image_url}`}
                      alt="MCQ"
                      width="120"
                      className="rounded-lg shadow-md"
                    />
                  </td>
                  <td className="p-3 space-x-2 flex flex-col sm:flex-row">
                    <button
                      onClick={() => openEditModal(mcq)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl shadow"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(mcq._id)}
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

        {/* EDIT MODAL */}
        {editMCQ && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-12 z-50">
            <div className="bg-white p-6 rounded-2xl w-full max-w-3xl shadow-xl overflow-y-auto max-h-[90vh]">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                Edit Picture MCQ
              </h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <input
                  type="text"
                  name="level"
                  value={editMCQ.level}
                  onChange={handleEditChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  placeholder="Level (EASY, MEDIUM, HARD)"
                  required
                />

                <input
                  type="text"
                  name="question"
                  value={editMCQ.question}
                  onChange={handleEditChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  placeholder="Question"
                  required
                />

                {/* Options */}
                <div>
                  <label className="font-medium text-gray-700 mb-1 block">
                    Options
                  </label>
                  {editMCQ.options.map((o, i) => (
                    <input
                      key={i}
                      type="text"
                      value={o}
                      onChange={(e) => handleOptionChange(e.target.value, i)}
                      className="w-full p-2 border rounded mb-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                      required
                    />
                  ))}
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="text-indigo-600 text-sm hover:underline mt-1"
                  >
                    + Add Option
                  </button>
                </div>

                <input
                  type="text"
                  name="correct_answer"
                  value={editMCQ.correct_answer}
                  onChange={handleEditChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  placeholder="Correct Answer"
                  required
                />

                <input
                  type="number"
                  name="task_number"
                  value={editMCQ.task_number}
                  onChange={handleEditChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  placeholder="Task Number"
                  required
                />

                <div>
                  <label className="font-medium text-gray-700 mb-1 block">
                    Image Upload
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                  {editMCQ.image_url && (
                    <img
                      src={`http://localhost:5000${editMCQ.image_url}`}
                      alt="MCQ"
                      width="150"
                      className="mt-2 rounded shadow"
                    />
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow font-semibold w-full sm:w-auto"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMCQ(null)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg shadow w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PictureMCQManage;
