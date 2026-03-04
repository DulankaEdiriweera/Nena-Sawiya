import React, { useEffect, useState } from "react";
import ProgressCardELD from "./ProgressCardELD";
//RLD
import ProgressCardRLD from "./ProgressCardRLD";

import ProgressCardVC from "./ProgressCardVC"; 

import axios from "axios";

const Progress = () => {
  const [progress, setProgress] = useState(null);
  //RLD
  const [rldProgress, setRldProgress] = useState(null);

    const [vcProgress, setVcProgress] = useState(null);

  useEffect(() => {
    fetchProgress();
    //RLD
    fetchRldProgress();

    fetchVcProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/eld/latest_progress",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProgress(res.data);
    } catch (err) {
      console.log("No progress data yet");
      setProgress(null); // No data
    }
  };
  //RLD
  const fetchRldProgress = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/rld/latest_rld_progress",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setRldProgress(res.data);
    } catch (err) {
      console.log("No RLD progress data yet");
      setRldProgress(null);
    }
  };
  //VC
   const fetchVcProgress = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/vc/latest_progress",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVcProgress(res.data);
    } catch (err) {
      console.log("No VC progress data yet");
      setVcProgress(null);
    }
  };


  // If no progress data, show a message or nothing
  if (!progress && !rldProgress && !vcProgress) {
    return (
      <div className="text-center mt-10 p-6 text-gray-600">
         තවමත් ප්‍රගති දත්ත නොමැත.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Render all cards only if progress data exists */}
      <ProgressCardELD progress={progress} />
      {/* RLD */}
      {rldProgress && <ProgressCardRLD progress={rldProgress} />}

      {vcProgress && <ProgressCardVC progress={vcProgress} />}

    </div>
  );
};

export default Progress;
