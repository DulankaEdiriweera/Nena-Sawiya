import React, { useState } from "react";
import axios from "axios";

const LEVELS = ["easy", "medium", "hard"];
const WH_TYPES = ["කවුද", "කොහේ", "මොකද", "කවදා", "ඇයි"];
const ZONES = ["left", "right", "top", "bottom"];

const getId = (item) => item._id || item.set_id || item.question_id;

// ── Shared atoms ──
const inp =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400";
const sel =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 bg-white";

export const EF = ({ label, children }) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
      {label}
    </p>
    {children}
  </div>
);

export const ImgFile = ({ url, onChange }) => (
  <div className="space-y-1">
    {url && (
      <img
        src={url}
        className="h-16 rounded object-cover border border-gray-200"
        alt=""
      />
    )}
    <input
      type="file"
      accept="image/*"
      onChange={(e) => onChange(e.target.files[0])}
      className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border file:border-gray-200 file:text-xs file:bg-gray-50"
    />
  </div>
);

export const AudioFile = ({ url, onChange }) => (
  <div className="space-y-1">
    {url && <audio controls src={url} className="w-full h-8" />}
    <input
      type="file"
      accept="audio/*"
      onChange={(e) => onChange(e.target.files[0])}
      className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border file:border-gray-200 file:text-xs file:bg-gray-50"
    />
  </div>
);

const LevelSel = ({ value, onChange }) => (
  <EF label="Level">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={sel}
    >
      {LEVELS.map((l) => (
        <option key={l} value={l}>
          {l}
        </option>
      ))}
    </select>
  </EF>
);

const SaveRow = ({ onSave, onCancel, saving }) => (
  <div className="flex gap-2 pt-1">
    <button
      onClick={onCancel}
      className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
    >
      Cancel
    </button>
    <button
      onClick={onSave}
      disabled={saving}
      className="flex-1 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
    >
      {saving ? "Saving…" : "Save Changes"}
    </button>
  </div>
);

const Err = ({ msg }) =>
  msg ? (
    <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded px-2 py-1">
      {msg}
    </p>
  ) : null;

const RadioOpt = ({ text, checked, onCheck, onChange, placeholder }) => (
  <div
    className={`flex items-center gap-2 border rounded-lg px-3 py-2 ${
      checked ? "border-emerald-300 bg-emerald-50" : "border-gray-200 bg-white"
    }`}
  >
    <input
      type="radio"
      checked={checked}
      onChange={onCheck}
      className="accent-emerald-600 w-4 h-4 flex-shrink-0"
    />
    <input
      value={text}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 text-sm bg-transparent focus:outline-none"
      placeholder={placeholder}
    />
    {checked && (
      <span className="text-xs text-emerald-600 font-medium flex-shrink-0">
        ✓
      </span>
    )}
  </div>
);

