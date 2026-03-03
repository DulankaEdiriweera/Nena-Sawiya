import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VCPicComList() {
  const [level, setLevel] = useState("easy");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const fetchList = async (lvl) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/vc_pic_com/all?level=${encodeURIComponent(lvl)}`
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
      <h2>Picture Completion Activities</h2>

      <div style={{ marginTop: 10 }}>
        <label>Level: </label>
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="easy">easy (4×4)</option>
          <option value="medium">medium (3×3)</option>
          <option value="hard">hard (2×2)</option>
        </select>
      </div>

      {loading ? (
        <p style={{ marginTop: 16 }}>Loading...</p>
      ) : items.length === 0 ? (
        <p style={{ marginTop: 16 }}>No activities found for {level}.</p>
      ) : (
        <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
          {items.map((it) => (
            <div
              key={it.activity_id}
              style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}
            >
              <b>{it.title}</b>
              <div style={{ opacity: 0.8 }}>
                Grid: {it.rows}×{it.cols} • Task: {it.task_number ?? "-"}
              </div>

              <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center" }}>
                <img
                  src={`http://localhost:5000${it.question_url}`}
                  alt="preview"
                  style={{
                    width: 140,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid #eee",
                  }}
                />

                <button
                  onClick={() => nav(`/vcPicCom/${it.activity_id}`)}
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