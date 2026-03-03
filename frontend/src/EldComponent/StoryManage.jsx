import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../Components/AdminHeader";
import Swal from "sweetalert2";

const StoryManage = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [editStory, setEditStory] = useState(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/story_bp/all");
      setStories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This story will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/story_bp/delete/${id}`);

          fetchStories();

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Story has been deleted successfully.",
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

  const openEditModal = (story) => {
    setEditStory({
      ...story,
      videoFile: null,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditStory({ ...editStory, [name]: value });
  };

  const handleBlankChange = (value, index) => {
    const newBlanks = [...editStory.blanks_answers];
    newBlanks[index] = value;
    setEditStory({ ...editStory, blanks_answers: newBlanks });
  };

  const handleOptionChange = (value, index) => {
    const newOptions = [...editStory.options];
    newOptions[index] = value;
    setEditStory({ ...editStory, options: newOptions });
  };

  const handleAddBlank = () => {
    setEditStory({
      ...editStory,
      blanks_answers: [...editStory.blanks_answers, ""],
    });
  };

  const handleAddOption = () => {
    setEditStory({ ...editStory, options: [...editStory.options, ""] });
  };

  const handleVideoChange = (e) => {
    setEditStory({ ...editStory, videoFile: e.target.files[0] });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Update Story?",
      text: "Are you sure you want to save these changes?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Update",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const formData = new FormData();
          formData.append("title", editStory.title);
          formData.append("text_with_blanks", editStory.text_with_blanks);
          formData.append("task_number", editStory.task_number);

          editStory.blanks_answers.forEach((b) =>
            formData.append("blanks_answers[]", b),
          );

          editStory.options.forEach((o) => formData.append("options[]", o));

          if (editStory.videoFile)
            formData.append("video", editStory.videoFile);

          await axios.put(
            `http://localhost:5000/api/story_bp/update/${editStory._id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
          );

          Swal.fire({
            icon: "success",
            title: "Updated!",
            text: "Story updated successfully.",
            confirmButtonColor: "#16A34A",
          });

          setEditStory(null);
          fetchStories();
        } catch (err) {
          console.error(err);

          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: "Something went wrong while updating.",
            confirmButtonColor: "#DC2626",
          });
        }
      }
    });
  };

  return (
    <div>
      <div>
        <AdminHeader />
      </div>
      <div className="p-6 bg-white min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Story Completion Task Management
        </h2>
        <button
          onClick={() => navigate("/addStoryCloze")} // navigate to the add page
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
                    Title
                  </th>
                  <th className="p-4 text-left border-r border-indigo-400">
                    Task No
                  </th>
                  <th className="p-4 text-left border-r border-indigo-400">
                    Text
                  </th>
                  <th className="p-4 text-left border-r border-indigo-400">
                    Blanks
                  </th>
                  <th className="p-4 text-left border-r border-indigo-400">
                    Options
                  </th>
                  <th className="p-4 text-left border-r border-indigo-400">
                    Video
                  </th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {stories.map((story) => (
                  <tr
                    key={story._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-4 border-r border-gray-200">
                      {story.title}
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      {story.task_number}
                    </td>
                    <td className="p-4 border-r border-gray-200 max-w-xs">
                      {story.text_with_blanks}
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      {story.blanks_answers?.map((b, i) => (
                        <div key={i}>• {b}</div>
                      ))}
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      {story.options?.map((o, i) => (
                        <div key={i}>• {o}</div>
                      ))}
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      <video
                        src={`http://localhost:5000${story.video_url}`}
                        width="140"
                        controls
                        className="rounded-lg shadow-md"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => openEditModal(story)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl shadow"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(story._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* EDIT MODAL */}
        {editStory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-12 z-50">
            <div className="bg-white p-6 rounded-2xl w-full max-w-4xl shadow-xl overflow-y-auto max-h-[90vh]">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                Edit Story
              </h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={editStory.title}
                  onChange={handleEditChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  placeholder="Title"
                  required
                />

                <textarea
                  name="text_with_blanks"
                  value={editStory.text_with_blanks}
                  onChange={handleEditChange}
                  rows={4}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  placeholder="Text with blanks"
                  required
                />

                {/* Blanks */}
                <div>
                  <label className="font-medium text-gray-700 mb-1 block">
                    Blank Answers
                  </label>
                  {editStory.blanks_answers.map((b, i) => (
                    <input
                      key={i}
                      type="text"
                      value={b}
                      onChange={(e) => handleBlankChange(e.target.value, i)}
                      className="w-full p-2 border rounded mb-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                      required
                    />
                  ))}
                  <button
                    type="button"
                    onClick={handleAddBlank}
                    className="text-indigo-600 text-sm hover:underline mt-1"
                  >
                    + Add Blank
                  </button>
                </div>

                {/* Options */}
                <div>
                  <label className="font-medium text-gray-700 mb-1 block">
                    Options
                  </label>
                  {editStory.options.map((o, i) => (
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
                  type="number"
                  name="task_number"
                  value={editStory.task_number}
                  onChange={handleEditChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  placeholder="Task Number"
                  required
                />

                <div>
                  <label className="font-medium text-gray-700 mb-1 block">
                    Video Upload
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                  {editStory.video_url && (
                    <video
                      src={`http://localhost:5000${editStory.video_url}`}
                      width="200"
                      controls
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
                    onClick={() => setEditStory(null)}
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

export default StoryManage;
