import React from "react";

export default function ProgressCardVC({ progress }) {
  if (!progress) return null;

  const improved = progress.percentage_change > 0;
  const same = progress.percentage_change === 0;

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        🧩 Progress Overview of VC
      </h2>

      <div className="space-y-3 text-base">
        <p>
          <strong>Previous Score:</strong> {progress.previous_percentage}%
        </p>
        <p>
          <strong>Latest Score:</strong> {progress.latest_percentage}%
        </p>

        <p>
          <strong>Change:</strong>{" "}
          {improved ? (
            <span className="text-green-600 font-semibold">
              +{progress.percentage_change}%
            </span>
          ) : same ? (
            <span className="text-gray-600 font-semibold">0%</span>
          ) : (
            <span className="text-red-600 font-semibold">
              {progress.percentage_change}%
            </span>
          )}
        </p>

        <hr className="my-2" />

        <p>
          <strong>Previous Level (Rule):</strong> {progress.previous_rule_level}
        </p>
        <p>
          <strong>Latest Level (Rule):</strong> {progress.latest_rule_level}
        </p>

        <p>
          <strong>Latest Sinhala Level:</strong> {progress.latest_vc_level_si}
        </p>

        <p className="text-sm text-gray-500 pt-2">
          ⭐ Tip: Do the VC activities regularly to improve your score!
        </p>
      </div>
    </div>
  );
}