import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VCJigsawList() {
  const [ability, setAbility] = useState("Weak");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();

  const fetchList = async (ab) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/vc_jigsaw/all?ability=${encodeURIComponent(ab)}`
      );
      setItems(res.data);
    } catch (e) {
      console.error(e);
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchList(ability);
  }, [ability]);

  return (
    <div style={{ padding: 24 }}>
      <h2>VC Jigsaw Activities</h2>

      <div style={{ marginTop: 10 }}>
        <label>Ability: </label>
        <select value={ability} onChange={(e) => setAbility(e.target.value)}>
          <option value="Weak">Weak</option>
          <option value="Average">Average</option>
          <option value="High">High</option>
        </select>
      </div>

      {loading ? (
        <p style={{ marginTop: 16 }}>Loading...</p>
      ) : items.length === 0 ? (
        <p style={{ marginTop: 16 }}>No jigsaws found for {ability}.</p>
      ) : (
        <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
          {items.map((it) => (
            <div
              key={it.puzzle_id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: 12,
              }}
            >
              <b>{it.title}</b>
              <div style={{ opacity: 0.8 }}>
                Grid: {it.rows}×{it.cols} • Task: {it.task_number ?? "-"}
              </div>

              <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center" }}>
                <img
                  src={`http://localhost:5000${it.original_url}`}
                  alt="preview"
                  style={{ width: 120, height: 90, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }}
                />

                <button
                  onClick={() => nav(`/vcJigsaw/${it.puzzle_id}`)}
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