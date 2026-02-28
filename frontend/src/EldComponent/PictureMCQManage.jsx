import React, { useEffect, useState } from "react";
import axios from "axios";

const PictureMCQManage = () => {
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
    if (window.confirm("Are you sure you want to delete this MCQ?")) {
      try {
        await axios.delete(`http://localhost:5000/api/picture_mcq/delete/${id}`);
        fetchMCQs();
      } catch (err) {
        console.error(err);
      }
    }
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
      editMCQ.options.forEach((o) => formData.append("options[]", o));
      if (editMCQ.imageFile) formData.append("image", editMCQ.imageFile);

      await axios.put(
        `http://localhost:5000/api/picture_mcq/update/${editMCQ._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setEditMCQ(null);
      fetchMCQs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-300 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Picture MCQ Management</h2>

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
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(mcq._id)}
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

      {/* EDIT MODAL */}
      {editMCQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-12 z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-3xl shadow-xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Edit Picture MCQ</h3>
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
                <label className="font-medium text-gray-700 mb-1 block">Options</label>
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
                <label className="font-medium text-gray-700 mb-1 block">Image Upload</label>
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
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow font-semibold w-full sm:w-auto">
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
  );
};

export default PictureMCQManage;