import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import jigsawAudio from "../Assets/VisualC/audio/jigsaw.mp3";
import Swal from "sweetalert2";

const ABILITY_CONFIG = {
  Weak: { label: "පහසු", color: "bg-green-400", text: "text-green-700" },
  Average: { label: "මධ්‍යම", color: "bg-yellow-400", text: "text-yellow-700" },
  High: { label: "දුෂ්කර", color: "bg-rose-400", text: "text-rose-700" },
};

export default function VCJigsawList() {
  const [ability, setAbility] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adaptive, setAdaptive] = useState(null);

  const [audio] = useState(new Audio(jigsawAudio));

  const playAudio = () => {
    audio.pause(); // prevents overlap
    audio.currentTime = 0;
    audio.play();
  };

  const nav = useNavigate();

  // -----------------------------
  // FETCH ADAPTIVE STATUS
  // -----------------------------
  const fetchAdaptive = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/vc_adaptive/status?activity=jigsaw",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setAdaptive(res.data);
      setAbility(res.data.recommended);
    } catch (err) {
      console.error(err);
    }
  };

  // -----------------------------
  // FETCH PUZZLES
  // -----------------------------
  const fetchList = async (ab) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/vc_jigsaw/all?ability=${ab}`,
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
    if (adaptive && ability) {
      fetchList(ability);
    }
  }, [adaptive, ability]);

  // -----------------------------
  // LEVEL SELECT LOGIC (FINAL)
  // -----------------------------
  const handleSelectLevel = (level) => {
    if (!adaptive) return;

    const { ability: userAbility, unlocked_levels } = adaptive;

    // 🔒 LOCK CHECK
    if (!unlocked_levels.includes(level)) {
      Swal.fire({
        icon: "error",
        title: "අගුළු දමා ඇත 🔒",
        text: "පෙර මට්ටම මුලින්ම සම්පූර්ණ කරන්න!",
        confirmButtonText: "හරි",
      });
      return;
    }

    // =========================
    // WEAK STUDENT
    // =========================
    if (userAbility === "Weak") {
      // No warning at all
      setAbility(level);
      return;
    }

    // =========================
    // AVERAGE STUDENT
    // =========================
    if (userAbility === "Average") {
      if (level === "Weak") {
        Swal.fire({
          icon: "warning",
          title: "ඔබට විශ්වාසද?",
          text: "මධ්‍යම මට්ටමෙන් ආරම්භ කිරීමට අපි ඔබට නිර්දේශ කරමු.",
          showCancelButton: true,
          confirmButtonText: "ඔව්, ඉදිරියට යන්න",
          cancelButtonText: "අවලංගු කරන්න",
        }).then((result) => {
          if (result.isConfirmed) {
            setAbility(level);
          }
        });
        return;
      }

      // Medium → no warning
      setAbility(level);
      return;
    }

    // =========================
    // HIGH STUDENT
    // =========================
    if (userAbility === "High") {
      if (level === "Weak" || level === "Average") {
        Swal.fire({
          icon: "warning",
          title: "ඔබට විශ්වාසද?",
          text: "දුෂ්කර මට්ටමෙන් ආරම්භ කිරීමට අපි ඔබට නිර්දේශ කරමු.",
          showCancelButton: true,
          confirmButtonText: "ඔව්, ඉදිරියට යන්න",
          cancelButtonText: "අවලංගු කරන්න",
        }).then((result) => {
          if (result.isConfirmed) {
            setAbility(level);
          }
        });
        return;
      }

      // Hard → no warning
      setAbility(level);
      return;
    }
  };

  return (
    <div>
      <Header />

      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🧩</div>
          <h1 className="text-4xl font-extrabold text-indigo-700">
            රූප ප්‍රහේලිකාව සම්පූර්ණ කරන්න!
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
          {Object.entries(ABILITY_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => handleSelectLevel(key)}
              className={`
                px-5 py-3 rounded-xl font-bold
                ${ability === key ? `${cfg.color} text-white` : `bg-white ${cfg.text}`}
              `}
            >
              {cfg.label}
            </button>
          ))}
        </div>

        {/* PUZZLE LIST */}
        {loading ? (
          <p className="text-center font-bold">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            {items.map((it) => (
              <div
                key={it.puzzle_id}
                className="bg-white p-3 rounded-xl shadow"
              >
                <img
                  src={`http://localhost:5000${it.original_url}`}
                  alt=""
                  className="h-32 w-full object-cover rounded"
                />

                <p className="font-bold mt-2">{it.title}</p>

                <button
                  onClick={() => nav(`/vcJigsaw/${it.puzzle_id}`)}
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
