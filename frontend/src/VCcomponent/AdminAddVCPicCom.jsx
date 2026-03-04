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
    formData.append("levels[]", level); // send ONE level
    formData.append("image", image);

    try {
      setSubmitting(true);

      const res = await axios.post(`${apiBase}/api/vc_pic_com/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await Swal.fire({
        icon: "success",
        title: "Picture completion added ✅",
        html: res?.data?.activity_id
          ? `<div style="font-size:14px;opacity:.9">Activity ID: <b>${res.data.activity_id}</b></div>`
          : undefined,
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
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
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
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
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
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Choose between 2 and 8 options.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Level (select one)
                  </label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {[
                      { k: "easy", label: "Easy" },
                      { k: "medium", label: "Medium" },
                      { k: "hard", label: "Hard" },
                    ].map((opt) => (
                      <label
                        key={opt.k}
                        className={[
                          "flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium",
                          level === opt.k
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <input
                          type="radio"
                          name="level"
                          value={opt.k}
                          checked={level === opt.k}
                          onChange={() => setLevel(opt.k)}
                          className="sr-only"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={[
                      "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                      submitting
                        ? "cursor-not-allowed bg-slate-300 text-slate-600"
                        : "bg-slate-900 text-white hover:bg-slate-800",
                    ].join(" ")}
                  >
                    {submitting ? "Adding..." : "Add Activity"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Right */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Upload Image
                  </label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => onPickImage(e.target.files?.[0] || null)}
                    required
                    className="mt-1 block w-full text-sm file:mr-3 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 text-sm font-semibold text-slate-700">
                    Preview
                  </div>

                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="preview"
                      className="h-72 w-full rounded-xl object-cover ring-1 ring-slate-200"
                      draggable={false}
                    />
                  ) : (
                    <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-500">
                      No image selected
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
                  Tip: Use a clear image so the missing part and options look
                  sharp for kids.
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}