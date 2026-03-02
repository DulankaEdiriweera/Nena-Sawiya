import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EDIT_FORMS } from "./RLDEditForms.jsx";

const B = "http://localhost:5000/api";
const LEVELS = ["easy", "medium", "hard"];

const LEVEL_COLOR = {
  easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  hard: "bg-rose-50 text-rose-700 border-rose-200",
};

const CATS = [
  {
    name: "Directional",
    icon: "🧭",
    base: `${B}/rld_direction_bp`,
    admin: "admin_get_sets",
    del: "delete_set",
    update: "update_set",
    add: "/admin-direction",
  },
  {
    name: "Jumbled Sentences",
    icon: "🔀",
    base: `${B}/rld_jumbled`,
    admin: "admin_get_sets",
    del: "delete_set",
    update: "update_set",
    add: "/admin-jumbled",
  },
  {
    name: "Categorization",
    icon: "🗂️",
    base: `${B}/rld_categorize`,
    admin: "admin_get_sets",
    del: "delete_set",
    update: "update_set",
    add: "/admin-categorize",
  },
  {
    name: "Comprehension",
    icon: "📖",
    base: `${B}/rld_comprehension`,
    admin: "admin_get_passages",
    del: "delete_passage",
    update: "update_passage",
    add: "/admin-comprehension",
  },
  {
    name: "WH Questions",
    icon: "❓",
    base: `${B}/rld_wh`,
    admin: "admin_get_questions",
    del: "delete_question",
    update: "update_question",
    add: "/admin-wh",
  },
];

const getId = (item) => item._id || item.set_id || item.question_id;

async function fetchLevel(cat, lvl) {
  try {
    const { data } = await axios.get(`${cat.base}/${cat.admin}/${lvl}`);
    return Array.isArray(data) ? data : data && !data.error ? [data] : [];
  } catch {
    return [];
  }
}

// ── Read-only view bodies ──
const DirectionalBody = ({ item }) => (
  <div className="space-y-3">
    {item.scene_image_url && (
      <img
        src={item.scene_image_url}
        className="w-full h-36 object-cover rounded-lg"
        alt=""
      />
    )}
    {item.question && (
      <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
        {item.question}
      </p>
    )}
    <div className="space-y-1.5">
      {item.options?.map((o, i) => (
        <div
          key={i}
          className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-sm"
        >
          {o.image_url && (
            <img
              src={o.image_url}
              className="w-8 h-8 rounded object-cover"
              alt=""
            />
          )}
          <span className="text-gray-600">
            Zone:{" "}
            <span className="font-semibold text-emerald-700">
              {o.correct_zone}
            </span>
          </span>
        </div>
      ))}
    </div>
  </div>
);

const JumbledBody = ({ item }) => (
  <div className="space-y-3">
    <div className="flex flex-wrap gap-2">
      {(item.jumbled_words || []).map((w, i) => (
        <span
          key={i}
          className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-lg"
        >
          {w}
        </span>
      ))}
    </div>
    {item.correct_words?.length > 0 && (
      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-sm text-emerald-800 font-medium">
        <span>✓</span> {item.correct_words.join(" ")}
      </div>
    )}
  </div>
);

