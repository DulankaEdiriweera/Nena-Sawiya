import React, { useEffect, useState } from "react";
import axios from "axios";

import Header from "./Header";
import ProgressCardELD from "./ProgressCardELD";
import ProgressCardRLD from "./ProgressCardRLD";
import ProgressCardVC from "./ProgressCardVC";
import ProgressCardVD from "./ProgressCardVD"; // ✅ Import VD card

const Progress = () => {
  const [progress, setProgress] = useState(null);
  const [rldProgress, setRldProgress] = useState(null);
  const [vcProgress, setVcProgress] = useState(null);
  const [vdProgress, setVdProgress] = useState(null); // ✅ VD state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchProgress(),
      fetchRldProgress(),
      fetchVcProgress(),
      fetchVdProgress(), // ✅ Fetch VD progress
    ]).finally(() => setLoading(false));
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/eld/latest_progress",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setProgress(res.data);
    } catch {
      setProgress(null);
    }
  };

  const fetchRldProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/rld/latest_rld_progress",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setRldProgress(res.data);
    } catch {
      setRldProgress(null);
    }
  };

  const fetchVcProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/vc/latest_progress",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setVcProgress(res.data);
    } catch {
      setVcProgress(null);
    }
  };

  // ✅ New VD fetch function
  const fetchVdProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/vd/latest_vd_progress",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setVdProgress(res.data);
    } catch {
      setVdProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto py-10 px-4 space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            📊 ශිෂ්‍ය ප්‍රගති විශ්ලේෂණය
          </h1>
        </div>

        {loading && (
          <div className="text-center text-gray-500">
            ප්‍රගති දත්ත පූරණය වෙමින් පවතී...
          </div>
        )}

        {!loading &&
          !progress &&
          !rldProgress &&
          !vcProgress &&
          !vdProgress && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
              <p className="text-gray-600">තවමත් ප්‍රගති දත්ත නොමැත.</p>
            </div>
          )}

        {!loading && (
          <>
            {progress && <ProgressCardELD progress={progress} />}
            {rldProgress && <ProgressCardRLD progress={rldProgress} />}
            {vcProgress && <ProgressCardVC progress={vcProgress} />}
            {vdProgress && <ProgressCardVD progress={vdProgress} />}{" "}
            {/* ✅ Render VD card */}
          </>
        )}
      </div>
    </div>
  );
};

export default Progress;
