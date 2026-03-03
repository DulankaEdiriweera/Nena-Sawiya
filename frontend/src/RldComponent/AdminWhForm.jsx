import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WH_TYPES = ["කවුද", "කොහේ", "මොකද", "කවදා", "ඇයි"];
const WH_HINTS = {
  කවුද: "Who",
  කොහේ: "Where",
  මොකද: "What",
  කවදා: "When",
  ඇයි: "Why",
};

// ── AudioInput ────────────────────────────────────────────────────────────────
const AudioInput = ({
  label,
  hint,
  onFileReady,
  onTranscript = null,
  resetKey,
}) => {
  const [mode, setMode] = useState("record");
  const [recording, setRec] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [status, setStatus] = useState("");
  const mrRef = useRef(null),
    chunksRef = useRef([]),
    srRef = useRef(null),
    fileRef = useRef(null);

  useEffect(() => {
    setAudioURL(null);
    setStatus("");
    setRec(false);
  }, [resetKey]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      mrRef.current = new MediaRecorder(stream);
      mrRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);
      mrRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        onFileReady(
          new File([blob], `rec_${Date.now()}.webm`, { type: "audio/webm" }),
        );
        stream.getTracks().forEach((t) => t.stop());
        setStatus("Saved");
      };
      mrRef.current.start();
      setRec(true);
      setStatus("Recording…");
      if (onTranscript && "webkitSpeechRecognition" in window) {
        const SR = new window.webkitSpeechRecognition();
        SR.lang = "si-LK";
        SR.continuous = true;
        SR.interimResults = true;
        SR.onresult = (e) => {
          let t = "";
          for (let i = 0; i < e.results.length; i++)
            t += e.results[i][0].transcript;
          onTranscript(t);
        };
        SR.start();
        srRef.current = SR;
      }
    } catch {
      alert("Microphone access denied.");
    }
  };

  const stop = () => {
    if (mrRef.current && recording) {
      mrRef.current.stop();
      setRec(false);
    }
    if (srRef.current) {
      srRef.current.stop();
      srRef.current = null;
    }
  };

  const onFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setAudioURL(URL.createObjectURL(f));
    setStatus(f.name);
    onFileReady(f);
  };

  const clear = () => {
    setAudioURL(null);
    setStatus("");
    onFileReady(null);
    if (onTranscript) onTranscript("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="border border-slate-200 rounded-xl px-4 py-3.5 bg-slate-50">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-indigo-400 mb-0.5">
            {label}
          </p>
          {hint && <p className="text-xs text-slate-400">{hint}</p>}
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setMode("record")}
            className={`px-3 py-1 text-xs font-semibold rounded-md border-none cursor-pointer transition-colors ${
              mode === "record"
                ? "bg-red-600 text-white"
                : "bg-slate-200 text-indigo-400 hover:bg-slate-300"
            }`}
          >
            Record
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-3 py-1 text-xs font-semibold rounded-md border-none cursor-pointer transition-colors ${
              mode === "upload"
                ? "bg-slate-900 text-white"
                : "bg-slate-200 text-indigo-400 hover:bg-slate-300"
            }`}
          >
            Upload
          </button>
        </div>
      </div>

      {/* Record mode */}
      {mode === "record" && (
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={recording ? stop : start}
            className={`sinhala flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-white text-sm font-semibold border-none cursor-pointer transition-colors ${
              recording ? "bg-slate-800" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            <span
              className={`w-2 h-2 bg-white ${recording ? "rounded-sm" : "rounded-full"}`}
            />
            {recording ? "නවතන්න" : "පටිගත කරන්න"}
          </button>
          {status && (
            <span
              className={`text-xs font-medium ${recording ? "text-red-600" : "text-green-700"}`}
            >
              {status}
            </span>
          )}
        </div>
      )}

      {/* Upload mode */}
      {mode === "upload" && (
        <>
          <input
            ref={fileRef}
            type="file"
            accept="audio/*"
            onChange={onFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="sinhala flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-700 rounded-lg text-white text-sm font-semibold border-none cursor-pointer transition-colors"
          >
            ගොනුව තෝරන්න
          </button>
          {status && <p className="text-xs text-green-700 mt-1.5">{status}</p>}
        </>
      )}

      {/* Audio player */}
      {audioURL && (
        <div className="flex items-center gap-2.5 mt-3">
          <audio controls src={audioURL} className="flex-1 h-8" />
          <button
            type="button"
            onClick={clear}
            className="bg-transparent border-none text-red-600 text-xs font-semibold cursor-pointer hover:text-red-800"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

// ── Main Form ─────────────────────────────────────────────────────────────────
const AdminWHForm = () => {
  const navigate = useNavigate();
  const [level, setLevel] = useState("easy");
  const [whType, setWhType] = useState("කවුද");
  const [questionText, setQText] = useState("");
  const [sceneAudio, setSceneAudio] = useState(null);
  const [qAudio, setQAudio] = useState(null);
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrect] = useState(0);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const updateOption = (i, val) => {
    const u = [...options];
    u[i] = val;
    setOptions(u);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sceneAudio) {
      setMessage("Scene audio is required.");
      setIsError(true);
      return;
    }
    if (!qAudio) {
      setMessage("Question audio is required.");
      setIsError(true);
      return;
    }
    if (options.some((o) => !o.trim())) {
      setMessage("Please fill in all 4 options.");
      setIsError(true);
      return;
    }

    setLoading(true);
    const fd = new FormData();
    fd.append("level", level);
    fd.append("wh_type", whType);
    fd.append("question_text", questionText);
    fd.append("correct_index", correctIndex);
    fd.append("scene_audio", sceneAudio);
    fd.append("question_audio", qAudio);
    fd.append(
      "options",
      JSON.stringify(options.map((t) => ({ text: t.trim() }))),
    );

    try {
      const res = await axios.post(
        "http://localhost:5000/api/rld_wh/add_question",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      setMessage(res.data.message || "Saved successfully.");
      setIsError(false);
      setQText("");
      setSceneAudio(null);
      setQAudio(null);
      setOptions(["", "", "", ""]);
      setCorrect(0);
      setFormKey((k) => k + 1);
      navigate("/rld-admin-dashboard", {
        state: { activeCat: "WH Questions" },
      });
    } catch (err) {
      setMessage(err.response?.data?.error || "Error saving.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Sinhala:wght@400;600&family=DM+Sans:wght@400;500;600;700&display=swap');
        .dm-sans { font-family: 'DM Sans', sans-serif; }
        .sinhala { font-family: 'Noto Serif Sinhala', serif; }
        .focus-ring:focus { border-color: #8888cc; box-shadow: 0 0 0 3px rgba(100,100,200,0.08); }
      `}</style>

      <div className="dm-sans min-h-screen bg-slate-100 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-7 py-6 border-b border-slate-100">
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-1">
              Admin Panel
            </p>
            <p className="text-xl font-bold text-slate-900 mb-0.5">
              WH Question — Add Set
            </p>
            <p className="text-sm text-slate-400">
              Record or upload audio · question text auto-fills from speech.
            </p>
          </div>

          {/* Body */}
          <div className="px-7 py-6 pb-8">
            {/* Alert */}
            {message && (
              <div
                className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium mb-5 border ${
                  isError
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-green-50 border-green-200 text-green-700"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${isError ? "bg-red-600" : "bg-green-500"}`}
                />
                {message}
              </div>
            )}

            <form key={formKey} onSubmit={handleSubmit}>
              {/* Difficulty Level */}
              <div className="mb-5">
                <label className="block text-xs font-bold tracking-widest uppercase text-indigo-400 mb-1.5">
                  Difficulty Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="focus-ring dm-sans w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 bg-white outline-none"
                >
                  <option value="easy">Easy — 2 answer options</option>
                  <option value="medium">Medium — 3 answer options</option>
                  <option value="hard">Hard — 4 answer options</option>
                </select>
              </div>

              {/* WH Type */}
              <div className="mb-5">
                <label className="block text-xs font-bold tracking-widest uppercase text-indigo-400 mb-1.5">
                  WH Question Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {WH_TYPES.map((wh) => (
                    <button
                      key={wh}
                      type="button"
                      onClick={() => setWhType(wh)}
                      className={`sinhala px-3.5 py-1.5 rounded-lg border text-sm font-semibold cursor-pointer transition-colors ${
                        whType === wh
                          ? "bg-slate-900 border-slate-900 text-white"
                          : "bg-white border-slate-200 text-slate-900 hover:border-slate-400"
                      }`}
                    >
                      {wh}
                      <span className="dm-sans block text-xs opacity-60 font-normal">
                        {WH_HINTS[wh]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scene Audio */}
              <div className="mb-5">
                <label className="block text-xs font-bold tracking-widest uppercase text-indigo-400 mb-1.5">
                  Scene Audio
                </label>
                <AudioInput
                  key={`scene-${formKey}`}
                  resetKey={formKey}
                  label="Scene"
                  hint='e.g. "ළමයා ගෙදරදී බත් කනවා"'
                  onFileReady={setSceneAudio}
                />
              </div>

              {/* Question Audio */}
              <div className="mb-5">
                <label className="block text-xs font-bold tracking-widest uppercase text-indigo-400 mb-1.5">
                  Question Audio
                  <span className="text-xs font-normal text-slate-400 normal-case tracking-normal ml-1.5">
                    text auto-fills below
                  </span>
                </label>
                <AudioInput
                  key={`q-${formKey}`}
                  resetKey={formKey}
                  label="Question"
                  hint="Record the WH question"
                  onFileReady={setQAudio}
                  onTranscript={(t) => setQText(t)}
                />
              </div>

              {/* Question Text */}
              <div className="mb-5">
                <label className="block text-xs font-bold tracking-widest uppercase text-indigo-400 mb-1.5">
                  Question Text
                  <span className="text-xs font-normal text-slate-400 normal-case tracking-normal ml-1.5">
                    edit if needed
                  </span>
                </label>
                <input
                  value={questionText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder={`e.g. ළමයා ${whType}?`}
                  className="focus-ring sinhala w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 bg-white outline-none"
                />
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-100 my-5" />

              {/* Answer Options */}
              <div className="mb-5">
                <label className="block text-xs font-bold tracking-widest uppercase text-indigo-400 mb-1.5">
                  Answer Options
                  <span className="text-xs font-normal text-slate-400 normal-case tracking-normal ml-1.5">
                    Sinhala · select correct answer
                  </span>
                </label>
                {options.map((opt, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2.5 px-3 py-2.5 border rounded-lg mb-2 transition-colors ${
                      correctIndex === i
                        ? "border-green-300 bg-green-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="correct"
                      checked={correctIndex === i}
                      onChange={() => setCorrect(i)}
                      className="w-3.5 h-3.5 flex-shrink-0 accent-green-700"
                    />
                    <span
                      className={`text-xs font-bold whitespace-nowrap ${
                        correctIndex === i ? "text-green-700" : "text-slate-400"
                      }`}
                    >
                      {correctIndex === i ? "Correct" : `Option ${i + 1}`}
                    </span>
                    <input
                      value={opt}
                      required
                      onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={`Sinhala answer ${i + 1}`}
                      className={`focus-ring sinhala flex-1 border rounded-lg px-3 py-2 text-sm text-slate-900 outline-none transition-colors ${
                        correctIndex === i
                          ? "border-green-200 bg-green-50"
                          : "border-slate-200 bg-white"
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`dm-sans w-full py-3.5 rounded-lg text-sm font-bold tracking-wide text-white border-none transition-all ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-slate-900 cursor-pointer hover:bg-slate-700 hover:-translate-y-px"
                }`}
              >
                {loading ? "Saving…" : "Save WH Question"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminWHForm;
