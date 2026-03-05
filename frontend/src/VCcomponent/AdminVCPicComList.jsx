import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../Components/AdminHeader";
import Swal from "sweetalert2";

export default function AdminVCPicComList() {
  const api = "http://localhost:5000";
  const nav = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | easy | medium | hard

  const levelOf = (levels = []) => (levels[0] || "").toLowerCase();

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${api}/api/vc_pic_com/all`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const counts = useMemo(() => {
    const c = { all: items.length, easy: 0, medium: 0, hard: 0 };
    items.forEach((it) => {
      const lvl = levelOf(it.levels);
      if (c[lvl] !== undefined) c[lvl] += 1;
    });
    return c;
  }, [items]);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((it) => levelOf(it.levels) === filter);
  }, [items, filter]);

  const handleDelete = async (activityId) => {
    const ok = await Swal.fire({
      icon: "warning",
      title: "Delete this activity?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    });
    if (!ok.isConfirmed) return;

    try {
      await axios.delete(`${api}/api/vc_pic_com/${activityId}`);
      await Swal.fire({
        icon: "success",
        title: "Deleted ✅",
        timer: 1200,
        showConfirmButton: false,
      });
      load();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        confirmButtonColor: "#0f172a",
      });
    }
  };

  const FilterBtn = ({ k, label }) => {
    const active = filter === k;
    return (
      <button
        type="button"
        onClick={() => setFilter(k)}
        className={[
          "rounded-xl px-3 py-2 text-sm font-semibold border",
          active
            ? "bg-slate-900 text-white border-slate-900"
            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
        ].join(" ")}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />

      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Admin - Picture Completion
            </h2>

            <div className="flex flex-wrap gap-2">
              <FilterBtn k="all" label={`All (${counts.all})`} />
              <FilterBtn k="easy" label={`Easy (${counts.easy})`} />
              <FilterBtn k="medium" label={`Medium (${counts.medium})`} />
              <FilterBtn k="hard" label={`Hard (${counts.hard})`} />

              <button
                type="button"
                onClick={() => nav("/admin/vcPicCom/add")}
                className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                + Add New
              </button>

              <button
                type="button"
                onClick={() => nav("/vcAdminDashboard")}
                className="rounded-xl px-3 py-2 text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600"
              >
                ← Dashboard
              </button>
              
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-sm text-slate-600">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="text-sm text-slate-600">
                No picture completion activities found.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filtered.map((it) => {
                  const lvl = levelOf(it.levels) || "—";
                  return (
                    <div
                      key={it.activity_id}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-800">
                            {it.title}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            ID: {it.activity_id} • Level:{" "}
                            <span className="font-semibold text-slate-700">
                              {lvl}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => nav(`/vcPicCom/${it.activity_id}`)}
                            className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                          >
                            Test / Play
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(it.activity_id)}
                            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-12 gap-3 items-start">
                        <img
                          src={`${api}${it.question_url}`}
                          alt="preview"
                          className="col-span-12 sm:col-span-5 h-28 w-full rounded-xl object-cover ring-1 ring-slate-200"
                          draggable={false}
                        />

                        <div className="col-span-12 sm:col-span-7">
                          <div className="mb-2 text-xs font-semibold text-slate-700">
                            Options
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(it.options || []).slice(0, 10).map((o) => (
                              <img
                                key={o.id}
                                src={`${api}${o.thumb_url || o.url}`}
                                alt={o.id}
                                className={[
                                  "h-12 w-12 rounded-lg bg-white object-contain ring-1",
                                  o.is_correct
                                    ? "ring-emerald-400"
                                    : "ring-slate-200",
                                ].join(" ")}
                                draggable={false}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}