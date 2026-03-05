import React from "react";

const levelMap = {
  High: "ඉතා හොදයි",
  Average: "සාමාන්‍ය",
  Weak: "දුර්වල",
};

export default function ProgressCardVC({ progress }) {
  if (!progress) {
    return (
      <p className="text-gray-500 text-center mt-6">
        ප්‍රගතිය පූරණය වෙමින් පවතී...
      </p>
    );
  }

  const change = Number(progress.percentage_change ?? 0);

  return (
    <div className="max-w-xl mx-auto mt-10 bg-gray-50 pb-10">
      <div className="bg-white shadow-md rounded-2xl p-6 max-w-lg mx-auto mt-8 border border-gray-100">
        {/* Header Box */}
        <div className="bg-yellow-50 rounded-xl p-4 mb-6 text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-yellow-500">
            දෘශ්‍ය සම්පූර්ණතා (Visual Closure) ප්‍රගති විශ්ලේෂණය
          </h2>
        </div>

        {/* Data Section */}
        <div className="space-y-4 text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">පෙර ලකුණු:</span>
            <span>{progress.previous_percentage}%</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">නවතම ලකුණු:</span>
            <span>{progress.latest_percentage}%</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">ප්‍රගතිය:</span>
            {change > 0 ? (
              <span className="text-green-600 font-semibold">
                +{progress.percentage_change}%
              </span>
            ) : (
              <span className="text-red-600 font-semibold">
                {progress.percentage_change}%
              </span>
            )}
          </div>

          <div className="flex justify-between">
            <span className="font-medium">පෙර මට්ටම:</span>
            <span>
              {levelMap[progress.previous_rule_level] ||
                progress.previous_rule_level}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">නවතම මට්ටම:</span>
            <span>
              {levelMap[progress.latest_rule_level] || progress.latest_rule_level}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}