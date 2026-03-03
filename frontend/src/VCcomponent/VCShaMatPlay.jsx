import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function VCShaMatPlay({ activityId }) {
  const apiBase = "http://localhost:5000";

  const [meta, setMeta] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [startTs, setStartTs] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [seconds, setSeconds] = useState(null);
  const [feedback, setFeedback] = useState(null); // {ok:boolean, text:string}

  useEffect(() => {
    async function load() {
      setMeta(null);
      setAttempts(0);
      setCompleted(false);
      setSeconds(null);
      setFeedback(null);

      const res = await axios.get(`${apiBase}/api/vc_sha_mat/${activityId}`);
      setMeta(res.data);
      setStartTs(Date.now());
    }
    if (activityId) load();
  }, [activityId]);

  const options = useMemo(() => meta?.options || [], [meta]);

  const pick = (opt) => {
    if (completed) return;

    setAttempts((a) => a + 1);

    if (opt.is_correct) {
      setCompleted(true);
      setSeconds(Math.round((Date.now() - startTs) / 1000));
      setFeedback({ ok: true, text: "✅ Great job! That’s correct!" });
    } else {
      setFeedback({ ok: false, text: "❌ Oops! Try again!" });
    }
  };

  const reset = () => {
    if (!meta) return;
    setAttempts(0);
    setCompleted(false);
    setSeconds(null);
    setFeedback(null);
    setStartTs(Date.now());
  };

  if (!meta) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <h2>{meta.title}</h2>

      <div style={{ opacity: 0.85, marginBottom: 14 }}>
        Moves: <b>{attempts}</b> • Status: <b>{completed ? "✅ Completed" : "In progress"}</b>
        {completed && <> • Time: <b>{seconds}s</b></>}
      </div>

      {feedback && (
        <div
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid",
            borderColor: feedback.ok ? "#9aff9a" : "#ffb3b3",
            background: feedback.ok ? "#eaffea" : "#ffeaea",
            marginBottom: 14,
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          {feedback.text}
        </div>
      )}

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* Shadow */}
        <div style={{ flex: "0 0 auto" }}>
          <h3>Shadow</h3>
          <div
            style={{
              width: 360,
              height: 260,
              borderRadius: 16,
              border: "1px solid #ddd",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src={`${apiBase}${meta.shadow_url}`}
              alt="shadow"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              draggable={false}
            />
          </div>

          <button
            onClick={reset}
            style={{ marginTop: 12, padding: "10px 14px" }}
          >
            Reset
          </button>
        </div>

        {/* Options */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <h3>Pick the correct picture</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 12,
            }}
          >
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => pick(opt)}
                disabled={completed}
                style={{
                  borderRadius: 16,
                  border: "2px solid #e5e5e5",
                  background: "#fff",
                  padding: 8,
                  cursor: completed ? "not-allowed" : "pointer",
                }}
              >
                <img
                  src={`${apiBase}${opt.url}`}
                  alt="option"
                  style={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 12,
                    display: "block",
                  }}
                  draggable={false}
                />
                <div style={{ marginTop: 6, fontWeight: 700 }}>
                  Choose
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Reference (optional for kids, show only when completed) */}
        {/* <div style={{ flex: "0 0 auto" }}>
          <h3>Answer</h3>
          <div
            style={{
              width: 280,
              height: 200,
              borderRadius: 16,
              border: "1px solid #ddd",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              opacity: completed ? 1 : 0.25,
            }}
            title={completed ? "Correct image" : "Unlock after correct"}
          >
            <img
              src={`${apiBase}${meta.original_url}`}
              alt="original"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              draggable={false}
            />
          </div>
        </div> */}
      </div>
    </div>
  );
}