"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Database,
  Zap,
  Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Question {
  Id: number;
  Title: string;
  Description: string;
}

interface ApiResponse {
  message: string;
  status: boolean;
  result?: boolean;
  data: Question[];
}

export default function SqlQuestions({ search = "", level = "" }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // ---------------------------
  // Fetch ALL questions once
  // ---------------------------
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("http://localhost:3001/getapis/get-question-all");
        const json: ApiResponse = await res.json();

        if (json.status && Array.isArray(json.data)) {
          setQuestions(json.data);
        } else {
          setError("Failed to fetch questions");
        }
      } catch (err) {
        setError("Network error while fetching questions");
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, []);

  // ---------------------------
  // Fetch FILTERED questions on search/level change
  // ---------------------------
  useEffect(() => {
    async function fetchFiltered() {
      try {
        const res = await fetch(
          `http://localhost:3001/getapis/get-questions-by-filters?search=${encodeURIComponent(
            search
          )}&level=${encodeURIComponent(level)}`
        );

        const json: ApiResponse = await res.json();

        if (json.status && Array.isArray(json.data)) {
          setQuestions(json.data);
        } else {
          setError("Failed to fetch filtered questions");
        }
      } catch (err) {
        setError("Network error while applying filters");
      }
    }

    if (search !== "" || level !== "") {
      fetchFiltered();
    }
  }, [search, level]);

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur-xl opacity-30"></div>

          <div className="relative bg-slate-800/80 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-cyan-400 to-purple-500 p-3 rounded-xl shadow-lg shadow-cyan-500/50">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    SQL Practice Arena
                  </h1>
                  <p className="text-slate-400 text-sm mt-1">
                    Master your database skills
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-lg border border-purple-500/30">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-bold">{questions.length}</span>
                <span className="text-slate-400 text-sm">Challenges</span>
              </div>

            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
              <Zap className="w-6 h-6 text-cyan-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4 text-red-400">
            <p className="font-semibold">⚠️ {error}</p>
          </div>
        )}

        {/* Question List */}
        <div className="grid gap-4">
          {questions.map((q, index) => (
            <div key={q.Id} className="group relative">

              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Card */}
              <div className="relative bg-slate-800/60 backdrop-blur-sm border border-slate-700 hover:border-cyan-500/50 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-[1.02]">

                <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>

                <button
                  onClick={() => toggle(q.Id)}
                  className="w-full p-5 text-left flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-cyan-500/20 rounded-lg border border-cyan-500/30">
                      <span className="text-cyan-400 font-bold text-sm">#{index + 1}</span>
                    </div>

                    <h2 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {q.Title}
                    </h2>
                  </div>

                  <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-700">
                    {openId === q.Id ? (
                      <ChevronUp className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                {openId === q.Id && (
                  <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 mb-4">
                      <p className="text-slate-300 leading-relaxed">{q.Description}</p>
                    </div>

                    <button
                      onClick={() =>
                        router.push(
                          `/test?id=${q.Id}&title=${encodeURIComponent(
                            q.Title
                          )}&Des=${encodeURIComponent(q.Description)}`
                        )
                      }
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg text-white font-semibold shadow-lg hover:scale-105 transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Start Challenge
                      </span>
                    </button>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

        {/* EMPTY */}
        {!loading && questions.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 max-w-md mx-auto">
              <Database className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No questions available yet</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