// ── Directional Edit ──
export function DirectionalEdit({ item, cat, onSaved, onCancel }) {
  const [level, setLevel] = useState(item.level || "easy");
  const [question, setQuestion] = useState(item.question || "");
  const [scene, setScene] = useState(null);
  const [opts, setOpts] = useState(
    (item.options || []).map((o) => ({ ...o, newFile: null })),
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const upd = (i, f, v) =>
    setOpts((p) => p.map((o, j) => (j === i ? { ...o, [f]: v } : o)));

  const save = async () => {
    setSaving(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("level", level);
      fd.append("question", question);
      if (scene) fd.append("scene_image", scene);
      fd.append(
        "options",
        JSON.stringify(
          opts.map((o) => ({
            correct_zone: o.correct_zone,
            image_url: o.image_url,
          })),
        ),
      );
      opts.forEach((o, i) => {
        if (o.newFile) fd.append(`option_image_${i}`, o.newFile);
      });
      await axios.put(`${cat.base}/${cat.update}/${getId(item)}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSaved();
    } catch (e) {
      setErr(e.response?.data?.error || "Save failed");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-3 pt-1">
      <LevelSel value={level} onChange={setLevel} />
      <EF label="Question">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className={inp}
        />
      </EF>
      <EF label="Scene Image">
        <ImgFile url={item.scene_image_url} onChange={setScene} />
      </EF>
      {opts.map((o, i) => (
        <div
          key={i}
          className="border border-gray-100 rounded-lg p-3 space-y-2 bg-gray-50"
        >
          <p className="text-xs font-semibold text-gray-400">Option {i + 1}</p>
          <ImgFile url={o.image_url} onChange={(f) => upd(i, "newFile", f)} />
          <EF label="Zone">
            <select
              value={o.correct_zone}
              onChange={(e) => upd(i, "correct_zone", e.target.value)}
              className={sel}
            >
              {ZONES.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </EF>
        </div>
      ))}
      <Err msg={err} />
      <SaveRow onSave={save} onCancel={onCancel} saving={saving} />
    </div>
  );
}

// ── Jumbled Edit ──
export function JumbledEdit({ item, cat, onSaved, onCancel }) {
  const [level, setLevel] = useState(item.level || "easy");
  const [jumbled, setJumbled] = useState((item.jumbled_words || []).join(", "));
  const [correct, setCorrect] = useState((item.correct_words || []).join(", "));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const save = async () => {
    setSaving(true);
    setErr("");
    const jw = jumbled
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean);
    const cw = correct
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean);
    if ([...jw].sort().join() !== [...cw].sort().join()) {
      setErr("Words must match.");
      setSaving(false);
      return;
    }
    try {
      await axios.put(`${cat.base}/${cat.update}/${getId(item)}`, {
        level,
        jumbled_words: jw,
        correct_words: cw,
      });
      onSaved();
    } catch (e) {
      setErr(e.response?.data?.error || "Save failed");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-3 pt-1">
      <LevelSel value={level} onChange={setLevel} />
      <EF label="Jumbled Words (comma separated)">
        <input
          value={jumbled}
          onChange={(e) => setJumbled(e.target.value)}
          className={inp}
        />
      </EF>
      <EF label="Correct Order (comma separated)">
        <input
          value={correct}
          onChange={(e) => setCorrect(e.target.value)}
          className={inp}
        />
      </EF>
      <Err msg={err} />
      <SaveRow onSave={save} onCancel={onCancel} saving={saving} />
    </div>
  );
}

// ── Categorize Edit ──
export function CategorizeEdit({ item, cat, onSaved, onCancel }) {
  const [level, setLevel] = useState(item.level || "easy");
  const [instruction, setInstruction] = useState(item.instruction || "");
  const [bags, setBags] = useState(
    (item.bags || []).map((b) => ({ ...b, newFile: null })),
  );
  const [opts, setOpts] = useState(
    (item.options || []).map((o) => ({ ...o, newFile: null })),
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const bagLabels = bags.map((b) => b.label).filter(Boolean);
  const updB = (i, f, v) =>
    setBags((p) => p.map((b, j) => (j === i ? { ...b, [f]: v } : b)));
  const updO = (i, f, v) =>
    setOpts((p) => p.map((o, j) => (j === i ? { ...o, [f]: v } : o)));

  const save = async () => {
    setSaving(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("level", level);
      fd.append("instruction", instruction);
      fd.append(
        "bags",
        JSON.stringify(
          bags.map((b) => ({ label: b.label, image_url: b.image_url })),
        ),
      );
      fd.append(
        "options",
        JSON.stringify(
          opts.map((o) => ({
            correct_bag: o.correct_bag,
            image_url: o.image_url,
          })),
        ),
      );
      bags.forEach((b, i) => {
        if (b.newFile) fd.append(`bag_image_${i}`, b.newFile);
      });
      opts.forEach((o, i) => {
        if (o.newFile) fd.append(`option_image_${i}`, o.newFile);
      });
      await axios.put(`${cat.base}/${cat.update}/${getId(item)}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSaved();
    } catch (e) {
      setErr(e.response?.data?.error || "Save failed");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-3 pt-1">
      <LevelSel value={level} onChange={setLevel} />
      <EF label="Instruction">
        <input
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          className={inp}
        />
      </EF>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
        Bags
      </p>
      {bags.map((b, i) => (
        <div
          key={i}
          className="border border-gray-100 rounded-lg p-3 space-y-2 bg-gray-50"
        >
          <EF label={`Bag ${i + 1} Label`}>
            <input
              value={b.label}
              onChange={(e) => updB(i, "label", e.target.value)}
              className={inp}
            />
          </EF>
          <ImgFile url={b.image_url} onChange={(f) => updB(i, "newFile", f)} />
        </div>
      ))}
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
        Items
      </p>
      {opts.map((o, i) => (
        <div
          key={i}
          className="border border-gray-100 rounded-lg p-3 space-y-2 bg-gray-50"
        >
          <p className="text-xs font-semibold text-gray-400">Item {i + 1}</p>
          <ImgFile url={o.image_url} onChange={(f) => updO(i, "newFile", f)} />
          <EF label="Correct Bag">
            <select
              value={o.correct_bag}
              onChange={(e) => updO(i, "correct_bag", e.target.value)}
              className={sel}
            >
              <option value="">-- select --</option>
              {bagLabels.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </EF>
        </div>
      ))}
      <Err msg={err} />
      <SaveRow onSave={save} onCancel={onCancel} saving={saving} />
    </div>
  );
}

// ── Comprehension Edit ──
export function ComprehensionEdit({ item, cat, onSaved, onCancel }) {
  const [level, setLevel] = useState(item.level || "easy");
  const [passage, setPassage] = useState(item.passage || "");
  const [qs, setQs] = useState(
    (item.questions || []).map((q) => ({
      question: q.question || "",
      options:
        q.options?.length === 4
          ? q.options.map((o) => (typeof o === "string" ? o : o.text || ""))
          : ["", "", "", ""],
      correct_index: q.correct_index ?? 0,
    })),
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const updQ = (qi, f, v) =>
    setQs((p) => p.map((q, i) => (i === qi ? { ...q, [f]: v } : q)));
  const updO = (qi, oi, v) =>
    setQs((p) =>
      p.map((q, i) =>
        i === qi
          ? { ...q, options: q.options.map((o, j) => (j === oi ? v : o)) }
          : q,
      ),
    );

  const save = async () => {
    setSaving(true);
    setErr("");
    for (let i = 0; i < qs.length; i++) {
      if (!qs[i].question.trim()) {
        setErr(`Q${i + 1} is empty`);
        setSaving(false);
        return;
      }
    }
    try {
      await axios.put(`${cat.base}/${cat.update}/${item._id}`, {
        level,
        passage,
        questions: qs,
      });
      onSaved();
    } catch (e) {
      setErr(e.response?.data?.error || "Save failed");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-3 pt-1">
      <LevelSel value={level} onChange={setLevel} />
      <EF label="Passage">
        <textarea
          value={passage}
          onChange={(e) => setPassage(e.target.value)}
          rows={4}
          className={inp}
        />
      </EF>
      {qs.map((q, qi) => (
        <div
          key={qi}
          className="border border-gray-100 rounded-lg p-3 space-y-2 bg-gray-50"
        >
          <EF label={`Q${qi + 1}`}>
            <input
              value={q.question}
              onChange={(e) => updQ(qi, "question", e.target.value)}
              className={inp}
            />
          </EF>
          {q.options.map((opt, oi) => (
            <RadioOpt
              key={oi}
              text={opt}
              checked={q.correct_index === oi}
              onCheck={() => updQ(qi, "correct_index", oi)}
              onChange={(v) => updO(qi, oi, v)}
              placeholder={`Option ${oi + 1}`}
            />
          ))}
        </div>
      ))}
      <Err msg={err} />
      <SaveRow onSave={save} onCancel={onCancel} saving={saving} />
    </div>
  );
}

// ── WH Edit ──
export function WHEdit({ item, cat, onSaved, onCancel }) {
  const [level, setLevel] = useState(item.level || "easy");
  const [whType, setWhType] = useState(item.wh_type || WH_TYPES[0]);
  const [qText, setQText] = useState(item.question_text || "");
  const [ci, setCi] = useState(item.correct_index ?? 0);
  const [opts, setOpts] = useState(
    item.options?.length === 4
      ? item.options.map((o) => o.text || o)
      : ["", "", "", ""],
  );
  const [sceneAudio, setSceneAudio] = useState(null);
  const [qAudio, setQAudio] = useState(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const save = async () => {
    setSaving(true);
    setErr("");
    if (opts.some((o) => !o.trim())) {
      setErr("All 4 options required.");
      setSaving(false);
      return;
    }
    try {
      const fd = new FormData();
      fd.append("level", level);
      fd.append("wh_type", whType);
      fd.append("question_text", qText);
      fd.append("correct_index", ci);
      fd.append("options", JSON.stringify(opts.map((t) => ({ text: t }))));
      if (sceneAudio) fd.append("scene_audio", sceneAudio);
      if (qAudio) fd.append("question_audio", qAudio);
      await axios.put(
        `${cat.base}/${cat.update}/${item.question_id || item._id}`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      onSaved();
    } catch (e) {
      setErr(e.response?.data?.error || "Save failed");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-3 pt-1">
      <div className="grid grid-cols-2 gap-2">
        <LevelSel value={level} onChange={setLevel} />
        <EF label="WH Type">
          <select
            value={whType}
            onChange={(e) => setWhType(e.target.value)}
            className={sel}
          >
            {WH_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </EF>
      </div>
      <EF label="Question Text">
        <input
          value={qText}
          onChange={(e) => setQText(e.target.value)}
          className={inp}
        />
      </EF>
      <EF label="Scene Audio">
        <AudioFile url={item.scene_audio_url} onChange={setSceneAudio} />
      </EF>
      <EF label="Question Audio">
        <AudioFile url={item.question_audio_url} onChange={setQAudio} />
      </EF>
      {opts.map((opt, oi) => (
        <RadioOpt
          key={oi}
          text={opt}
          checked={ci === oi}
          onCheck={() => setCi(oi)}
          onChange={(v) => setOpts((p) => p.map((o, j) => (j === oi ? v : o)))}
          placeholder={`Option ${oi + 1}`}
        />
      ))}
      <Err msg={err} />
      <SaveRow onSave={save} onCancel={onCancel} saving={saving} />
    </div>
  );
}

export const EDIT_FORMS = {
  Directional: DirectionalEdit,
  "Jumbled Sentences": JumbledEdit,
  Categorization: CategorizeEdit,
  Comprehension: ComprehensionEdit,
  "WH Questions": WHEdit,
};
