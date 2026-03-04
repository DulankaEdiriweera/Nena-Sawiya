import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function VCJigsawPlay({ puzzleId }) {
  const apiBase = "http://localhost:5000";

  const [meta, setMeta] = useState(null);
  const [tray, setTray] = useState([]);
  const [board, setBoard] = useState({});
  const [dragPiece, setDragPiece] = useState(null);

  const [attempts, setAttempts] = useState(0);
  const [startTs, setStartTs] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [seconds, setSeconds] = useState(null);

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
      setMeta(null);
      setTray([]);
      setBoard({});
      setAttempts(0);
      setCompleted(false);
      setSeconds(null);
      setDragPiece(null);

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
    for (let r = 0; r < meta.rows; r++) {
      for (let c = 0; c < meta.cols; c++) out.push({ r, c, key: `${r}-${c}` });
    }
    return out;
  }, [meta]);

  const isSolved = (b) => {
    if (!meta) return false;
    for (let r = 0; r < meta.rows; r++) {
      for (let c = 0; c < meta.cols; c++) {
        const p = b[`${r}-${c}`];
        if (!p) return false;
        if (p.row !== r || p.col !== c) return false;
      }
    }
    return true;
  };

  const allowDrop = (e) => e.preventDefault();

  const onDragStartFromTray = (p) => {
    if (completed) return;
    setDragPiece({ ...p, from: "tray" });
  };

  const onDragStartFromBoard = (p, fromKey) => {
    if (completed) return;
    setDragPiece({ ...p, from: "board", fromKey });
  };

  const stripMeta = (p) => {
    const { from, fromKey, ...rest } = p;
    return rest;
  };

  const dropToSlot = (slotKey) => {
    if (!dragPiece || completed) return;

    setAttempts((a) => a + 1);

    setBoard((prevBoard) => {
      const next = { ...prevBoard };
      const existing = next[slotKey];

      // place dragged into target slot
      next[slotKey] = stripMeta(dragPiece);

      if (dragPiece.from === "board") {
        // moving from board: swap if needed
        if (existing) next[dragPiece.fromKey] = existing;
        else delete next[dragPiece.fromKey];
      } else {
        // from tray: if slot had piece, put it back to tray
        if (existing) setTray((t) => [...t, existing]);
      }

      if (Object.keys(next).length === meta.rows * meta.cols && isSolved(next)) {
        setCompleted(true);
        setSeconds(Math.round((Date.now() - startTs) / 1000));
      }

      return next;
    });

    if (dragPiece.from === "tray") {
      setTray((t) => t.filter((x) => x.index !== dragPiece.index));
    }

    setDragPiece(null);
  };

  const reset = () => {
    if (!meta) return;
    setTray(shuffle(meta.pieces));
    setBoard({});
    setAttempts(0);
    setCompleted(false);
    setSeconds(null);
    setStartTs(Date.now());
    setDragPiece(null);
  };

  if (!meta) return <div style={{ padding: 24 }}>Loading puzzle...</div>;

  // ✅ Make board + reference use SAME aspect ratio as backend base image
  const boardWidth = 360; // you can change this (e.g., 420), everything scales correctly
  const tileW = Math.floor(boardWidth / meta.cols);

  // preserve tile aspect ratio using backend tile sizes
  // meta.tile_w and meta.tile_h come from your backend slicing
  const tileAspect = meta.tile_h && meta.tile_w ? meta.tile_h / meta.tile_w : 1;
  const tileH = Math.floor(tileW * tileAspect);

  const boardHeight = tileH * meta.rows;

  const boardStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${meta.cols}, ${tileW}px)`,
    gridTemplateRows: `repeat(${meta.rows}, ${tileH}px)`,
    gap: 4,
    padding: 6,
    background: "#f5f5f5",
    borderRadius: 7,
    border: "1px solid #ddd",
    width: "fit-content",
  };

  const slotStyle = {
    width: tileW,
    height: tileH,
    borderRadius: 6,
    background: "#fff",
    border: completed ? "2px solid #2e7d32" : "2px dashed #aaa",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const trayStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(3, ${tileW}px)`,
    gap: 4,
    padding: 6,
    background: "#fff",
    borderRadius: 7,
    border: "1px solid #ddd",
    width: "fit-content",
  };

  // ✅ Reference size derived from board size, SAME RATIO
  const refWidth = boardWidth;
  const refHeight = boardHeight;

  return (
    <div style={{ padding: 24 }}>
      <h2>{meta.title}</h2>
      <div style={{ opacity: 0.85, marginBottom: 14 }}>
        Grid: <b>{meta.rows}×{meta.cols}</b> • Attempts: <b>{attempts}</b> •{" "}
        Status: <b>{completed ? "✅ Completed" : "In progress"}</b>
        {completed && <> • Time: <b>{seconds}s</b></>}
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        {/* BOARD */}
        <div>
          <h3>Board</h3>
          <div style={boardStyle}>
            {slots.map((s) => {
              const placed = board[s.key];
              return (
                <div
                  key={s.key}
                  style={slotStyle}
                  onDragOver={allowDrop}
                  onDrop={() => dropToSlot(s.key)}
                >
                  {placed ? (
                    <img
                      src={`${apiBase}${placed.url}`}
                      alt={`piece-${placed.index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      draggable={!completed}
                      onDragStart={() => onDragStartFromBoard(placed, s.key)}
                    />
                  ) : (
                    <span style={{ color: "#999", fontSize: 12 }}>Drop</span>
                  )}
                </div>
              );
            })}
          </div>

          <button onClick={reset} style={{ marginTop: 12, padding: "10px 14px" }}>
            Reset
          </button>
        </div>

        {/* TRAY */}
        <div>
          <h3>Pieces Tray</h3>
          <div style={trayStyle}>
            {tray.map((p) => (
              <div
                key={p.index}
                style={{
                  width: tileW,
                  height: tileH,
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid #eee",
                }}
              >
                <img
                  src={`${apiBase}${p.url}`}
                  alt={`tray-${p.index}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  draggable={!completed}
                  onDragStart={() => onDragStartFromTray(p)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* REFERENCE */}
        <div>
          <h3>Reference</h3>
          <img
            src={`${apiBase}${meta.original_url}`}
            alt="original"
            style={{
              width: refWidth,
              height: refHeight,
              objectFit: "cover",     // ✅ important
              borderRadius: 12,
              border: "1px solid #ddd",
              display: "block",
            }}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}