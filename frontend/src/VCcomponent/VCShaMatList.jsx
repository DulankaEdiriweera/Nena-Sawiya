import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VCShaMatList() {
  const [level, setLevel] = useState("easy");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();

  const fetchList = async (lvl) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/vc_sha_mat/all?level=${encodeURIComponent(lvl)}`
      );
      setItems(res.data);
    } catch (e) {
      console.error(e);
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchList(level);
  }, [level]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Shadow Match Activities</h2>

      <div style={{ marginTop: 10 }}>
        <label>Level: </label>
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
      </div>

      {loading ? (
        <p style={{ marginTop: 16 }}>Loading...</p>
      ) : items.length === 0 ? (
        <p style={{ marginTop: 16 }}>No Shadow Match activities for {level}.</p>
      ) : (
        <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
          {items.map((it) => (
            <div
              key={it.activity_id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <b>{it.title}</b>
              <div style={{ opacity: 0.8 }}>
                Task: {it.task_number ?? "-"} • Levels: {(it.levels || []).join(", ")}
              </div>

              <div style={{ marginTop: 10, display: "flex", gap: 12, alignItems: "center" }}>
                <img
                  src={`http://localhost:5000${it.shadow_url}`}
                  alt="shadow preview"
                  style={{
                    width: 120,
                    height: 90,
                    objectFit: "cover",
                    borderRadius: 10,
                    border: "1px solid #eee",
                    background: "#fff",
                  }}
                />

                <button
                  onClick={() => nav(`/vcShadowMatch/${it.activity_id}`)}
                  style={{ padding: "10px 14px" }}
                >
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}