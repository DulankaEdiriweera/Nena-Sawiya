import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminVCPicComList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/vc_pic_com/all");
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

  const handleDelete = async (activityId) => {
    if (!window.confirm("Delete this activity?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/vc_pic_com/${activityId}`);
      load();
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin - All Picture Completion Activities</h2>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No activities added yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {items.map((it) => (
            <div
              key={it.activity_id}
              style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}
            >
              <b>{it.title}</b>
              <div style={{ opacity: 0.8 }}>
                activity_id: {it.activity_id} • Level: {(it.levels || [])[0]}
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
                <img
                  src={`http://localhost:5000${it.question_url}`}
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
                    onClick={() => nav(`/vcPicCom/${it.activity_id}`)}
                    style={{ padding: "10px 14px" }}
                  >
                    Test / Play
                  </button>

                  <button
                    onClick={() => handleDelete(it.activity_id)}
                    style={{ padding: "10px 14px", background: "#ffeaea", border: "1px solid #ffb3b3" }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Options</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(it.options || []).map((o) => (
                    <img
                      key={o.id}
                      src={`http://localhost:5000${o.thumb_url || o.url}`}
                      alt={o.id}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "contain",
                        background: "#fff",
                        borderRadius: 8,
                        border: o.is_correct ? "2px solid #2e7d32" : "1px solid #eee",
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