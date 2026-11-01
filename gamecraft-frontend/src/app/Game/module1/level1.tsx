"use client";
import { useState } from "react";
import { Sparkles, Play, RotateCcw, Database, Award, ChevronRight, AlertTriangle } from "lucide-react";
import SQLGameUI2 from "./level2";

type Feedback = { kind: "success" | "error" | "partial"; message: string } | null;

const LEVEL_1 = {
  question: "Write a query to return only students who scored more than 80.",
  hint: "Hint: SELECT * FROM students WHERE score > 80",
  expectedKeywords: ["SELECT", "FROM", "WHERE", "80"],
  acceptedAnswers: [
    "select * from students where score > 80;",
    "select * from students where score > 80",
    "select name, score from students where score > 80;",
    "select name, score from students where score > 80",
    "select * from students where score>80;",
    "select * from students where score>80",
  ],
};

export default function SQLGameLevel01() {
  const [query, setQuery] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [showHint, setShowHint] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const evaluateQuery = () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setFeedback({ kind: "error", message: "Write a SQL spell first, apprentice!" });
      return;
    }

    const lower = trimmed.toLowerCase().replace(/\s+/g, " ");
    const isAccepted = LEVEL_1.acceptedAnswers.includes(lower);
    const upper = trimmed.toUpperCase();
    const missing = LEVEL_1.expectedKeywords.filter((k) => !upper.includes(k));

    if (isAccepted) {
      setScore((prev) => prev + 100);
      setFeedback({
        kind: "success",
        message: "Excellent! Your query is correct — +100 points!",
      });
      setLevel(2);
      setUnlocked(true);
    } else if (missing.length <= 1) {
      setFeedback({
        kind: "partial",
        message: `Almost there! Recheck the condition on score (you need ${missing.join(", ") || "a small tweak"}).`,
      });
      setShowHint(true);
    } else {
      setFeedback({
        kind: "partial",
        message: "Not quite yet — look at the mission brief and try again.",
      });
      setShowHint(true);
    }
  };

  const resetLevel = () => {
    setQuery("");
    setFeedback(null);
    setShowHint(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6 flex justify-center items-center">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header with Score */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <Database className="w-10 h-10 text-cyan-400" />
            SQL Quest
          </h1>
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-white">
              <div className="text-xs opacity-75">Level</div>
              <div className="text-2xl font-bold">{level}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-xs opacity-75">Score</div>
                <div className="text-2xl font-bold">{score}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Character Section */}
          <div className="flex-shrink-0 w-64">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
              {/* Wizard Character */}
              <div className="relative">
                <div className="w-full aspect-square bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg">
                  {/* Wizard Hat */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
                    <div className="w-0 h-0 border-l-[40px] border-r-[40px] border-b-[60px] border-l-transparent border-r-transparent border-b-indigo-600" />
                    <div className="absolute top-[50px] left-1/2 -translate-x-1/2 w-24 h-6 bg-indigo-600 rounded-full" />
                    <Sparkles className="absolute top-8 left-1/2 -translate-x-1/2 w-6 h-6 text-yellow-300 animate-pulse" />
                  </div>

                  {/* Wizard Face */}
                  <div className="relative z-10 mt-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full">
                      {/* Eyes */}
                      <div className="absolute top-12 left-6 w-6 h-6 bg-gray-800 rounded-full">
                        <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full" />
                      </div>
                      <div className="absolute top-12 right-6 w-6 h-6 bg-gray-800 rounded-full">
                        <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full" />
                      </div>
                      {/* Smile */}
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-6 border-b-4 border-gray-800 rounded-full" />
                      {/* Beard */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-8 bg-white rounded-t-full" />
                    </div>
                  </div>

                  {/* Magic Sparkles */}
                  <Sparkles className="absolute top-4 right-4 w-4 h-4 text-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <Sparkles className="absolute bottom-4 left-4 w-4 h-4 text-cyan-300 animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
              </div>

              {/* Character Speech */}
              <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-xl p-4 relative">
                <div className="absolute -top-2 left-8 w-4 h-4 bg-white/20 rotate-45" />
                <p className="text-white text-sm leading-relaxed">
                  {feedback?.kind === "success"
                    ? "Magnificent! You have mastered the WHERE clause. Level 2 awaits!"
                    : feedback?.kind === "partial"
                      ? "Close, young one! Read my hint carefully and try again."
                      : "\"Query wisely, young apprentice! Master the SQL arts to unlock new levels!\""}
                </p>
              </div>
            </div>
          </div>

          {/* Main Game Area */}
          <div className="flex-1 space-y-4">
            {/* Question Box */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <p className="font-semibold text-cyan-300 text-sm uppercase tracking-wide">Mission Brief</p>
              </div>
              <p className="text-white text-lg">{LEVEL_1.question}</p>
              {showHint && (
                <p className="text-yellow-300/90 text-sm mt-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {LEVEL_1.hint}
                </p>
              )}
            </div>

            {/* Code Editor */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
              <label className="block text-sm font-medium text-cyan-300 mb-3 uppercase tracking-wide">
                Your SQL Spell:
              </label>
              <textarea
                className="w-full h-40 bg-gray-900/50 border border-white/20 rounded-xl p-4 font-mono text-sm text-green-400 placeholder-gray-500 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none resize-none shadow-inner"
                placeholder="SELECT * FROM..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) evaluateQuery();
                }}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={evaluateQuery}
                disabled={unlocked}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Play className="w-5 h-5" />
                {unlocked ? "Level Complete" : "Cast Query"}
              </button>
              <button
                onClick={resetLevel}
                className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>

            {/* Feedback */}
            <div className="min-h-8 flex items-center">
              {feedback?.kind === "success" && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {feedback.message}
                </div>
              )}
              {feedback && feedback.kind !== "success" && (
                <div className="bg-amber-500/20 border border-amber-500/50 text-amber-300 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {feedback.message}
                </div>
              )}
            </div>

            {/* Output Table */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
              <p className="font-semibold text-cyan-300 mb-4 uppercase tracking-wide text-sm">Query Results:</p>
              <div className="bg-gray-900/30 rounded-xl p-8 text-center">
                <Database className="w-12 h-12 text-gray-500 mx-auto mb-3 opacity-50" />
                <div className="text-gray-400 text-sm">
                  {feedback?.kind === "success"
                    ? "Your results are correct! Cast another spell or continue below..."
                    : "Your results will materialize here..."}
                </div>
              </div>
            </div>

            {/* Next Level */}
            {unlocked && (
              <a
                href="/Game/module1"
                className="block bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 px-6 py-3 rounded-xl shadow-lg transition-all duration-200 font-bold flex items-center justify-center gap-2 transform hover:scale-105"
              >
                Continue to Level 2
                <ChevronRight className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Level 2 is only rendered after Level 1 is solved */}
      {unlocked && <SQLGameUI2 />}
    </div>
  );
}
