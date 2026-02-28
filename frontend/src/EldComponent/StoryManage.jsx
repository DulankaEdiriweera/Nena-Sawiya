import React, { useEffect, useState } from "react";
import axios from "axios";

const StoryManage = () => {
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
    if (window.confirm("Are you sure you want to delete this story?")) {
      try {
        await axios.delete(`http://localhost:5000/api/story_bp/delete/${id}`);
        fetchStories();
      } catch (err) {
        console.error(err);
      }
    }
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
    setEditStory({ ...editStory, blanks_answers: [...editStory.blanks_answers, ""] });
  };

  const handleAddOption = () => {
    setEditStory({ ...editStory, options: [...editStory.options, ""] });
  };

  const handleVideoChange = (e) => {
    setEditStory({ ...editStory, videoFile: e.target.files[0] });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", editStory.title);
      formData.append("text_with_blanks", editStory.text_with_blanks);
      formData.append("task_number", editStory.task_number);
      editStory.blanks_answers.forEach((b) => formData.append("blanks_answers[]", b));
      editStory.options.forEach((o) => formData.append("options[]", o));
      if (editStory.videoFile) formData.append("video", editStory.videoFile);

      await axios.put(
        `http://localhost:5000/api/story_bp/update/${editStory._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setEditStory(null);
      fetchStories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-300 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Story Completion Task Management</h2>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-2xl rounded-lg overflow-hidden">
          <thead className="bg-indigo-400 text-white">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Task No</th>
              <th className="p-3 text-left">Text</th>
              <th className="p-3 text-left">Blanks</th>
              <th className="p-3 text-left">Options</th>
              <th className="p-3 text-left">Video</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stories.map((story) => (
              <tr
                key={story._id}
                className="border-b hover:bg-gray-50 transition duration-200"
              >
                <td className="p-3">{story.title}</td>
                <td className="p-3">{story.task_number}</td>
                <td className="p-3 max-w-xs truncate">{story.text_with_blanks}</td>
                <td className="p-3">
                  {story.blanks_answers?.map((b, i) => (
                    <div key={i}>• {b}</div>
                  ))}
                </td>
                <td className="p-3">
                  {story.options?.map((o, i) => (
                    <div key={i}>• {o}</div>
                  ))}
                </td>
                <td className="p-3">
                  <video src={`http://localhost:5000${story.video_url}`} width="140" controls className="rounded-lg shadow-md" />
                </td>
                <td className="p-3 space-x-2 flex flex-col sm:flex-row">
                  <button
                    onClick={() => openEditModal(story)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(story._id)}
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
      {editStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-12 z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-4xl shadow-xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Edit Story</h3>
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
                <label className="font-medium text-gray-700 mb-1 block">Blank Answers</label>
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
                <label className="font-medium text-gray-700 mb-1 block">Options</label>
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
                <label className="font-medium text-gray-700 mb-1 block">Video Upload</label>
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
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow font-semibold w-full sm:w-auto">
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
  );
};

export default StoryManage;