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

  // UI labels: easy/medium/hard -> Backend values: Weak/Average/High
  const [level, setLevel] = useState("easy");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
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
    setMessage("");
    setIsError(false);

    if (!image) {
      setMessage("Please upload an image.");
      setIsError(true);
      return;
    }
    if (!taskNumber) {
      setMessage("Task number is required.");
      setIsError(true);
      return;
    }

    const formData = new FormData();
    formData.append("title", title || "VC Jigsaw Puzzle");
    formData.append("rows", String(rows));
    formData.append("cols", String(cols));
    formData.append("task_number", String(taskNumber));

    // send level label
    formData.append("levels[]", level);
    // keep backend compatibility
    formData.append("ability_levels[]", levelToBackend(level));

    formData.append("image", image);

    try {
      setSubmitting(true);

      const res = await axios.post(`${apiBase}/api/vc_jigsaw/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await Swal.fire({
        icon: "success",
        title: "VC Jigsaw added successfully ✅",
        html: `<div style="font-size:14px;opacity:.9">Puzzle ID: <b>${res.data.puzzle_id}</b></div>`,
        confirmButtonText: "OK",
        confirmButtonColor: "#0f172a",
      });

      resetForm();
      navigate("/vcAdminJigsawList");
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Error adding VC jigsaw.";

      await Swal.fire({
        icon: "error",
        title: "Failed to add VC Jigsaw",
        text: msg,
        confirmButtonText: "OK",
        confirmButtonColor: "#0f172a",
      });

      setMessage(msg);
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />

      <div className="mx-auto w-full max-w-5xl px-4 py-6">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">
              Admin - Add VC Jigsaw
            </h2>
            <span className="text-xs text-slate-500">
              Level: <b className="text-slate-700">{level}</b>
            </span>
          </div>

          <div className="p-6">
            {message && (
              <div
                className={[
                  "mb-4 rounded-xl border px-4 py-3 text-sm",
                  isError
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700",
                ].join(" ")}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Princess Puzzle"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Rows
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={8}
                      value={rows}
                      onChange={(e) => setRows(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Cols
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={8}
                      value={cols}
                      onChange={(e) => setCols(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Task Number
                  </label>
                  <input
                    type="number"
                    value={taskNumber}
                    onChange={(e) => setTaskNumber(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                    required
                  />
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
                        ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                        : "bg-slate-900 text-white hover:bg-slate-800",
                    ].join(" ")}
                  >
                    {submitting ? "Adding..." : "Add Jigsaw"}
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
                  Tip: keep the image clear and high quality for better slicing.
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}