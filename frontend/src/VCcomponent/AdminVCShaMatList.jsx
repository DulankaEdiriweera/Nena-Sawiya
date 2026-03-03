import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../Components/AdminHeader";

export default function AdminVCShaMatList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/vc_sha_mat/all");
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
    if (!window.confirm("Delete this Shadow Match activity?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/vc_sha_mat/${activityId}`);
      load();
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };

  return (
    <div>
      <div><AdminHeader/></div>
          <div style={{ padding: 24 }}>
      <h2>Admin - All Shadow Match Activities</h2>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No Shadow Match activities added yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
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
                activity_id: {it.activity_id} • Task: {it.task_number ?? "-"} • Levels:{" "}
                {(it.levels || []).join(", ")}
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
                <img
                  src={`http://localhost:5000${it.shadow_url}`}
                  alt="shadow"
                  style={{
                    width: 180,
                    height: 120,
                    objectFit: "contain",
                    borderRadius: 10,
                    border: "1px solid #eee",
                    background: "#fff",
                  }}
                />

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <button
                    onClick={() => nav(`/vcShadowMatch/${it.activity_id}`)}
                    style={{ padding: "10px 14px" }}
                  >
                    Test / Play
                  </button>

                  <button
                    onClick={() => handleDelete(it.activity_id)}
                    style={{
                      padding: "10px 14px",
                      background: "#ffeaea",
                      border: "1px solid #ffb3b3",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Options</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 60px)", gap: 8 }}>
                  {(it.options || []).slice(0, 6).map((o) => (
                    <img
                      key={o.id}
                      src={`http://localhost:5000${o.url}`}
                      alt={o.id}
                      style={{
                        width: 60,
                        height: 45,
                        objectFit: "cover",
                        borderRadius: 10,
                        border: o.is_correct ? "2px solid #2e7d32" : "1px solid #ddd",
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
    </div>
  );
}