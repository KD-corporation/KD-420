"use client";

import React, { useEffect, useState } from "react";
import { Database, Plus, Zap, Trophy, Target, Sparkles, Play, ChevronRight, Swords, Shield } from "lucide-react";

import TablesPreviewResponse from "./PreviewOfTables";
import { env } from "process";

/* ---------------------- INTERFACES ---------------------- */

interface TableFormat {
  id?: string;
  TableName: string;
  Description?: string;
  CreatedAt?: Date | number;
  tablesColumns: string;
}

interface QuestionFormat {
  contributed_by: string;
  title: string;
  description: string;
  topics: string[];
  answer: string;
  difficulty_level: string;
  rewards: number;
  used_tables: string[];
}

interface SelectedTableFormat {
  id: string;
  TableName: string;
}

interface SelectedTableDataFormat {
  id: string;
  TableName: string;
  Description?: string;
  CreatedAt?: Date;
  tablesColumns?: string[];
}

/* -------------------------------------------------------- */

export default function AddQuestionPage() {
  const [tableData, setTableData] = useState<TableFormat[]>([]);
  const [selectedTableData, setSelectedTableData] = useState<SelectedTableDataFormat[]>([]);

  const [selectedTable, setSelectedTable] = useState<SelectedTableFormat>({
    id: "",
    TableName: "",
  });

  const [questionData, setQuestionData] = useState<QuestionFormat>({
    contributed_by: "",
    title: "",
    description: "",
    topics: [],
    answer: "",
    difficulty_level: "",
    rewards: 0,
    used_tables: [],
  });



  const [tableInputData, setTableInputData] = useState<TableFormat>({
    TableName: "",
    Description: "",
    tablesColumns: "",
    CreatedAt: Date.now(),
  });

  /* ---------------------- LOAD TABLES ---------------------- */

  useEffect(() => {
    async function loadTables() {
      try {
        const res = await fetch("/api/getTables", { cache: "no-store" });
        const data = await res.json();
        setTableData(data);
      } catch (err) {
        console.error("Failed to load tables", err);
      }
    }
    loadTables();
  }, []);

  /* ---------------------- HANDLERS ---------------------- */

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setQuestionData((prev) => ({
        ...prev,
        contributed_by: parsed.email || "",
      }));
    }
  }, []);


  const handleAddQuestion = async () => {
    try {
      const Base_Url = env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
      const res = await fetch(`${Base_Url}/api/contribute-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionData),
      });

      const saved = await res.json();
      console.log("Saved question →", saved);

      alert("Question added!");
    } catch (err) {
      console.error("Failed to save question", err);
    }
  };


  const handleCreateTable = async () => {
    try {
      // Extract values from your form state
      const tableName = tableInputData.TableName || tableInputData.TableName;
      const description = tableInputData.Description || tableInputData.Description;
      const query = tableInputData.tablesColumns || tableInputData.tablesColumns;
      const createdBy = "Gkrrr"; // Replace with logged-in user if needed

      // Basic validation
      if (!tableName || !query) {
        return alert("Table Name and Query are required");
      }

      // Prevent dangerous queries
      if (query.toLowerCase().includes("delete")) {
        return alert("Delete queries are not allowed");
      }

      // Prepare payload as backend expects
      const payload = {
        tableName,
        description,
        createdBy,
        query,
      };

      // Send POST request to backend
      const Base_Url = env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
      const res = await fetch(`${Base_Url}/api/create-table`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const saved = await res.json();

      if (!res.ok) {
        // Handle server-side errors
        return alert(saved.message || "Table creation failed");
      }

      alert(saved.message || "Table created successfully!");
      console.log(saved);

    } catch (err) {
      console.error("Table creation failed", err);
      alert("An error occurred while creating the table.");
    }
  };


  const fetchSelectedTable = async () => {
    if (!selectedTable.id) return alert("Please select a table");

    try {
      const Base_Url = env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
      const res = await fetch(`${Base_Url}/api/get-tables-preview-all}`);
      const data = await res.json();
      setSelectedTableData([data]);
    } catch (err) {
      console.error("Failed to fetch table", err);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy": return "text-green-400 bg-green-950/50 border-green-500/30";
      case "Medium": return "text-yellow-400 bg-yellow-950/50 border-yellow-500/30";
      case "Hard": return "text-red-400 bg-red-950/50 border-red-500/30";
      default: return "text-gray-400 bg-gray-950/50 border-gray-500/30";
    }
  };

  /* ---------------------- UI COMPONENT ---------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Swords className="w-10 h-10 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Quiz Master Console
            </h1>
            <Shield className="w-10 h-10 text-cyan-400" />
          </div>
          <p className="text-purple-300/80 text-lg">Level up your quiz game</p>
        </div>

        {/* ---------------- CREATE TABLE ---------------- */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-950/80 to-slate-900/80 backdrop-blur-sm border border-purple-500/30 shadow-2xl shadow-purple-500/20">
          <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Database className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Create Database Table</h2>
              <Sparkles className="w-5 h-5 text-yellow-400 ml-auto animate-pulse" />
            </div>

            <div className="space-y-4">
              <input
                placeholder="⚡ Table Name"
                className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                onChange={(e) =>
                  setTableInputData({ ...tableInputData, TableName: e.target.value })
                }
              />

              <input
                placeholder="📝 Description"
                className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                onChange={(e) =>
                  setTableInputData({ ...tableInputData, Description: e.target.value })
                }
              />

              <div>
                <input
                  placeholder="CREATE TABLE Tabel_Name (column1, column2, ...)"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                  onChange={(e) =>
                    setTableInputData({
                      ...tableInputData,
                      tablesColumns: e.target.value
                    })
                  }
                />
              </div>

              <button
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                onClick={handleCreateTable}
              >
                <Plus className="w-5 h-5" />
                Create Table
              </button>
            </div>
          </div>
        </section>

        <TablesPreviewResponse />

        {/* ---------------- AVAILABLE TABLES ---------------- */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-950/80 to-slate-900/80 backdrop-blur-sm border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
          <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Database className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Available Tables</h2>
            </div>

            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {tableData.map((t) => (
                <label
                  key={t.id}
                  className="flex items-center gap-3 p-3 bg-slate-800/30 hover:bg-slate-800/50 border border-cyan-500/20 rounded-xl cursor-pointer transition-all group"
                >
                  <input
                    type="radio"
                    name="selectedTable"
                    className="w-5 h-5 accent-cyan-500"
                    onChange={() =>
                      setSelectedTable({ id: t.id!, TableName: t.TableName })
                    }
                  />
                  <span className="text-cyan-100 font-medium group-hover:text-cyan-300 transition-colors">{t.TableName}</span>
                  <ChevronRight className="w-4 h-4 text-cyan-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </label>
              ))}
            </div>

            <button
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              onClick={fetchSelectedTable}
            >
              <Play className="w-5 h-5" />
              Load Selected Table
            </button>
          </div>
        </section>

        {/* ---------------- SELECTED TABLE DATA ---------------- */}
        {selectedTableData.length > 0 && (
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-900/80 backdrop-blur-sm border border-emerald-500/30 shadow-2xl shadow-emerald-500/20">
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
            <div className="relative p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Zap className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Selected Table Data</h2>
              </div>

              {selectedTableData.map((t) => (
                <div key={t.id} className="p-5 bg-slate-800/30 border border-emerald-500/30 rounded-xl">
                  <h3 className="text-xl font-bold text-emerald-300 mb-2">{t.TableName}</h3>
                  <p className="text-gray-300 mb-3">{t.Description}</p>
                  <div className="flex flex-wrap gap-2">
                    {t.tablesColumns?.map((col, idx) => (
                      <span
                        key={idx}
                        className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 px-3 py-1 rounded-lg text-sm"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ---------------- ADD QUESTION ---------------- */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-950/80 to-slate-900/80 backdrop-blur-sm border border-pink-500/30 shadow-2xl shadow-pink-500/20">
          <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <Trophy className="w-6 h-6 text-pink-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Add New Question</h2>
              <Sparkles className="w-5 h-5 text-yellow-400 ml-auto animate-pulse" />
            </div>

            <div className="space-y-4">
              <input
                placeholder="🎯 Question Title"
                className="w-full px-4 py-3 bg-slate-800/50 border border-pink-500/30 rounded-xl text-white placeholder-pink-300/50 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all"
                onChange={(e) =>
                  setQuestionData({ ...questionData, title: e.target.value })
                }
              />

              <textarea
                placeholder="❓ Question Description"
                rows={3}
                className="w-full px-4 py-3 bg-slate-800/50 border border-pink-500/30 rounded-xl text-white placeholder-pink-300/50 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all resize-none"
                onChange={(e) =>
                  setQuestionData({
                    ...questionData,
                    description: e.target.value,
                  })
                }
              />

              <input
                placeholder="🏷️ Topics (comma separated)"
                className="w-full px-4 py-3 bg-slate-800/50 border border-pink-500/30 rounded-xl text-white placeholder-pink-300/50 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all"
                onChange={(e) =>
                  setQuestionData({
                    ...questionData,
                    topics: e.target.value
                      .split(",")
                      .map((x) => x.trim())
                      .filter((x) => x !== ""),
                  })
                }
              />

              {questionData.topics?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {questionData.topics.map((t, index) => (
                    <span
                      key={index}
                      className="bg-pink-500/20 border border-pink-400/30 text-pink-200 px-3 py-1 rounded-full text-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}


              <input
                placeholder="Answer"
                className="w-full px-4 py-3 bg-slate-800/50 border border-pink-500/30 rounded-xl text-white placeholder-pink-300/50 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all"
                onChange={(e) =>
                  setQuestionData({ ...questionData, answer: e.target.value })
                }
              />

              <select
                className="w-full px-4 py-3 bg-slate-800/50 border border-pink-500/30 rounded-xl text-white focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all"
                onChange={(e) =>
                  setQuestionData({ ...questionData, difficulty_level: e.target.value })
                }
              >
                <option value="">⚔️ Select Difficulty</option>
                <option value="Easy">🟢 Easy</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Hard">🔴 Hard</option>
              </select>

              <input
                placeholder="💎 Points"
                type="number"
                className="w-full px-4 py-3 bg-slate-800/50 border border-pink-500/30 rounded-xl text-white placeholder-pink-300/50 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all"
                onChange={(e) =>
                  setQuestionData({ ...questionData, rewards: Number(e.target.value) })
                }
              />

              <div>
                <input
                  placeholder="🗂️ Used Table Columns (comma separated)"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-pink-500/30 rounded-xl text-white placeholder-pink-300/50 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all"
                  onChange={(e) =>
                    setQuestionData({
                      ...questionData,
                      used_tables: e.target.value
                        .split(",")
                        .map((x) => x.trim())
                        .filter((x) => x !== ""),
                    })
                  }
                />

                {questionData.used_tables && questionData.used_tables.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm text-pink-300/70 mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Linked columns:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {questionData.used_tables.map((col, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/30 text-pink-200 px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-pink-500/10"
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                className="w-full px-6 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-pink-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
                onClick={handleAddQuestion}
              >
                <Trophy className="w-6 h-6" />
                Add Question to Arena
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}