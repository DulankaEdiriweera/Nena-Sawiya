import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

export default function VCJigsawPlay({ puzzleId }) {
  const apiBase = "http://localhost:5000";
  const nav = useNavigate();

  const [meta, setMeta]           = useState(null);
  const [tray, setTray]           = useState([]);
  const [board, setBoard]         = useState({});
  const [dragPiece, setDragPiece] = useState(null);

  const [attempts, setAttempts]   = useState(0);
  const [startTs, setStartTs]     = useState(null);
  const [completed, setCompleted] = useState(false);
  const [seconds, setSeconds]     = useState(null);
  const [refOpen, setRefOpen]     = useState(true);

  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  useEffect(() => {
    async function load() {
      setMeta(null); setTray([]); setBoard({});
      setAttempts(0); setCompleted(false); setSeconds(null); setDragPiece(null);
      const res = await axios.get(`${apiBase}/api/vc_jigsaw/${puzzleId}`);
      setMeta(res.data);
      setTray(shuffle(res.data.pieces));
      setStartTs(Date.now());
    }
    if (puzzleId) load();
  }, [puzzleId]);

  const slots = useMemo(() => {
    if (!meta) return [];
    const out = [];
    for (let r = 0; r < meta.rows; r++)
      for (let c = 0; c < meta.cols; c++)
        out.push({ r, c, key: `${r}-${c}` });
    return out;
  }, [meta]);

  const isSolved = (b) => {
    if (!meta) return false;
    for (let r = 0; r < meta.rows; r++)
      for (let c = 0; c < meta.cols; c++) {
        const p = b[`${r}-${c}`];
        if (!p || p.row !== r || p.col !== c) return false;
      }
    return true;
  };

  const allowDrop   = (e) => e.preventDefault();
  const stripMeta   = ({ from, fromKey, ...rest }) => rest;

  const onDragStartFromTray  = (p)          => { if (!completed) setDragPiece({ ...p, from: "tray" }); };
  const onDragStartFromBoard = (p, fromKey) => { if (!completed) setDragPiece({ ...p, from: "board", fromKey }); };

  const dropToSlot = (slotKey) => {
    if (!dragPiece || completed) return;
    setAttempts((a) => a + 1);
    setBoard((prev) => {
      const next     = { ...prev };
      const existing = next[slotKey];
      next[slotKey]  = stripMeta(dragPiece);
      if (dragPiece.from === "board") {
        if (existing) next[dragPiece.fromKey] = existing;
        else delete next[dragPiece.fromKey];
      } else {
        if (existing) setTray((t) => [...t, existing]);
      }
      if (Object.keys(next).length === meta.rows * meta.cols && isSolved(next)) {
        setCompleted(true);
        setSeconds(Math.round((Date.now() - startTs) / 1000));
      }
      return next;
    });
    if (dragPiece.from === "tray")
      setTray((t) => t.filter((x) => x.index !== dragPiece.index));
    setDragPiece(null);
  };

  const reset = () => {
    if (!meta) return;
    setTray(shuffle(meta.pieces)); setBoard({});
    setAttempts(0); setCompleted(false); setSeconds(null);
    setStartTs(Date.now()); setDragPiece(null);
  };

  if (!meta) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 flex flex-col items-center justify-center gap-4" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="text-6xl animate-bounce">🧩</div>
      <p className="text-indigo-600 font-extrabold text-xl">Loading puzzle…</p>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');`}</style>
    </div>
  );

  const totalPieces = meta.rows * meta.cols;
  const tileAspect  = meta.tile_h && meta.tile_w ? meta.tile_h / meta.tile_w : 1;

  // ── Responsive tile size: bigger board for more pieces ──
  // Min tile: 44px (easy to drag), Max tile: 90px
  // For 64 pieces (8×8): boardWidth ~ 480 → tileW = 60px  ✓
  // For 9 pieces  (3×3): boardWidth ~ 300 → tileW = 100px ✓
  const MIN_TILE = 52;
  const MAX_TILE = 100;
  const tileW    = Math.max(MIN_TILE, Math.min(MAX_TILE, Math.floor(480 / meta.cols)));
  const tileH    = Math.floor(tileW * tileAspect);

  const boardWidth  = tileW * meta.cols;
  const boardHeight = tileH * meta.rows;

  // Tray: for many pieces show more columns so tray isn't too tall
  // ≤12 pieces → 3 cols, ≤30 → 4 cols, else → 5 cols
  const trayCols   = totalPieces <= 12 ? 3 : totalPieces <= 30 ? 4 : 5;
  // Tray piece size: slightly larger than board tile for easy picking
  const trayTile   = Math.max(MIN_TILE, Math.min(80, tileW));
  const trayTileH  = Math.floor(trayTile * tileAspect);
  // Max tray height = same as board height, scroll if more
  const trayMaxH   = boardHeight;

  // Reference: same size as board, but collapsible on large puzzles
  const isLarge    = totalPieces >= 36;

  return (
    <div>
      <div><Header/></div>
          <div
      className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-200 px-4 py-6"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      {/* ── Header ── */}
      <div className="text-center mb-5">
        <div className="text-4xl mb-1">🧩</div>
        <h1 className="text-3xl font-extrabold text-indigo-700 drop-shadow-sm">{meta.title}</h1>

        <button
          onClick={() => nav("/vcJigsawList")}
          className="mt-3 bg-white rounded-2xl px-4 py-2 shadow font-extrabold text-indigo-600 text-sm hover:bg-indigo-50 transition-all"
        >
          ← Back to Puzzle List
        </button>

        <div className="flex justify-center flex-wrap gap-2 mt-3">
          <span className="bg-white text-indigo-500 font-bold px-4 py-1.5 rounded-full shadow text-sm">
            🎯 Moves: {attempts}
          </span>
          <span className={`font-bold px-4 py-1.5 rounded-full shadow text-sm ${completed ? "bg-green-400 text-white" : "bg-white text-indigo-400"}`}>
            {completed ? `🎉 Done in ${seconds}s!` : "⏳ In progress…"}
          </span>
          <span className="bg-white text-indigo-500 font-bold px-4 py-1.5 rounded-full shadow text-sm">
            🔲 {meta.rows}×{meta.cols} ({totalPieces} pieces)
          </span>
        </div>
      </div>

      {/* ── Completion Banner ── */}
      {completed && (
        <div className="max-w-lg mx-auto mb-5 bg-green-400 text-white rounded-3xl p-4 text-center shadow-lg">
          <div className="text-4xl mb-1">🎊</div>
          <p className="font-extrabold text-xl">Amazing job! You solved it!</p>
          <p className="text-green-100 font-semibold mt-1">Time: {seconds}s • Attempts: {attempts}</p>
        </div>
      )}

      {/* ── Main layout ── */}
      <div className="flex flex-row justify-center items-start gap-4 flex-wrap">

        {/* ── Reference (collapsible on large puzzles) ── */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setRefOpen(o => !o)}
            className="bg-white rounded-2xl px-4 py-1.5 shadow font-extrabold text-indigo-600 text-sm hover:bg-indigo-50 transition-all flex items-center gap-1"
          >
            🖼️ Reference {isLarge ? (refOpen ? "▲" : "▼") : ""}
          </button>

          {refOpen && (
            <div className="bg-white p-2 rounded-3xl shadow-md border-2 border-indigo-100">
              <img
                src={`${apiBase}${meta.original_url}`}
                alt="original"
                style={{
                  width: isLarge ? Math.min(boardWidth, 260) : boardWidth,
                  height: isLarge ? Math.min(boardHeight, 260 * tileAspect * meta.rows / meta.cols) : boardHeight,
                  objectFit: "cover",
                  borderRadius: 16,
                  display: "block",
                }}
                draggable={false}
              />
            </div>
          )}

          {/* Collapsed thumbnail */}
          {!refOpen && (
            <div className="bg-white p-1.5 rounded-2xl shadow border-2 border-indigo-100 opacity-70">
              <img
                src={`${apiBase}${meta.original_url}`}
                alt="original"
                style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 10, display: "block" }}
                draggable={false}
              />
            </div>
          )}
        </div>

        {/* ── Board ── */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-white rounded-2xl px-4 py-1.5 shadow font-extrabold text-indigo-600 text-sm">
            🎯 Your Board
          </div>
          <div
            className="bg-white p-2 rounded-3xl shadow-md border-2 border-indigo-100"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${meta.cols}, ${tileW}px)`,
              gridTemplateRows:    `repeat(${meta.rows}, ${tileH}px)`,
              gap: totalPieces >= 36 ? 2 : 4,
            }}
          >
            {slots.map((s) => {
              const placed = board[s.key];
              return (
                <div
                  key={s.key}
                  onDragOver={allowDrop}
                  onDrop={() => dropToSlot(s.key)}
                  style={{ width: tileW, height: tileH }}
                  className={`overflow-hidden flex items-center justify-center transition-all
                    ${totalPieces >= 36 ? "rounded-md" : "rounded-xl"}
                    ${placed
                      ? completed
                        ? "border border-green-400"
                        : "border border-indigo-200"
                      : "border border-dashed border-indigo-300 bg-indigo-50 hover:bg-indigo-100"
                    }`}
                >
                  {placed ? (
                    <img
                      src={`${apiBase}${placed.url}`}
                      alt={`piece-${placed.index}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      draggable={!completed}
                      onDragStart={() => onDragStartFromBoard(placed, s.key)}
                    />
                  ) : (
                    <span className="text-indigo-200 select-none" style={{ fontSize: tileW > 60 ? 18 : 11 }}>＋</span>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={reset}
            style={{ width: boardWidth + 16 }}
            className="mt-1 py-2.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-extrabold text-base shadow transition-all flex items-center justify-center gap-2"
          >
            🔄 Try Again
          </button>
        </div>

        {/* ── Tray ── */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-white rounded-2xl px-4 py-1.5 shadow font-extrabold text-indigo-600 text-sm">
            🗂️ Pieces ({tray.length})
          </div>
          <div
            className="bg-white p-2 rounded-3xl shadow-md border-2 border-indigo-100 overflow-y-auto"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${trayCols}, ${trayTile}px)`,
              gap: totalPieces >= 36 ? 3 : 4,
              alignContent: "start",
              maxHeight: trayMaxH + 16,
            }}
          >
            {tray.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center text-indigo-300 font-bold text-sm gap-1"
                style={{ gridColumn: `span ${trayCols}`, height: trayTileH * 2 }}
              >
                <span className="text-3xl">🎉</span>
                All placed!
              </div>
            ) : (
              tray.map((p) => (
                <div
                  key={p.index}
                  style={{ width: trayTile, height: trayTileH }}
                  className="rounded-xl overflow-hidden border-2 border-indigo-100 cursor-grab hover:scale-105 hover:shadow-lg hover:border-indigo-400 transition-all active:scale-95"
                >
                  <img
                    src={`${apiBase}${p.url}`}
                    alt={`tray-${p.index}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    draggable={!completed}
                    onDragStart={() => onDragStartFromTray(p)}
                  />
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');`}</style>
    </div>
    </div>
  );
}