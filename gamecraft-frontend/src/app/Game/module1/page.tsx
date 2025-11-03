"use client";

import { useEffect, useState } from "react";
import { Sparkles, Play, RotateCcw, Database, Award, ArrowLeft, ArrowRight } from "lucide-react";
import SQLGameLevel01 from "./level1";
import SQLGameLevel02 from "./level2";

const modules = [
  { id: 1, component: SQLGameLevel01 },
  { id: 2, component: SQLGameLevel02 },
];

export default function SQLGameUI() {
  const [currentModule, setCurrentModule] = useState(0); // index of modules
  const LevelComponent = modules[currentModule].component;

  // ensure the page scrolls to top when switching modules
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentModule]);

  const goNext = () => {
    if (currentModule < modules.length - 1) {
      setCurrentModule(currentModule + 1);
    }
  };

  const goBack = () => {
    if (currentModule > 0) {
      setCurrentModule(currentModule - 1);
    }
  };

  return (
    <div className="text-white min-h-screen flex flex-col items-center px-6 py-10">
      {/* HERO SECTION */}
      <div className="w-full max-w-4xl text-center mb-6">
        <div className="flex justify-center mb-3">
          <Database size={40} className="text-indigo-400 drop-shadow-md" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-wide mb-3">SQL Adventure Quest</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Learn SQL by playing through hands-on challenges. Solve database puzzles, execute queries, and level up your data mastery!
        </p>
      </div>

      {/* GAME MODULE DISPLAY — allow it to grow and scroll */}
      <div className="flex-1 w-full bg-gray-900 p-6 rounded-xl shadow-xl border border-gray-700 overflow-auto">
        {/* ensure each level gets its own full-height wrapper and remounts on change */}
        <div className="w-full h-full">
          <LevelComponent key={currentModule} />
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="flex justify-between items-center w-full max-w-4xl mt-6">
        <button
          onClick={goBack}
          disabled={currentModule === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <span className="text-gray-300 text-sm">Module {currentModule + 1} of {modules.length}</span>

        <button
          onClick={goNext}
          disabled={currentModule === modules.length - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40"
        >
          Next <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
