import React, { useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../Components/AdminHeader";

export default function AdminAddVCJigsaw() {
  const apiBase = "http://localhost:5000";
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [title, setTitle] = useState("");
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(4);
  const [taskNumber, setTaskNumber] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [level, setLevel] = useState("easy");
  const [submitting, setSubmitting] = useState(false);

  const levelToBackend = (lvl) => {
    if (lvl === "easy") return "Weak";
    if (lvl === "medium") return "Average";
    return "High";
  };

  const onPickImage = (file) => {
    setImage(file || null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  };

  const resetForm = () => {
    setTitle("");
    setRows(3);
    setCols(4);
    setTaskNumber("");
    setLevel("easy");
    setImage(null);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");

    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      Swal.fire({
        icon: "warning",
        title: "Please upload an image",
      });
      return;
    }

    if (!taskNumber) {
      Swal.fire({
        icon: "warning",
        title: "Task number is required",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title || "VC Jigsaw Puzzle");
    formData.append("rows", String(rows));
    formData.append("cols", String(cols));
    formData.append("task_number", String(taskNumber));
    formData.append("levels[]", level);
    formData.append("ability_levels[]", levelToBackend(level));
    formData.append("image", image);

    try {
      setSubmitting(true);

      await axios.post(`${apiBase}/api/vc_jigsaw/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await Swal.fire({
        icon: "success",
        title: "Added successfully ✅",
        confirmButtonColor: "#0f172a",
      });

      resetForm();
      navigate("/vcAdminJigsawList");
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Error adding VC jigsaw.";

      Swal.fire({
        icon: "error",
        title: "Failed to add VC Jigsaw",
        text: msg,
        confirmButtonColor: "#0f172a",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />

      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Dashboard button OUTSIDE the form/card */}
        <div className="flex justify-end mb-3">
          <button
            type="button"
            onClick={() => navigate("/vcAdminDashboard")}
            className="rounded-xl bg-blue-500 text-white px-4 py-1.5 text-sm font-semibold shadow hover:bg-blue-600 transition"
          >
            ← Dashboard
          </button>
        </div>

        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Admin - Add VC Jigsaw</h2>
            <span className="text-xs text-slate-500">
              Level: <b>{level}</b>
            </span>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                    placeholder="e.g., Princess Puzzle"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Rows</label>
                    <input
                      type="number"
                      min={2}
                      max={8}
                      value={rows}
                      onChange={(e) => setRows(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Cols</label>
                    <input
                      type="number"
                      min={2}
                      max={8}
                      value={cols}
                      onChange={(e) => setCols(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Task Number</label>
                  <input
                    type="number"
                    value={taskNumber}
                    onChange={(e) => setTaskNumber(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Level</label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {["easy", "medium", "hard"].map((lvl) => (
                      <label
                        key={lvl}
                        className={`flex justify-center rounded-xl border px-3 py-2 text-sm cursor-pointer ${
                          level === lvl ? "bg-slate-900 text-white" : "bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          value={lvl}
                          checked={level === lvl}
                          onChange={() => setLevel(lvl)}
                          className="hidden"
                        />
                        {lvl}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm"
                  >
                    {submitting ? "Adding..." : "Add Jigsaw"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border px-4 py-2 text-sm"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Upload Image</label>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => onPickImage(e.target.files?.[0] || null)}
                  className="mt-1 w-full"
                  required
                />

                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="mt-4 h-72 w-full object-cover rounded-xl"
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}