const CategorizeBody = ({ item }) => {
  const groups = {};
  (item.options || []).forEach((o) => {
    const b = o.correct_bag || "?";
    (groups[b] = groups[b] || []).push(o);
  });
  return (
    <div className="space-y-3">
      {item.instruction && (
        <p className="text-xs text-gray-500 italic">{item.instruction}</p>
      )}
      {Object.entries(groups).map(([bag, opts]) => (
        <div
          key={bag}
          className="rounded-lg border border-gray-200 overflow-hidden"
        >
          <div className="bg-gray-50 px-3 py-1.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">
              ✓ {bag}
            </span>
            <span className="text-xs text-gray-400">{opts.length} items</span>
          </div>
          <div className="flex flex-wrap gap-2 p-2">
            {opts.map((o, i) => (
              <div
                key={i}
                className="flex items-center gap-1 bg-white border border-gray-200 rounded px-1.5 py-1"
              >
                {o.image_url && (
                  <img
                    src={o.image_url}
                    className="w-6 h-6 rounded object-cover"
                    alt=""
                  />
                )}
                <span className="text-xs text-gray-600">
                  {o.label ||
                    o.image_url
                      ?.split("/")
                      .pop()
                      ?.replace(/\.[^.]+$/, "")}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const OptionRow = ({ index, text, isCorrect }) => (
  <div
    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${
      isCorrect ? "bg-emerald-50 border border-emerald-200" : "bg-gray-50"
    }`}
  >
    <span
      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
        isCorrect
          ? "bg-emerald-500 text-white"
          : "bg-white border border-gray-300 text-gray-500"
      }`}
    >
      {isCorrect ? "✓" : index + 1}
    </span>
    <span
      className={isCorrect ? "text-emerald-800 font-semibold" : "text-gray-700"}
    >
      {text}
    </span>
    {isCorrect && (
      <span className="ml-auto text-xs text-emerald-600 font-medium">
        Correct
      </span>
    )}
  </div>
);

const ComprehensionBody = ({ item }) => (
  <div className="space-y-4">
    {item.passage && (
      <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed">
        {item.passage}
      </p>
    )}
    {item.questions?.map((q, qi) => (
      <div key={qi} className="space-y-1.5">
        <p className="text-sm font-semibold text-gray-800">
          Q{qi + 1}: {q.question}
        </p>
        {q.options?.map((opt, oi) => {
          const text = typeof opt === "string" ? opt : opt.text;
          const ok =
            opt.is_correct === true ||
            opt.is_correct === 1 ||
            oi === q.correct_index;
          return <OptionRow key={oi} index={oi} text={text} isCorrect={ok} />;
        })}
      </div>
    ))}
  </div>
);

const WHBody = ({ item }) => (
  <div className="space-y-3">
    {item.wh_type && (
      <span className="inline-block bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded">
        {item.wh_type}
      </span>
    )}
    {item.scene_audio_url && (
      <audio controls src={item.scene_audio_url} className="w-full h-9" />
    )}
    {item.question_audio_url && (
      <audio controls src={item.question_audio_url} className="w-full h-9" />
    )}
    {item.question_text && (
      <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
        {item.question_text}
      </p>
    )}
    <div className="space-y-1.5">
      {item.options?.map((opt, oi) => (
        <OptionRow
          key={oi}
          index={oi}
          text={opt.text || opt}
          isCorrect={oi === item.correct_index}
        />
      ))}
    </div>
  </div>
);

const BODIES = {
  Directional: DirectionalBody,
  "Jumbled Sentences": JumbledBody,
  Categorization: CategorizeBody,
  Comprehension: ComprehensionBody,
  "WH Questions": WHBody,
};

// ── Delete Modal ──
const DeleteModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-xl shadow-xl p-6 w-80 text-center">
      <p className="text-base font-semibold text-gray-900 mb-1">
        Delete this game?
      </p>
      <p className="text-sm text-gray-500 mb-5">This cannot be undone.</p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2 rounded-lg bg-rose-600 text-white text-sm hover:bg-rose-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ── Game Card ──
const GameCard = ({ icon, index, level, item, cat, onDelete, onUpdated }) => {
  const [editing, setEditing] = useState(false);
  const EditForm = EDIT_FORMS[cat.name];
  const Body = BODIES[cat.name];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-600">
            {icon} Game {index + 1}
          </span>
          {level && (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded border capitalize ${
                LEVEL_COLOR[level] ||
                "bg-gray-100 text-gray-600 border-gray-200"
              }`}
            >
              {level}
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setEditing((e) => !e)}
            className={`px-2 py-1 text-xs rounded transition ${
              editing
                ? "bg-indigo-100 text-indigo-700"
                : "hover:bg-gray-200 text-gray-500 hover:text-indigo-600"
            }`}
          >
            {editing ? "Cancel" : "Edit"}
          </button>
          <button
            onClick={onDelete}
            className="px-2 py-1 text-xs rounded hover:bg-rose-50 text-gray-500 hover:text-rose-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="p-4">
        {editing ? (
          <EditForm
            item={item}
            cat={cat}
            onSaved={() => {
              setEditing(false);
              onUpdated();
            }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          Body && <Body item={item} />
        )}
      </div>
    </div>
  );
};

// ── Main Dashboard ──
export default function RLDAdminDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState(null);
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState("all");
  const [delItem, setDelItem] = useState(null);

  const loadData = async (cat) => {
    setLoading(true);
    const result = {};
    await Promise.all(
      LEVELS.map(async (l) => {
        result[l] = await fetchLevel(cat, l);
      }),
    );
    setAllData(result);
    setLoading(false);
  };

  const handleSelect = async (cat) => {
    if (active?.name === cat.name) return;
    setActive(cat);
    setLevel("all");
    await loadData(cat);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${active.base}/${active.del}/${getId(delItem)}`);
      setAllData((prev) => {
        const u = { ...prev };
        const l = delItem._lvl;
        if (u[l]) u[l] = u[l].filter((i) => getId(i) !== getId(delItem));
        return u;
      });
    } catch (e) {
      alert("Delete failed: " + (e.response?.data?.error || e.message));
    }
    setDelItem(null);
  };

  const total = LEVELS.reduce((s, l) => s + (allData[l]?.length || 0), 0);
  const visible =
    level === "all"
      ? LEVELS.flatMap((l) =>
          (allData[l] || []).map((i) => ({ ...i, _lvl: l })),
        )
      : (allData[level] || []).map((i) => ({ ...i, _lvl: level }));

  return (
    <div className="min-h-screen bg-gray-50">
      {delItem && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setDelItem(null)}
        />
      )}

      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <span className="text-xl">🧠</span>
          <div>
            <h1 className="text-sm font-bold text-gray-900">RLD Admin</h1>
            <p className="text-xs text-gray-400">Intervention Dashboard</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-7 space-y-7">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Category
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {CATS.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleSelect(cat)}
                className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center transition-all ${
                  active?.name === cat.name
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                    : "bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-semibold leading-tight">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {!active ? (
          <div className="text-center py-24 text-gray-400 text-sm">
            Select a category above to get started
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {active.icon} {active.name}
                </h2>
                <p className="text-xs text-gray-400">
                  {loading ? "Loading…" : `${total} games`}
                </p>
              </div>
              <button
                onClick={() => navigate(active.add)}
                className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                + Add New
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setLevel("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                  level === "all"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                All ({total})
              </button>
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition capitalize ${
                    level === l
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {l[0].toUpperCase() + l.slice(1)} ({allData[l]?.length || 0})
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-xl h-44 animate-pulse"
                  />
                ))}
              </div>
            ) : visible.length === 0 ? (
              <div className="text-center py-20 text-gray-400 text-sm bg-white border border-gray-200 rounded-xl">
                No games found
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {visible.map((item, i) => (
                  <GameCard
                    key={getId(item) || i}
                    icon={active.icon}
                    index={i}
                    level={item._lvl}
                    item={item}
                    cat={active}
                    onDelete={() => setDelItem(item)}
                    onUpdated={() => loadData(active)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
