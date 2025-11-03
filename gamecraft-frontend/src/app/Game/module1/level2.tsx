"use client";
import { useState } from "react";
import { Sparkles, Play, RotateCcw, Database, Award, ChevronRight, Trophy, Zap } from "lucide-react";

export default function SQLGameLevel02() {
  const [query, setQuery] = useState("");
  const [score, setScore] = useState(150);
  const [level, setLevel] = useState(2);
  const [feedback, setFeedback] = useState("");
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      level: 1,
      question: "Write a query to return only students who scored more than 80.",
      hint: "Use WHERE clause with a comparison operator",
      table: "students",
      expectedKeywords: ["SELECT", "FROM", "WHERE", ">", "80"]
    },
    {
      level: 2,
      question: "Find all products with a price between 50 and 100, ordered by price ascending.",
      hint: "Use BETWEEN and ORDER BY clauses",
      table: "products",
      expectedKeywords: ["SELECT", "FROM", "WHERE", "BETWEEN", "ORDER BY", "ASC"]
    },
    {
      level: 3,
      question: "Count the number of orders for each customer and show only customers with more than 5 orders.",
      hint: "Use GROUP BY, COUNT(), and HAVING clauses",
      table: "orders",
      expectedKeywords: ["SELECT", "COUNT", "GROUP BY", "HAVING", ">", "5"]
    }
  ];

  const currentQuestion = questions[Math.min(level - 1, questions.length - 1)];

  const sampleResults: Record<number, Record<string, string | number>[]> = {
    1: [
      { id: 1, name: "Alice", score: 85 },
      { id: 2, name: "Bob", score: 92 },
      { id: 3, name: "Charlie", score: 88 }
    ],
    2: [
      { id: 1, product: "Laptop", price: 75 },
      { id: 2, product: "Mouse", price: 55 },
      { id: 3, product: "Keyboard", price: 90 }
    ],
    3: [
      { customer: "Alice", order_count: 8 },
      { customer: "Bob", order_count: 12 },
      { customer: "Charlie", order_count: 6 }
    ]
  };

  const handleRunQuery = () => {
    const upperQuery = query.toUpperCase();
    const hasRequiredKeywords = currentQuestion.expectedKeywords.every(keyword => 
      upperQuery.includes(keyword.toUpperCase())
    );

    if (query.trim() === "") {
      setFeedback("error");
      setShowResults(false);
      return;
    }

    if (hasRequiredKeywords) {
      setFeedback("success");
      setShowResults(true);
      setScore(prev => prev + 50);
    } else {
      setFeedback("partial");
      setShowResults(false);
    }
  };

  const handleNextLevel = () => {
    if (level < questions.length) {
      setLevel(prev => prev + 1);
      setQuery("");
      setFeedback("");
      setShowResults(false);
    }
  };

  const wizardMessages: Record<string, string> = {
    default: "Query wisely, young apprentice! Master the SQL arts to unlock new levels!",
    success: "Magnificent! Your SQL powers grow stronger! Ready for the next challenge?",
    partial: "Not quite there yet. Remember my hint and try again!",
    error: "You must write a spell first, apprentice!"
  };

  const wizardMessage = wizardMessages[feedback] || wizardMessages.default;

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
              <div className="text-2xl font-bold flex items-center gap-1">
                {level}
                <span className="text-xs opacity-50">/ {questions.length}</span>
              </div>
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
                <div className={`w-full aspect-square bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg transition-all duration-500 ${
                  feedback === "success" ? "scale-105 shadow-green-500/50" : ""
                }`}>
                  {/* Wizard Hat */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
                    <div className="w-0 h-0 border-l-[40px] border-r-[40px] border-b-[60px] border-l-transparent border-r-transparent border-b-indigo-600" />
                    <div className="absolute top-[50px] left-1/2 -translate-x-1/2 w-24 h-6 bg-indigo-600 rounded-full" />
                    <Sparkles className={`absolute top-8 left-1/2 -translate-x-1/2 w-6 h-6 text-yellow-300 ${
                      feedback === "success" ? "animate-spin" : "animate-pulse"
                    }`} />
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
                      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-6 border-b-4 border-gray-800 rounded-full transition-all ${
                        feedback === "success" ? "w-16" : ""
                      }`} />
                      {/* Beard */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-8 bg-white rounded-t-full" />
                    </div>
                  </div>

                  {/* Magic Sparkles */}
                  <Sparkles className="absolute top-4 right-4 w-4 h-4 text-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <Sparkles className="absolute bottom-4 left-4 w-4 h-4 text-cyan-300 animate-pulse" style={{ animationDelay: '1s' }} />
                  
                  {/* Success Effect */}
                  {feedback === "success" && (
                    <>
                      <Zap className="absolute top-1/2 left-2 w-6 h-6 text-yellow-300 animate-bounce" />
                      <Zap className="absolute top-1/2 right-2 w-6 h-6 text-yellow-300 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </>
                  )}
                </div>
              </div>

              {/* Character Speech */}
              <div className={`mt-4 backdrop-blur-sm rounded-xl p-4 relative transition-all duration-300 ${
                feedback === "success" ? "bg-green-500/30 border border-green-400/50" : 
                feedback === "error" ? "bg-red-500/30 border border-red-400/50" :
                feedback === "partial" ? "bg-yellow-500/30 border border-yellow-400/50" :
                "bg-white/20"
              }`}>
                <div className={`absolute -top-2 left-8 w-4 h-4 rotate-45 ${
                  feedback === "success" ? "bg-green-500/30" : 
                  feedback === "error" ? "bg-red-500/30" :
                  feedback === "partial" ? "bg-yellow-500/30" :
                  "bg-white/20"
                }`} />
                <p className="text-white text-sm leading-relaxed">
                  "{wizardMessage}"
                </p>
              </div>
            </div>
          </div>

          {/* Main Game Area */}
          <div className="flex-1 space-y-4">
            {/* Question Box */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <p className="font-semibold text-cyan-300 text-sm uppercase tracking-wide">
                    Level {level} Mission
                  </p>
                </div>
                <div className="flex items-center gap-1 text-yellow-400 text-xs">
                  <Trophy className="w-4 h-4" />
                  +50 XP
                </div>
              </div>
              <p className="text-white text-lg mb-3">
                {currentQuestion.question}
              </p>
              <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 mt-3">
                <p className="text-blue-200 text-sm">
                  💡 <span className="font-semibold">Hint:</span> {currentQuestion.hint}
                </p>
              </div>
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
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={handleRunQuery}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2 transform hover:scale-105"
              >
                <Play className="w-5 h-5" />
                Cast Query
              </button>
              <button
                onClick={() => {
                  setQuery("");
                  setFeedback("");
                  setShowResults(false);
                }}
                className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
              {feedback === "success" && level < questions.length && (
                <button
                  onClick={handleNextLevel}
                  className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2 transform hover:scale-105 animate-pulse"
                >
                  Next Level
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Feedback Messages */}
            <div className="h-8 flex items-center">
              {feedback === "success" && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 animate-pulse">
                  <Sparkles className="w-4 h-4" />
                  Excellent! Your query is correct! +50 XP
                </div>
              )}
              {feedback === "partial" && (
                <div className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                  ⚠️ Close, but check the hint and try again!
                </div>
              )}
              {feedback === "error" && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                  ❌ Please write a query first!
                </div>
              )}
            </div>

            {/* Output Table */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
              <p className="font-semibold text-cyan-300 mb-4 uppercase tracking-wide text-sm">Query Results:</p>
              {showResults ? (
                <div className="bg-gray-900/30 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-cyan-900/50">
                      <tr>
                        {Object.keys(sampleResults[level][0]).map((key) => (
                          <th key={key} className="px-4 py-3 text-left text-cyan-300 font-semibold text-sm uppercase tracking-wide">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sampleResults[level].map((row, idx) => (
                        <tr key={idx} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                          {Object.values(row).map((val, i) => (
                            <td key={i} className="px-4 py-3 text-white text-sm">
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-900/30 rounded-xl p-8 text-center">
                  <Database className="w-12 h-12 text-gray-500 mx-auto mb-3 opacity-50" />
                  <div className="text-gray-400 text-sm">
                    Your results will materialize here...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}