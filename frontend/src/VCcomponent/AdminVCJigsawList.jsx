import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminVCJigsawList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/vc_jigsaw/all");
      setItems(res.data);
    } catch (e) {
      console.error(e);
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (puzzleId) => {
    if (!window.confirm("Delete this jigsaw?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/vc_jigsaw/${puzzleId}`);
      load();
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin - All VC Jigsaws</h2>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No jigsaws added yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {items.map((it) => (
            <div
              key={it.puzzle_id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <b>{it.title}</b>
              <div style={{ opacity: 0.8 }}>
                puzzle_id: {it.puzzle_id} • Grid: {it.rows}×{it.cols} • Ability:{" "}
                {(it.ability_levels || []).join(", ")}
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
                <img
                  src={`http://localhost:5000${it.original_url}`}
                  alt="preview"
                  style={{
                    width: 180,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 10,
                    border: "1px solid #eee",
                  }}
                />

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <button
                    onClick={() => nav(`/vcJigsaw/${it.puzzle_id}`)}
                    style={{ padding: "10px 14px" }}
                  >
                    Test / Play
                  </button>

                  <button
                    onClick={() => handleDelete(it.puzzle_id)}
                    style={{ padding: "10px 14px", background: "#ffeaea", border: "1px solid #ffb3b3" }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* show first few tiles (proof split worked) */}
              <div style={{ marginTop: 10 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Tiles (first 8)</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 45px)", gap: 6 }}>
                  {(it.pieces || []).slice(0, 8).map((p) => (
                    <img
                      key={p.index}
                      src={`http://localhost:5000${p.url}`}
                      alt={`tile-${p.index}`}
                      style={{
                        width: 45,
                        height: 45,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #eee",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}