import React, { useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../Components/AdminHeader";

export default function AdminAddVCShaMat() {
  const apiBase = "http://localhost:5000";
  const navigate = useNavigate();

  const correctRef = useRef(null);
  const optionsRef = useRef(null);

  const [title, setTitle] = useState("");
  const [taskNumber, setTaskNumber] = useState("");
  const [level, setLevel] = useState("easy");

  const [correctImage, setCorrectImage] = useState(null);
  const [correctPreview, setCorrectPreview] = useState("");

  const [optionImages, setOptionImages] = useState([]);
  const [optionPreviews, setOptionPreviews] = useState([]);

  const [submitting, setSubmitting] = useState(false);

  const onPickCorrect = (file) => {
    setCorrectImage(file || null);
    if (correctPreview) URL.revokeObjectURL(correctPreview);
    setCorrectPreview(file ? URL.createObjectURL(file) : "");
  };

  const onPickOptions = (files) => {
    const arr = Array.from(files || []);
    setOptionImages(arr);

    optionPreviews.forEach((u) => URL.revokeObjectURL(u));
    setOptionPreviews(arr.map((f) => URL.createObjectURL(f)));
  };

  const resetForm = () => {
    setTitle("");
    setTaskNumber("");
    setLevel("easy");

    setCorrectImage(null);
    if (correctPreview) URL.revokeObjectURL(correctPreview);
    setCorrectPreview("");

    setOptionImages([]);
    optionPreviews.forEach((u) => URL.revokeObjectURL(u));
    setOptionPreviews([]);

    if (correctRef.current) correctRef.current.value = "";
    if (optionsRef.current) optionsRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!correctImage) {
      await Swal.fire({
        icon: "warning",
        title: "Correct image required",
        text: "Please upload the correct image.",
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
    if (optionImages.length < 2) {
      await Swal.fire({
        icon: "warning",
        title: "Options required",
        text: "Upload at least 2 option images (distractors).",
        confirmButtonColor: "#0f172a",
      });
      return;
    }
    if (optionImages.length > 5) {
      await Swal.fire({
        icon: "warning",
        title: "Too many options",
        text: "Please upload up to 5 option images.",
        confirmButtonColor: "#0f172a",
      });
      return;
    }

    const fd = new FormData();
    fd.append("title", title || "Shadow Match");
    fd.append("task_number", String(taskNumber));
    fd.append("levels[]", level); // send ONE selected level
    fd.append("correct_image", correctImage);
    optionImages.forEach((f) => fd.append("option_images[]", f));

    try {
      setSubmitting(true);

      await axios.post(`${apiBase}/api/vc_sha_mat/add`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await Swal.fire({
        icon: "success",
        title: "added successfully✅",
        // text: "Activity created successfully.",
        confirmButtonText: "OK",
        confirmButtonColor: "#0f172a",
      });

      resetForm();
      navigate("/admin/shadowMatchList");
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Error adding Shadow Match.";

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
              Admin - Add Shadow Match
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
                    placeholder="e.g., Find the Animal"
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

                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
                  Tip: Upload a clear image so the shadow looks sharp and easy
                  for kids to match.
                </div>
              </div>

              {/* Right */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Correct Image (backend generates shadow)
                  </label>
                  <input
                    ref={correctRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => onPickCorrect(e.target.files?.[0] || null)}
                    required
                    className="mt-1 block w-full text-sm file:mr-3 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 text-sm font-semibold text-slate-700">
                    Correct Preview
                  </div>

                  {correctPreview ? (
                    <img
                      src={correctPreview}
                      alt="correct preview"
                      className="h-72 w-full rounded-xl object-cover ring-1 ring-slate-200"
                      draggable={false}
                    />
                  ) : (
                    <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-500">
                      No image selected
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Option Images (2 to 5)
                  </label>
                  <input
                    ref={optionsRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => onPickOptions(e.target.files)}
                    required
                    className="mt-1 block w-full text-sm file:mr-3 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-2 text-sm font-semibold text-slate-700">
                    Options Preview
                  </div>

                  {optionPreviews.length ? (
                    <div className="grid grid-cols-4 gap-2">
                      {optionPreviews.map((u, i) => (
                        <img
                          key={i}
                          src={u}
                          alt={`opt-${i}`}
                          className="h-20 w-full rounded-xl object-cover ring-1 ring-slate-200"
                          draggable={false}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
                      No options selected
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}