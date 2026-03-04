import React, { useEffect, useState } from "react";
import axios from "axios";

export default function VCPicComPlay({ activityId }) {
  const apiBase = "http://localhost:5000";

  const [meta, setMeta] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [startTs, setStartTs] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [seconds, setSeconds] = useState(null);
  const [selectedOptId, setSelectedOptId] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    async function load() {
      setMeta(null);
      setAttempts(0);
      setCompleted(false);
      setSeconds(null);
      setSelectedOptId(null);
      setIsCorrect(null);

      const res = await axios.get(`${apiBase}/api/vc_pic_com/${activityId}`);
      setMeta(res.data);
      setStartTs(Date.now());
    }
    if (activityId) load();
  }, [activityId]);

  const handlePick = (opt) => {
    if (completed) return;

    setAttempts((a) => a + 1);
    setSelectedOptId(opt.id);

    if (opt.is_correct) {
      setIsCorrect(true);
      setCompleted(true);
      setSeconds(Math.round((Date.now() - startTs) / 1000));
    } else {
      setIsCorrect(false);
    }
  };

  if (!meta) return <div style={{ padding: 24 }}>Loading activity...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>{meta.title}</h2>

      <div style={{ opacity: 0.85, marginBottom: 14 }}>
        Level: <b>{(meta.levels || [])[0]}</b> • Attempts:{" "}
        <b>{attempts}</b> • Status: <b>{completed ? "✅ Completed" : "In progress"}</b>
        {completed && <> • Time: <b>{seconds}s</b></>}
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        {/* QUESTION */}
        <div>
          <h3>Question</h3>
          <img
            src={`${apiBase}${meta.question_url}`}
            alt="question"
            style={{ width: 520, borderRadius: 12, border: "1px solid #ddd" }}
            draggable={false}
          />
          <div style={{ marginTop: 8, color: "#666", fontSize: 13 }}>
            Choose the correct missing part.
          </div>
        </div>

        {/* OPTIONS */}
        <div>
          <h3>Options</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 170px)",
              gap: 12,
              padding: 12,
              background: "#fff",
              borderRadius: 14,
              border: "1px solid #ddd",
              width: "fit-content",
            }}
          >
            {(meta.options || []).map((opt) => (
              <button
                key={opt.id}
                onClick={() => handlePick(opt)}
                disabled={completed}
                style={{
                  padding: 10,
                  borderRadius: 12,
                  border:
                    selectedOptId === opt.id
                      ? opt.is_correct
                        ? "2px solid #2e7d32"
                        : "2px solid #c62828"
                      : "1px solid #ddd",
                  background: "#fafafa",
                  cursor: completed ? "not-allowed" : "pointer",
                }}
              >
                <img
                  src={`${apiBase}${opt.thumb_url || opt.url}`}
                  alt={opt.id}
                  style={{
                    width: 150,
                    height: 150,
                    objectFit: "contain",   // ✅ NO CROP
                    background: "#fff",
                    borderRadius: 10,
                    border: "1px solid #eee",
                  }}
                  draggable={false}
                />
              </button>
            ))}
          </div>

          {isCorrect === true && (
            <div
              style={{
                marginTop: 12,
                padding: 10,
                borderRadius: 10,
                background: "#eaffea",
                border: "1px solid #9aff9a",
              }}
            >
              Correct! ✅
            </div>
          )}

          {isCorrect === false && (
            <div
              style={{
                marginTop: 12,
                padding: 10,
                borderRadius: 10,
                background: "#ffeaea",
                border: "1px solid #ff9a9a",
              }}
            >
              Not correct ❌ Try again.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}