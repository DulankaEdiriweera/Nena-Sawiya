// src/RldDirection/DirectionDragDrop.jsx
import React, { useState } from "react";

// Which zones are active per level
const LEVEL_ZONES = {
  easy: ["left", "right"],
  medium: ["left", "right", "top"],
  hard: ["left", "right", "top", "bottom"],
};

const ZONE_LABELS = {
  left: "වමට",
  right: "දකුණට",
  top: "උඩ",
  bottom: "යට",
};

// Drag using HTML5 drag-and-drop API (simpler, works on desktop + touch via polyfill)
const DirectionDragDrop = ({ levelData, onSubmit, showResults = false }) => {
  // droppedZones: { zone -> image_url }
  const [droppedZones, setDroppedZones] = useState({});
  const [dragItem, setDragItem] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  if (!levelData) return null;

  const zones = LEVEL_ZONES[levelData.level] || ["left", "right"];
  const allPlaced = zones.every((z) => droppedZones[z]);
  // Options not yet placed in any zone
  const placedUrls = Object.values(droppedZones);
  const trayOpts = levelData.options.filter(
    (o) => !placedUrls.includes(o.image_url),
  );

  const handleDrop = (zone) => {
    if (!dragItem || showResults) return;
    // If zone already has an image, return it to tray (remove from zone)
    setDroppedZones((prev) => {
      const updated = { ...prev };
      // Remove this image from any other zone it was in
      Object.keys(updated).forEach((z) => {
        if (updated[z] === dragItem) delete updated[z];
      });
      updated[zone] = dragItem;
      return updated;
    });
    setDragItem(null);
    setShowWarning(false);
  };

  const removeFromZone = (zone) => {
    if (showResults) return;
    setDroppedZones((prev) => {
      const u = { ...prev };
      delete u[zone];
      return u;
    });
  };

  const handleSubmit = () => {
    if (!allPlaced) {
      setShowWarning(true);
      return;
    }
    const answers = zones.map((zone) => ({
      image_url: droppedZones[zone],
      dropped_zone: zone,
    }));
    onSubmit(answers);
  };

  const ZoneBox = ({ zone }) => {
    const filledUrl = droppedZones[zone];
    return (
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop(zone)}
        onClick={() => filledUrl && removeFromZone(zone)}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition
          ${
            filledUrl
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50"
          }`}
        style={{
          width: 90,
          height: 90,
          cursor: filledUrl ? "pointer" : "default",
        }}
        title={filledUrl ? "Click to remove" : ZONE_LABELS[zone]}
      >
        {filledUrl ? (
          <>
            <img
              src={filledUrl}
              alt={zone}
              className="rounded-lg"
              style={{ width: 64, height: 64, objectFit: "cover" }}
            />
            <p className="text-xs text-indigo-600 font-semibold mt-1">
              {ZONE_LABELS[zone]}
            </p>
          </>
        ) : (
          <>
            <p className="text-2xl text-gray-300">+</p>
            <p className="text-xs text-gray-400 font-medium">
              {ZONE_LABELS[zone]}
            </p>
          </>
        )}
      </div>
    );
  };

  const hasTop = zones.includes("top");
  const hasBottom = zones.includes("bottom");

  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-800 mb-6 text-center">
        {levelData.question}
      </h4>

      {/* ── Central layout: zones around the scene image ── */}
      <div className="flex flex-col items-center gap-2">
        {/* Top zone */}
        {hasTop && <ZoneBox zone="top" />}

        {/* Middle row: left zone + scene image + right zone */}
        <div className="flex items-center gap-4">
          <ZoneBox zone="left" />

          {/* Scene image */}
          <div className="border-4 border-indigo-400 rounded-2xl shadow-xl p-2 bg-indigo-50">
            <img
              src={levelData.scene_image_url}
              alt="scene"
              draggable={false}
              className="rounded-xl"
              style={{ width: 180, height: 180, objectFit: "contain" }}
            />
          </div>

          <ZoneBox zone="right" />
        </div>

        {/* Bottom zone */}
        {hasBottom && <ZoneBox zone="bottom" />}
      </div>

      {/* ── Option tray ── */}
      <div className="mt-8">
        <p className="font-medium text-gray-700 mb-3 text-center">
          විකල්ප — ඇදගෙන ස්ථාන කොටස්වල තබන්න:
        </p>
        <div className="flex flex-wrap justify-center gap-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl min-h-[90px]">
          {trayOpts.length === 0 && (
            <p className="text-sm text-gray-400 italic self-center">
              සියලු රූප ස්ථාන ගත කර ඇත ✓
            </p>
          )}
          {trayOpts.map((opt) => (
            <img
              key={opt.image_url}
              src={opt.image_url}
              alt="option"
              draggable={!showResults}
              onDragStart={() => setDragItem(opt.image_url)}
              className="rounded-lg shadow border-2 border-indigo-300 bg-white cursor-grab hover:border-indigo-500 transition"
              style={{ width: 70, height: 70, objectFit: "cover" }}
            />
          ))}
        </div>
      </div>

      {/* ── Warning + Submit ── */}
      {showWarning && !allPlaced && (
        <p className="text-red-500 text-sm mt-3 text-center">
          ඉදිරිපත් කිරීමට පෙර සියලු ස්ථාන පුරවන්න.
        </p>
      )}

      {!showResults && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSubmit}
            disabled={!allPlaced}
            className={`py-2 px-8 rounded-lg shadow-md font-semibold transition ${
              allPlaced
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            ඉදිරිපත් කරන්න
          </button>
        </div>
      )}
    </div>
  );
};

export default DirectionDragDrop;
