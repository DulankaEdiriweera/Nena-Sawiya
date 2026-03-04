import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../Components/AdminHeader";
import Swal from "sweetalert2";

export default function AdminVCJigsawList() {
  const api = "http://localhost:5000";
  const nav = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | easy | medium | hard

  const abilityToLevel = (arr = []) => {
    const s = (arr[0] || "").toLowerCase();
    if (s === "weak") return "easy";
    if (s === "average") return "medium";
    if (s === "high") return "hard";
    return "";
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${api}/api/vc_jigsaw/all`);
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
      const lvl = abilityToLevel(it.ability_levels);
      if (lvl && c[lvl] !== undefined) c[lvl] += 1;
    });
    return c;
  }, [items]);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((it) => abilityToLevel(it.ability_levels) === filter);
  }, [items, filter]);

  const handleDelete = async (puzzleId) => {
    const ok = await Swal.fire({
      icon: "warning",
      title: "Delete this jigsaw?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    });
    if (!ok.isConfirmed) return;

    try {
      await axios.delete(`${api}/api/vc_jigsaw/${puzzleId}`);
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
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div className="flex flex-col gap-3 px-6 py-4 border-b border-slate-200 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Admin - All VC Jigsaws
            </h2>

            <div className="flex flex-wrap gap-2">
              <FilterBtn k="all" label={`All (${counts.all})`} />
              <FilterBtn k="easy" label={`Easy (${counts.easy})`} />
              <FilterBtn k="medium" label={`Medium (${counts.medium})`} />
              <FilterBtn k="hard" label={`Hard (${counts.hard})`} />

              <button
                type="button"
                onClick={() => nav("/vcAdminAddJigsaw")}
                className="rounded-xl px-3 py-2 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
              >
                + Add New
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-sm text-slate-600">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="text-sm text-slate-600">No jigsaws found.</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filtered.map((it) => {
                  const lvl = abilityToLevel(it.ability_levels) || "—";
                  return (
                    <div
                      key={it.puzzle_id}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-800">
                            {it.title}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            ID: {it.puzzle_id} • Grid: {it.rows}×{it.cols} • Level:{" "}
                            <span className="font-semibold text-slate-700">
                              {lvl}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => nav(`/vcJigsaw/${it.puzzle_id}`)}
                            className="rounded-xl px-3 py-2 text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800"
                          >
                            Test / Play
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(it.puzzle_id)}
                            className="rounded-xl px-3 py-2 text-sm font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-12 gap-3 items-start">
                        <img
                          src={`${api}${it.original_url}`}
                          alt="preview"
                          className="col-span-12 sm:col-span-5 h-28 w-full rounded-xl object-cover ring-1 ring-slate-200"
                          draggable={false}
                        />

                        <div className="col-span-12 sm:col-span-7">
                          <div className="text-xs font-semibold text-slate-700 mb-2">
                            Tiles (first 8)
                          </div>
                          <div className="grid grid-cols-8 gap-2">
                            {(it.pieces || []).slice(0, 8).map((p) => (
                              <img
                                key={p.index}
                                src={`${api}${p.url}`}
                                alt={`tile-${p.index}`}
                                className="h-10 w-10 rounded-lg object-cover ring-1 ring-slate-200"
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