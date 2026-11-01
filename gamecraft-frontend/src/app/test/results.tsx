"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Trophy, ArrowLeft } from "lucide-react";

function ResultsContent() {
  const searchParams = useSearchParams();
  const questionId = searchParams.get("questionId");
  const correct = searchParams.get("correct") === "true";
  const points = searchParams.get("points");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <div
          className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
            correct ? "bg-green-500/20 border-2 border-green-400" : "bg-red-500/20 border-2 border-red-400"
          }`}
        >
          <Trophy className={`w-10 h-10 ${correct ? "text-green-400" : "text-red-400"}`} />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">
          {correct ? "Challenge Complete!" : "Try Again!"}
        </h1>
        <p className="text-gray-300 mb-6">
          {correct
            ? "Your query produced the expected results."
            : "Your query did not match the expected results yet."}
        </p>

        {questionId && (
          <div className="bg-gray-900/50 rounded-lg p-4 mb-6 text-sm text-gray-300">
            <p>
              Question ID: <span className="text-cyan-400 font-mono">{questionId}</span>
            </p>
            {points && <p>Points: <span className="text-yellow-400 font-bold">{points}</span></p>}
          </div>
        )}

        <a
          href="/features"
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl transition-all font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Challenges
        </a>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900" />}>
      <ResultsContent />
    </Suspense>
  );
}
