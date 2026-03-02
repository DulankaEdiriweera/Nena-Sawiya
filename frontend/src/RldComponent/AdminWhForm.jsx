// src/RldWH/AdminWHForm.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const WH_TYPES = ["කවුද", "කොහේ", "මොකද", "කවදා", "ඇයි"];
const WH_HINTS = {
  කවුද: "Who",
  කොහේ: "Where",
  මොකද: "What",
  කවදා: "When",
  ඇයි: "Why",
};

const s = {
  wrap: {
    minHeight: "100vh",
    background: "#f4f4f8",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "40px 16px",
    fontFamily: "'DM Sans',sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 640,
    background: "#fff",
    border: "1px solid #e2e2ee",
    borderRadius: 16,
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
    overflow: "hidden",
  },
  header: { padding: "24px 28px", borderBottom: "1px solid #ebebf5" },
  tag: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#9999bb",
    marginBottom: 4,
  },
  title: { fontSize: 20, fontWeight: 700, color: "#1a1a2e", marginBottom: 2 },
  sub: { fontSize: 13, color: "#9999bb" },
  body: { padding: "24px 28px 32px" },
  alert: (e) => ({
    display: "flex",
    gap: 10,
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 20,
    border: "1px solid",
    background: e ? "#fdf3f2" : "#f0faf4",
    borderColor: e ? "#e8b4b0" : "#a8dbbe",
    color: e ? "#c0392b" : "#1a7a4a",
  }),
  dot: (e) => ({
    width: 6,
    height: 6,
    borderRadius: "50%",
    marginTop: 5,
    flexShrink: 0,
    background: e ? "#c0392b" : "#27ae60",
  }),
  field: { marginBottom: 18 },
  label: {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#6666aa",
    marginBottom: 6,
  },
  hint: {
    fontSize: 11,
    fontWeight: 400,
    color: "#aaaacc",
    textTransform: "none",
    letterSpacing: 0,
    marginLeft: 6,
  },
  select: {
    width: "100%",
    border: "1px solid #e2e2ee",
    borderRadius: 8,
    padding: "10px 14px",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 14,
    color: "#1a1a2e",
    outline: "none",
    boxSizing: "border-box",
  },
  input: (green) => ({
    width: "100%",
    border: `1px solid ${green ? "#a8dbbe" : "#e2e2ee"}`,
    borderRadius: 8,
    padding: "9px 12px",
    fontFamily: "'Noto Serif Sinhala',serif",
    fontSize: 14,
    color: "#1a1a2e",
    background: green ? "#f0faf4" : "#fff",
    outline: "none",
    boxSizing: "border-box",
  }),
  divider: { height: 1, background: "#ebebf5", margin: "6px 0 18px" },
  submit: {
    width: "100%",
    padding: 14,
    background: "#1a1a2e",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.04em",
  },
  audioBox: {
    border: "1px solid #e2e2ee",
    borderRadius: 10,
    padding: "14px 16px",
    background: "#f7f7fb",
    marginBottom: 0,
  },
  row: { display: "flex", alignItems: "center", gap: 8 },
  tabBtn: (active, color) => ({
    padding: "5px 12px",
    fontSize: 12,
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    background: active ? color : "#ebebf5",
    color: active ? "#fff" : "#6666aa",
    borderRadius: 6,
    transition: "all 0.15s",
  }),
  recBtn: (rec) => ({
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    background: rec ? "#2d2d50" : "#c0392b",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  }),
  optRow: (sel) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    border: `1px solid ${sel ? "#a8dbbe" : "#e2e2ee"}`,
    borderRadius: 8,
    background: sel ? "#f0faf4" : "#fff",
    marginBottom: 8,
  }),
  radioLbl: {
    fontSize: 11,
    fontWeight: 700,
    color: "#1a7a4a",
    whiteSpace: "nowrap",
  },
  radioOff: {
    fontSize: 11,
    fontWeight: 600,
    color: "#aaaacc",
    whiteSpace: "nowrap",
  },
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
    <div style={s.audioBox}>
      <div
        style={{ ...s.row, justifyContent: "space-between", marginBottom: 10 }}
      >
        <div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#6666aa",
              marginBottom: 2,
            }}
          >
            {label}
          </p>
          {hint && <p style={{ fontSize: 11, color: "#aaaacc" }}>{hint}</p>}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            type="button"
            onClick={() => setMode("record")}
            style={s.tabBtn(mode === "record", "#c0392b")}
          >
            Record
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            style={s.tabBtn(mode === "upload", "#1a1a2e")}
          >
            Upload
          </button>
        </div>
      </div>

      {mode === "record" && (
        <div style={s.row}>
          <button
            type="button"
            onClick={recording ? stop : start}
            style={s.recBtn(recording)}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: recording ? "2px" : "50%",
                background: "#fff",
              }}
            />
            {recording ? "නවතන්න" : "පටිගත කරන්න"}
          </button>
          {status && (
            <span
              style={{
                fontSize: 12,
                color: recording ? "#c0392b" : "#1a7a4a",
                fontWeight: 500,
              }}
            >
              {status}
            </span>
          )}
        </div>
      )}

      {mode === "upload" && (
        <>
          <input
            ref={fileRef}
            type="file"
            accept="audio/*"
            onChange={onFile}
            style={{ display: "none" }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            style={s.recBtn(false)}
          >
            ගොනුව තෝරන්න
          </button>
          {status && (
            <p style={{ fontSize: 11, color: "#1a7a4a", marginTop: 6 }}>
              {status}
            </p>
          )}
        </>
      )}

      {audioURL && (
        <div style={{ ...s.row, marginTop: 10 }}>
          <audio controls src={audioURL} style={{ flex: 1, height: 32 }} />
          <button
            type="button"
            onClick={clear}
            style={{
              background: "none",
              border: "none",
              color: "#c0392b",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
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
    } catch (err) {
      setMessage(err.response?.data?.error || "Error saving.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Sinhala:wght@400;600&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
      <div style={s.wrap}>
        <div style={s.card}>
          <div style={s.header}>
            <p style={s.tag}>Admin Panel</p>
            <p style={s.title}>WH Question — Add Set</p>
            <p style={s.sub}>
              Record or upload audio · question text auto-fills from speech.
            </p>
          </div>

          <div style={s.body}>
            {message && (
              <div style={s.alert(isError)}>
                <div style={s.dot(isError)} />
                {message}
              </div>
            )}

            <form key={formKey} onSubmit={handleSubmit}>
              {/* Level */}
              <div style={s.field}>
                <label style={s.label}>Difficulty Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  style={s.select}
                >
                  <option value="easy">Easy — 2 answer options</option>
                  <option value="medium">Medium — 3 answer options</option>
                  <option value="hard">Hard — 4 answer options</option>
                </select>
              </div>

              {/* WH Type */}
              <div style={s.field}>
                <label style={s.label}>WH Question Type</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {WH_TYPES.map((wh) => (
                    <button
                      key={wh}
                      type="button"
                      onClick={() => setWhType(wh)}
                      style={{
                        padding: "7px 14px",
                        borderRadius: 8,
                        border: `1px solid ${whType === wh ? "#1a1a2e" : "#e2e2ee"}`,
                        background: whType === wh ? "#1a1a2e" : "#fff",
                        color: whType === wh ? "#fff" : "#1a1a2e",
                        fontFamily: "'Noto Serif Sinhala',serif",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {wh}
                      <span
                        style={{
                          display: "block",
                          fontSize: 10,
                          opacity: 0.6,
                          fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        {WH_HINTS[wh]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scene Audio */}
              <div style={s.field}>
                <label style={s.label}>Scene Audio</label>
                <AudioInput
                  key={`scene-${formKey}`}
                  resetKey={formKey}
                  label="Scene"
                  hint='e.g. "ළමයා ගෙදරදී බත් කනවා"'
                  onFileReady={setSceneAudio}
                />
              </div>

              {/* Question Audio */}
              <div style={s.field}>
                <label style={s.label}>
                  Question Audio{" "}
                  <span style={s.hint}>text auto-fills below</span>
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
              <div style={s.field}>
                <label style={s.label}>
                  Question Text <span style={s.hint}>edit if needed</span>
                </label>
                <input
                  value={questionText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder={`e.g. ළමයා ${whType}?`}
                  style={s.input(false)}
                />
              </div>

              <div style={s.divider} />

              {/* Options */}
              <div style={s.field}>
                <label style={s.label}>
                  Answer Options{" "}
                  <span style={s.hint}>Sinhala · select correct answer</span>
                </label>
                {options.map((opt, i) => (
                  <div key={i} style={s.optRow(correctIndex === i)}>
                    <input
                      type="radio"
                      name="correct"
                      checked={correctIndex === i}
                      onChange={() => setCorrect(i)}
                      style={{
                        accentColor: "#1a7a4a",
                        width: 14,
                        height: 14,
                        flexShrink: 0,
                      }}
                    />
                    <span style={correctIndex === i ? s.radioLbl : s.radioOff}>
                      {correctIndex === i ? "Correct" : `Option ${i + 1}`}
                    </span>
                    <input
                      value={opt}
                      required
                      onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={`Sinhala answer ${i + 1}`}
                      style={{
                        ...s.input(correctIndex === i),
                        flex: 1,
                        width: "auto",
                      }}
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...s.submit,
                  background: loading ? "#aaaacc" : "#1a1a2e",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
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
