"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Home, Trophy, RotateCcw, Copy, Trash2, Lightbulb, Sparkles, AlertTriangle } from "lucide-react";

// SQL Maze Explorer (Puzzle Mode: Question Only)

type Cell = {
  r: number;
  c: number;
  isWall: boolean;
  token?: string; 
  isExit?: boolean;
};

interface Props {
  answer?: string;
  question?: string; // New prop for the hint/question
  rows?: number;
  cols?: number;
}

export default function SqlMazeExplorer({
  answer = "SELECT * FROM orders WHERE customerid = 1;",
  question = "Fetch all columns from the 'orders' table where the customer ID is 1.", // Default Question
  rows = 11,
  cols = 17,
}: Props) {
  if (rows % 2 === 0) rows += 1;
  if (cols % 2 === 0) cols += 1;

  // 1. TOKEN PARSING
  const tokens = useMemo(() => {
    return (
      answer.match(/(\b\w+\b)|([.,*()=;<>@])/g) || []
    ).map((t) => t.trim()).filter(Boolean);
  }, [answer]);

  // Game State
  const [gridState, setGridState] = useState<Cell[][]>([]);
  const gridRef = useRef<Cell[][]>([]); 
  
  const [player, setPlayer] = useState<{ r: number; c: number }>({ r: 1, c: 1 });
  const [collected, setCollected] = useState<string[]>([]); 
  const [message, setMessage] = useState<string>("Read the mission and find the path!");
  const [gameWon, setGameWon] = useState(false);
  const [showVictory, setShowVictory] = useState(false);

  const assembledQuery = collected.join(" ").trim();

  // 2. MAZE GENERATION
  const generateMaze = useCallback(() => {
    const newGrid: Cell[][] = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => ({ r, c, isWall: true }))
    );

    const startR = 1, startC = 1;
    newGrid[startR][startC].isWall = false;

    // A. Snake Path Generation
    const solutionPath: [number, number][] = [[startR, startC]];
    const visited = new Set<string>();
    visited.add(`${startR},${startC}`);

    function carvePath(r: number, c: number): boolean {
        const dirs = [
            [-2, 0], [2, 0], [0, -2], [0, 2]
        ].sort(() => Math.random() - 0.5);

        for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            const wr = r + dr / 2, wc = c + dc / 2;

            if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && !visited.has(`${nr},${nc}`)) {
                newGrid[nr][nc].isWall = false;
                newGrid[wr][wc].isWall = false;
                visited.add(`${nr},${nc}`);
                solutionPath.push([wr, wc]); 
                solutionPath.push([nr, nc]);
                carvePath(nr, nc);
            }
        }
        return true;
    }

    carvePath(startR, startC);

    // B. Place Tokens
    const pathLength = solutionPath.length;
    const tokenCount = tokens.length;
    const step = Math.floor((pathLength - 1) / (tokenCount + 1)); 

    let currentPathIdx = step;
    for (let i = 0; i < tokenCount; i++) {
        if (currentPathIdx >= pathLength) currentPathIdx = pathLength - 2;
        const [tr, tc] = solutionPath[currentPathIdx];
        if (!newGrid[tr][tc].isWall) {
             newGrid[tr][tc].token = tokens[i];
        }
        currentPathIdx += step;
    }

    // C. Exit
    const [exitR, exitC] = solutionPath[solutionPath.length - 1];
    newGrid[exitR][exitC].isExit = true;
    newGrid[exitR][exitC].token = undefined;

    // D. Random Holes (to make it look like a maze, not just a line)
    for(let i=0; i< (rows*cols)/10; i++) {
        const rr = Math.floor(Math.random() * (rows - 2)) + 1;
        const rc = Math.floor(Math.random() * (cols - 2)) + 1;
        if (newGrid[rr][rc].isWall) {
            let neighbors = 0;
            if (!newGrid[rr-1][rc].isWall) neighbors++;
            if (!newGrid[rr+1][rc].isWall) neighbors++;
            if (!newGrid[rr][rc-1].isWall) neighbors++;
            if (!newGrid[rr][rc+1].isWall) neighbors++;
            if (neighbors <= 2) newGrid[rr][rc].isWall = false;
        }
    }

    gridRef.current = newGrid;
    setGridState(newGrid);
    setPlayer({ r: startR, c: startC });
    setCollected([]);
    setGameWon(false);
    setShowVictory(false);
    setMessage(`🎯 Maze Ready! Solve the question below.`);
  }, [rows, cols, tokens]);

  useEffect(() => {
    generateMaze();
  }, [generateMaze]);

  // 3. MOVEMENT HANDLER
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

        const currentGrid = gridRef.current;
        const targetCell = currentGrid[nr][nc];

        if (targetCell.isWall) return prev;

        // --- TOKEN LOGIC ---
        if (targetCell.token) {
            const tokenToCollect = String(targetCell.token);
            
            // Remove token from grid immediately
            targetCell.token = undefined; 
            setGridState([...currentGrid]); 

            // Add to collection
            setCollected(prevC => [...prevC, tokenToCollect]);
            
            setMessage(`Collected "${tokenToCollect}".`);
        }

        // --- EXIT LOGIC ---
        if (targetCell.isExit) {
            // 1. Check Completeness
            if (collected.length < tokens.length) {
                setMessage(`❌ Incomplete! You have ${collected.length}/${tokens.length} tokens.`);
                return { r: nr, c: nc };
            }

            // 2. Check Order
            const userSequence = collected; 
            const isCorrectOrder = userSequence.every((val, index) => val === tokens[index]);

            if (isCorrectOrder && userSequence.length === tokens.length) {
                setGameWon(true);
                setShowVictory(true);
                setMessage("🎉 Victory! You solved the query correctly!");
            } else {
                setMessage("❌ WRONG QUERY! The order was incorrect. Resetting...");
                setTimeout(() => {
                    generateMaze();
                }, 2000);
            }
        }

        return { r: nr, c: nc };
      });
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [rows, cols, gameWon, collected, tokens, generateMaze]);

  const reset = () => generateMaze();
  
  const copyQuery = () => {
    navigator.clipboard?.writeText(assembledQuery);
    setMessage("📋 Copied!");
  };

  const clearCollected = () => {
    setCollected([]);
    setMessage("🗑️ Reset. Start over!");
    generateMaze();
  };

  return (
    <>
      <style jsx>{`
        .confetti { position: fixed; width: 10px; height: 10px; z-index: 1000; animation: fall 3s linear forwards; }
        @keyframes fall { to { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
      `}</style>

      <div className="min-h-screen bg-slate-950 text-white p-4 font-sans">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT: MAZE AREA */}
            <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2 text-indigo-400">
                            <Sparkles className="w-6 h-6" /> SQL Maze Explorer
                        </h1>
                        <p className="text-slate-400 text-sm">Solve the question by collecting tokens in order.</p>
                    </div>
                    <button onClick={reset} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold flex items-center gap-2 transition">
                        <RotateCcw className="w-4 h-4" /> Reset
                    </button>
                </div>

                <div className={`p-3 rounded-lg text-center font-bold border ${gameWon ? 'bg-green-900/50 border-green-500 text-green-200' : 'bg-slate-900 border-slate-700 text-indigo-200'}`}>
                    {message}
                </div>

                {/* GRID */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-2xl flex justify-center">
                    <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(20px, 30px))` }}>
                        {gridState.map((row, r) => row.map((cell, c) => {
                            const isPlayer = player.r === r && player.c === c;
                            
                            let baseClass = "aspect-square rounded-sm flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-200 ";
                            
                            if (cell.isWall) baseClass += "bg-slate-800";
                            else if (isPlayer) baseClass += "bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)] z-10 scale-110";
                            else if (cell.isExit) baseClass += "bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]";
                            else if (cell.token) {
                                baseClass += "bg-yellow-900/40 text-yellow-500 border border-yellow-600/30";
                            }
                            else baseClass += "bg-slate-900/50"; 

                            return (
                                <div key={`${r}-${c}`} className={baseClass}>
                                    {isPlayer && "👤"}
                                    {!isPlayer && cell.token && cell.token}
                                    {!isPlayer && cell.isExit && <Home className="w-4 h-4" />}
                                </div>
                            );
                        }))}
                    </div>
                </div>
            </div>

            {/* RIGHT: HUD */}
            <div className="space-y-4">
                
                {/* MISSION OBJECTIVE (Hint/Question) - Replaces Target Tokens */}
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-slate-300 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400" /> Mission Objective
                    </h3>
                    <div className="bg-indigo-950/50 p-4 rounded-lg border-l-4 border-indigo-500 text-indigo-100 text-sm leading-relaxed">
                        {question}
                    </div>
                </div>

                {/* CURRENT QUERY */}
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-slate-300 mb-3 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-purple-400" /> Your Query
                    </h3>
                    <div className="bg-black p-3 rounded-lg border border-slate-700 font-mono text-sm text-green-400 min-h-[60px]">
                        {assembledQuery}
                        <span className="animate-pulse">_</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                         <button onClick={copyQuery} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold flex justify-center items-center gap-2">
                            <Copy className="w-3 h-3" /> Copy
                         </button>
                         <button onClick={clearCollected} className="flex-1 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg text-xs font-bold flex justify-center items-center gap-2">
                            <Trash2 className="w-3 h-3" /> Retry
                         </button>
                    </div>
                </div>

                <div className="bg-indigo-900/20 p-4 rounded-xl border border-indigo-500/30 text-xs text-indigo-200">
                    <p className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-yellow-400" />
                        Find the correct tokens to build the query that solves the Mission Objective!
                    </p>
                </div>
            </div>
        </div>

        {showVictory && (
             <div className="fixed inset-0 pointer-events-none">
               {[...Array(50)].map((_, i) => (
                 <div key={i} className="confetti" style={{
                   left: `${Math.random() * 100}%`,
                   background: ['#fbbf24', '#3b82f6', '#22c55e'][Math.floor(Math.random() * 3)],
                   animationDelay: `${Math.random()}s`
                 }} />
               ))}
             </div>
        )}
      </div>
    </>
  );
}