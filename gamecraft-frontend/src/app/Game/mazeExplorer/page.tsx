"use client"

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Home, Trophy, RotateCcw, Copy, Trash2, Star, Sparkles } from "lucide-react";

// SQL Maze Explorer
// React + TypeScript + TailwindCSS single-file component
// Controls: Arrow keys or WASD only for movement

type Cell = {
  r: number;
  c: number;
  isWall: boolean;
  token?: string;
  isExit?: boolean;
};

interface Props {
  answer?: string;
  rows?: number;
  cols?: number;
}

export default function SqlMazeExplorer({
  answer = "SELECT * FROM orders WHERE customerid = 1;",
  rows = 15,
  cols = 21,
}: Props) {
  if (rows % 2 === 0) rows += 1;
  if (cols % 2 === 0) cols += 1;

  const tokens = useMemo(() => {
    return (
      answer.match(/(\b\w+\b)|([.,*()=;<>])/g) || []
    ).map((t) => t.trim()).filter(Boolean);
  }, [answer]);

  const [grid, setGrid] = useState<Cell[][]>([]);
  const [player, setPlayer] = useState<{ r: number; c: number }>({ r: 1, c: 1 });
  const [collected, setCollected] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [exitPos, setExitPos] = useState<{ r: number; c: number } | null>(null);
  const [gameWon, setGameWon] = useState(false);
  const [showVictory, setShowVictory] = useState(false);

  const correctQuery = useMemo(() => {
    return answer.trim().toLowerCase();
  }, [answer]);

  const assembledQuery = collected.join(" ");

  const generateMaze = useCallback(() => {
    const g: Cell[][] = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => ({ r, c, isWall: true }))
    );

    const inBounds = (r: number, c: number) => r > 0 && r < rows - 1 && c > 0 && c < cols - 1;

    const stack: [number, number][] = [];
    g[1][1].isWall = false;
    stack.push([1, 1]);

    while (stack.length) {
      const [r, c] = stack[stack.length - 1];

      const neighbors: [number, number, number, number][] = [];
      const dirs = [
        [-2, 0, -1, 0],
        [2, 0, 1, 0],
        [0, -2, 0, -1],
        [0, 2, 0, 1],
      ];

      for (const [dr, dc, br, bc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        const brc = r + br;
        const bcc = c + bc;
        if (inBounds(nr, nc) && g[nr][nc].isWall) neighbors.push([nr, nc, brc, bcc]);
      }

      if (neighbors.length === 0) {
        stack.pop();
      } else {
        const choice = neighbors[Math.floor(Math.random() * neighbors.length)];
        const [nr, nc, brc, bcc] = choice;
        g[brc][bcc].isWall = false;
        g[nr][nc].isWall = false;
        stack.push([nr, nc]);
      }
    }

    setPlayer({ r: 1, c: 1 });

    const openCells: Cell[] = [];
    for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {
        if (!g[r][c].isWall) openCells.push(g[r][c]);
      }
    }

    for (let i = openCells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = openCells[i];
      openCells[i] = openCells[j];
      openCells[j] = tmp;
    }

    let placed = 0;
    for (const cell of openCells) {
      if (cell.r === 1 && cell.c === 1) continue;
      if (placed >= tokens.length) break;
      g[cell.r][cell.c].token = tokens[placed];
      placed++;
    }

    // Place exit at the farthest open cell from start
    let maxDist = 0;
    let exitCell: Cell | null = null;
    for (const cell of openCells) {
      if (cell.r === 1 && cell.c === 1) continue;
      const dist = Math.abs(cell.r - 1) + Math.abs(cell.c - 1);
      if (dist > maxDist) {
        maxDist = dist;
        exitCell = cell;
      }
    }

    if (exitCell) {
      g[exitCell.r][exitCell.c].isExit = true;
      setExitPos({ r: exitCell.r, c: exitCell.c });
    }

    setGrid(g);
    setCollected([]);
    setGameWon(false);
    setShowVictory(false);
    setMessage(placed === tokens.length ? "🎯 All tokens placed! Collect them and reach the exit!" : `Placed ${placed} of ${tokens.length}`);
  }, [rows, cols, tokens]);

  useEffect(() => {
    generateMaze();
  }, [generateMaze]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (gameWon) return;

      const key = e.key;
      let dr = 0, dc = 0;
      if (key === "ArrowUp" || key.toLowerCase() === "w") { dr = -1; }
      else if (key === "ArrowDown" || key.toLowerCase() === "s") { dr = 1; }
      else if (key === "ArrowLeft" || key.toLowerCase() === "a") { dc = -1; }
      else if (key === "ArrowRight" || key.toLowerCase() === "d") { dc = 1; }
      else return;

      e.preventDefault();

      setPlayer(prev => {
        const nr = prev.r + dr;
        const nc = prev.c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return prev;
        const target = grid[nr]?.[nc];
        if (!target || target.isWall) return prev;

        if (target.token) {
          setCollected(prevCollected => [...prevCollected, String(target.token)]);
          setGrid(oldGrid => {
            const newGrid = oldGrid.map(row => row.map(cell => ({ ...cell })));
            newGrid[nr][nc].token = undefined;
            return newGrid;
          });
        }

        // Check if reached exit
        if (target.isExit) {
          const userQuery = [...collected, target.token].filter(Boolean).join(" ").trim().toLowerCase();
          if (userQuery === correctQuery) {
            setGameWon(true);
            setShowVictory(true);
            setMessage("🎉 Victory! You've escaped the maze with the correct query!");
          } else {
            setMessage("❌ Wrong query! Collect all tokens in the correct order.");
            return prev;
          }
        }

        return { r: nr, c: nc };
      });
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [grid, rows, cols, collected, correctQuery, gameWon]);

  const reset = () => generateMaze();

  const copyQuery = () => {
    navigator.clipboard?.writeText(assembledQuery);
    setMessage("📋 Query copied to clipboard!");
  };

  const clearCollected = () => {
    setCollected([]);
    setMessage("🗑️ Collected tokens cleared!");
  };

  return (
    <>
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.6); }
          50% { box-shadow: 0 0 40px rgba(251, 191, 36, 1); }
        }

        @keyframes home-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(34, 197, 94, 0.6); }
          50% { transform: scale(1.1); box-shadow: 0 0 40px rgba(34, 197, 94, 1); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }

        .token-cell {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .exit-cell {
          animation: home-pulse 2s ease-in-out infinite;
        }

        .player-cell {
          animation: float 1s ease-in-out infinite;
        }

        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          z-index: 1000;
          animation: confetti-fall 3s linear forwards;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Victory Confetti */}
          {showVictory && (
            <div className="fixed inset-0 pointer-events-none z-50">
              {[...Array(100)].map((_, i) => (
                <div
                  key={i}
                  className="confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    background: ['#fbbf24', '#f59e0b', '#8b5cf6', '#3b82f6', '#22c55e'][Math.floor(Math.random() * 5)],
                    animationDelay: `${Math.random() * 0.5}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold text-white flex items-center gap-3">
                  <Sparkles className="w-8 h-8" />
                  SQL Maze Explorer
                </h1>
                <p className="text-indigo-200 mt-2 text-sm sm:text-base">
                  🎮 Use Arrow keys or WASD to move • Collect all tokens • Reach the <Home className="inline w-4 h-4" /> exit!
                </p>
              </div>
              <button 
                onClick={reset} 
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
              >
                <RotateCcw className="w-5 h-5" />
                Reset Maze
              </button>
            </div>
          </div>

          {/* Message Banner */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-center font-bold text-lg ${
              gameWon 
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white animate-pulse' 
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
            }`}>
              {message}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Maze Grid */}
            <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 p-4 sm:p-6 rounded-2xl shadow-2xl border-4 border-purple-500">
              <div className="overflow-x-auto">
                <div 
                  className="inline-grid gap-0.5" 
                  style={{ gridTemplateColumns: `repeat(${cols}, minmax(24px, 32px))` }}
                >
                  {grid.flat().map((cell, idx) => {
                    const isPlayer = player.r === cell.r && player.c === cell.c;
                    const hasToken = cell.token && !isPlayer;
                    const isExit = cell.isExit && !isPlayer;
                    
                    let classes = "aspect-square flex items-center justify-center text-xs font-bold rounded transition-all";
                    
                    if (cell.isWall) {
                      classes += " bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600";
                    } else if (isPlayer) {
                      classes += " bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg player-cell border-2 border-blue-300";
                    } else if (isExit) {
                      classes += " bg-gradient-to-br from-green-400 to-green-600 text-white exit-cell border-2 border-green-300";
                    } else if (hasToken) {
                      classes += " bg-gradient-to-br from-yellow-300 to-yellow-500 text-gray-900 token-cell border-2 border-yellow-400";
                    } else {
                      classes += " bg-gradient-to-br from-slate-600 to-slate-700 border border-slate-500";
                    }
                    
                    return (
                      <div key={idx} className={classes}>
                        {isPlayer && (
                          <div className="flex flex-col items-center">
                            <span className="text-lg">👤</span>
                          </div>
                        )}
                        {isExit && !isPlayer && <Home className="w-4 h-4 sm:w-5 sm:h-5" />}
                        {hasToken && (
                          <span className="truncate px-1 text-[10px] sm:text-xs font-black">
                            {cell.token}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-96 space-y-4">
              {/* Tokens to Collect */}
              <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-bold text-lg text-gray-800">Tokens to Collect</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tokens.map((t, i) => {
                    const isCollected = collected.includes(t);
                    return (
                      <span 
                        key={i} 
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                          isCollected 
                            ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg scale-95' 
                            : 'bg-gradient-to-r from-yellow-200 to-yellow-300 text-gray-800'
                        }`}
                      >
                        {isCollected && '✓ '}{t}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Collected Tokens */}
              <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5 text-purple-500" />
                  <h3 className="font-bold text-lg text-gray-800">Collected ({collected.length}/{tokens.length})</h3>
                </div>
                <div className="min-h-[60px] p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200">
                  {collected.length ? (
                    <div className="flex flex-wrap gap-2">
                      {collected.map((c, i) => (
                        <span 
                          key={i} 
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-bold shadow"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">No tokens collected yet...</span>
                  )}
                </div>
              </div>

              {/* Assembled Query */}
              <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-3">📝 Your Query</h3>
                <pre className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-green-400 rounded-xl text-sm font-mono whitespace-pre-wrap border-2 border-slate-700 min-h-[80px]">
                  {assembledQuery || "// Start collecting tokens..."}
                </pre>
                
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={copyQuery}
                    disabled={!assembledQuery}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-bold shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button 
                    onClick={clearCollected}
                    disabled={!collected.length}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-lg font-bold shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>
                </div>
              </div>

              {/* Controls Help */}
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-4 border-2 border-indigo-300">
                <p className="text-sm text-gray-700 font-medium">
                  <span className="font-bold text-indigo-600">🎮 Controls:</span> Arrow keys or W/A/S/D
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Collect all tokens in order, then reach the <Home className="inline w-3 h-3" /> exit to win!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}