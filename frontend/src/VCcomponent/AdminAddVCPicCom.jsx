import React, { useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../Components/AdminHeader";

export default function AdminAddVCPicCom() {
  const apiBase = "http://localhost:5000";
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [title, setTitle] = useState("");
  const [taskNumber, setTaskNumber] = useState("");
  const [level, setLevel] = useState("easy");
  const [optionsCount, setOptionsCount] = useState(4);

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const onPickImage = (file) => {
    setImage(file || null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  };

  const resetForm = () => {
    setTitle("");
    setTaskNumber("");
    setLevel("easy");
    setOptionsCount(4);
    setImage(null);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");

    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      await Swal.fire({
        icon: "warning",
        title: "Image required",
        text: "Please upload an image.",
        confirmButtonColor: "#0f172a",
      });
      return;
    }

    if (!taskNumber) {
      await Swal.fire({
        icon: "warning",
        title: "Task number required",
        text: "Please enter the task number.",
        confirmButtonColor: "#0f172a",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title || "VC Picture Completion");
    formData.append("task_number", String(taskNumber));
    formData.append("options_count", String(optionsCount));
    formData.append("levels[]", level);
    formData.append("image", image);

    try {
      setSubmitting(true);

      await axios.post(`${apiBase}/api/vc_pic_com/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await Swal.fire({
        icon: "success",
        title: "Added successfully ✅",
        confirmButtonText: "OK",
        confirmButtonColor: "#0f172a",
      });

      resetForm();
      navigate("/admin/vcPicCom/list");
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Error adding picture completion activity.";

      await Swal.fire({
        icon: "error",
        title: "Failed to add activity",
        text: msg,
        confirmButtonText: "OK",
        confirmButtonColor: "#0f172a",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />

      <div className="mx-auto w-full max-w-5xl px-4 py-6">

        <div className="flex justify-end mb-3">
          <button
            type="button"
            onClick={() => navigate("/vcAdminDashboard")}
            className="rounded-xl bg-blue-500 text-white px-4 py-1.5 text-sm font-semibold shadow hover:bg-blue-600 transition"
          >
            ← Dashboard
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Admin - Add Picture Completion
            </h2>
            <span className="text-xs text-slate-500">
              Level: <b className="text-slate-700">{level}</b>
            </span>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">

              {/* Left */}
              <div className="space-y-4">

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Complete the Animal"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Task Number
                  </label>
                  <input
                    type="number"
                    value={taskNumber}
                    onChange={(e) => setTaskNumber(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Options Count
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={8}
                    value={optionsCount}
                    onChange={(e) => setOptionsCount(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Level
                  </label>

                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {["easy", "medium", "hard"].map((lvl) => (
                      <label
                        key={lvl}
                        className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2 text-sm ${
                          level === lvl
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="level"
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
                    {submitting ? "Adding..." : "Add Activity"}
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

              {/* Right */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  Upload Image
                </label>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => onPickImage(e.target.files?.[0] || null)}
                  className="mt-1 w-full"
                  required
                />

                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="mt-4 h-72 w-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="flex h-72 items-center justify-center rounded-xl border border-dashed text-sm text-slate-500">
                    No image selected
                  </div>
                )}
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}