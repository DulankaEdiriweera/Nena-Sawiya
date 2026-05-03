import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import piccomAudio from "../Assets/VisualC/audio/piccom.mp3";
import Swal from "sweetalert2";

const LEVEL_CONFIG = {
  easy: {
    label: "පහසු",
    color: "bg-green-400",
    border: "border-green-300",
    text: "text-green-700",
  },
  medium: {
    label: "මධ්‍යම",
    color: "bg-yellow-400",
    border: "border-yellow-300",
    text: "text-yellow-700",
  },
  hard: {
    label: "දුෂ්කර",
    color: "bg-rose-400",
    border: "border-rose-300",
    text: "text-rose-700",
  },
};

export default function VCPicComList() {
  const [level, setLevel] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adaptive, setAdaptive] = useState(null);

  const [audio] = useState(new Audio(piccomAudio));

  const playAudio = () => {
    audio.pause(); // prevents overlap
    audio.currentTime = 0;
    audio.play();
  };

  const nav = useNavigate();

  // FETCH ADAPTIVE
  const fetchAdaptive = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/vc_adaptive/status?activity=piccom",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setAdaptive(res.data);

      if (res.data.recommended === "Weak") setLevel("easy");
      if (res.data.recommended === "Average") setLevel("medium");
      if (res.data.recommended === "High") setLevel("hard");
    } catch (err) {
      console.error(err);
    }
  };

  // FETCH LIST
  const fetchList = async (lvl) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/vc_pic_com/all?level=${encodeURIComponent(lvl)}`,
      );
      setItems(res.data);
    } catch (e) {
      console.error(e);
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdaptive();
  }, []);

  useEffect(() => {
    if (adaptive && level) {
      fetchList(level);
    }
  }, [adaptive, level]);

  // LEVEL SELECT LOGIC
  const handleSelectLevel = (lvl) => {
    if (!adaptive) return;

    const { ability, unlocked_levels } = adaptive;

    const mapToBackend = {
      easy: "Weak",
      medium: "Average",
      hard: "High",
    };

    const backendLevel = mapToBackend[lvl];

    // LOCK
    if (!unlocked_levels.includes(backendLevel)) {
      Swal.fire({
        icon: "error",
        title: "අගුළු දමා ඇත 🔒",
        text: "පෙර මට්ටම මුලින්ම සම්පූර්ණ කරන්න!",
        confirmButtonText: "හරි",
      });
      return;
    }

    // WEAK
    if (ability === "Weak") {
      setLevel(lvl);
      return;
    }

    // AVERAGE
    if (ability === "Average") {
      if (lvl === "easy") {
        Swal.fire({
          icon: "warning",
          title: "ඔබට විශ්වාසද?",
          text: "අපි ඔබට මධ්‍යම මට්ටමින් ආරම්භ කිරීමට යෝජනා කරමු",
          showCancelButton: true,
          confirmButtonText: "ඔව්, ඉදිරියට යන්න",
          cancelButtonText: "අවලංගු කරන්න",
        }).then((r) => {
          if (r.isConfirmed) setLevel(lvl);
        });
        return;
      }
      setLevel(lvl);
      return;
    }

    // HIGH
    if (ability === "High") {
      if (lvl === "easy" || lvl === "medium") {
        Swal.fire({
          icon: "warning",
          title: "ඔබට විශ්වාසද?",
          text: "අපි ඔබට දුෂ්කර මට්ටමින් ආරම්භ කිරීමට යෝජනා කරමු",
          confirmButtonText: "ඔව්, ඉදිරියට යන්න",
          cancelButtonText: "අවලංගු කරන්න",
          showCancelButton: true,
        }).then((r) => {
          if (r.isConfirmed) setLevel(lvl);
        });
        return;
      }
      setLevel(lvl);
      return;
    }
  };

  return (
    <div>
      <div>
        <Header />
      </div>

      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🖼️</div>
          <h1 className="text-4xl font-extrabold text-indigo-700">
            රූපය සම්පූර්ණ කරන්න!
          </h1>

          <button
            onClick={playAudio}
            className="mt-3 px-5 py-2 rounded-xl bg-indigo-500 text-white font-bold shadow"
          >
            🔊 උපදෙස් අහන්න
          </button>

          <div className="mt-4">
            <button
              onClick={() => nav("/vcStudentDashboard")}
              className="px-5 py-2 rounded-xl bg-white text-indigo-600 font-bold shadow"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* LEVEL BUTTONS */}
        <div className="flex justify-center gap-3 mb-8">
          {Object.entries(LEVEL_CONFIG).map(([key, c]) => (
            <button
              key={key}
              onClick={() => handleSelectLevel(key)}
              className={`
                px-5 py-3 rounded-xl font-bold
                ${level === key ? `${c.color} text-white` : `bg-white ${c.text}`}
              `}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* LIST */}
        {loading ? (
          <p className="text-center font-bold">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            {items.map((it) => (
              <div
                key={it.activity_id}
                className="bg-white p-3 rounded-xl shadow"
              >
                <img
                  src={`http://localhost:5000${it.question_url}`}
                  alt=""
                  className="h-32 w-full object-cover rounded"
                />

                <p className="font-bold mt-2">{it.title}</p>

                <button
                  onClick={() => nav(`/vcPicCom/${it.activity_id}`)}
                  className="mt-2 w-full bg-indigo-500 text-white py-2 rounded"
                >
                  ▶ Start
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
