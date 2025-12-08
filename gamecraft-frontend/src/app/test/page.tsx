"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, Trophy, Target, Zap } from "lucide-react";

// ---------------- Types ----------------

interface TablePreviewResponse {
    message: string;
    status: boolean;
    data: {
        [tableName: string]: Array<{ [column: string]: any }>;
    };
}

interface QuestionResponse {
    message: string;
    status: boolean;
    result?: boolean;
    data: {
        Id: number;
        Title: string;
        Description: string;
        UsedTables: string[];
        ContributedBy: string;
        Points: number;
        Answer?: string;
    };
}

interface Bubble {
    id: number;
    word: string;
    key: string;
}

// ---------------- Helpers ----------------

const shuffleArray = <T,>(arr: T[]) => {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// ---------------- Floating Bubble Component ----------------

const FloatingBubble = ({
    bubble,
    onClick,
    delay
}: {
    bubble: Bubble;
    onClick: () => void;
    delay: number;
}) => (
    <span
        onClick={onClick}
        className="floating-bubble bg-amber-700 m-2 cursor-pointer rounded-2xl px-4 py-2 text-white font-semibold shadow-lg hover:scale-110 transition-transform text-sm sm:text-base"
        style={{
            animationDelay: `${delay}s`,
        }}
    >
        {bubble.word}
    </span>
);

// ---------------- Table Preview ----------------

const TablePreview = ({
    tableName,
    rows,
}: {
    tableName: string;
    rows: any[];
}) => (
    <div className="bg-gradient-to-br from-white to-indigo-50 p-4 rounded-xl shadow-lg flex-shrink-0 w-full sm:w-80 border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-300 hover:scale-105">
        <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <h4 className="text-base sm:text-lg font-bold text-indigo-900">
                {tableName}
            </h4>
        </div>

        {rows.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-indigo-200">
                    <thead className="bg-indigo-100">
                        <tr>
                            {Object.keys(rows[0]).map((col) => (
                                <th
                                    key={col}
                                    className="px-2 sm:px-3 py-2 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-indigo-100">
                        {rows.slice(0, 3).map((row, idx) => (
                            <tr key={idx} className="hover:bg-indigo-50 transition-colors">
                                {Object.values(row).map((val, i) => (
                                    <td
                                        key={i}
                                        className="px-2 sm:px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-900"
                                    >
                                        {String(val)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <p className="text-sm text-gray-500">No preview available.</p>
        )}
    </div>
);

// ---------------- Main Component ----------------

const SQLQueryGameTailwind = () => {
    const searchParams = useSearchParams();
    const questionId = searchParams.get("id");

    const [question, setQuestion] = useState<QuestionResponse["data"] | null>(null);
    const [tablePreview, setTablePreview] = useState<TablePreviewResponse["data"]>({});
    const [availableBubbles, setAvailableBubbles] = useState<Bubble[]>([]);
    const [selectedQuery, setSelectedQuery] = useState<Bubble[]>([]);
    const [manualQuery, setManualQuery] = useState("");
    const [isManual, setIsManual] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [score, setScore] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [userQueryResult, setUserQueryResult] = useState<any>(null);
    const [correctQueryResult, setCorrectQueryResult] = useState<any>(null);

    // ---------------- 1. Fetch Question ----------------

    useEffect(() => {
        if (!questionId) return;

        const fetchQuestion = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `http://localhost:3001/getapis/get-question?id=${questionId}`
                );
                const json: QuestionResponse = await res.json();
                setQuestion(json.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [questionId]);

    // ---------------- 2. Generate Bubbles After Question Loads ----------------

    useEffect(() => {
        if (!question?.Answer) return;

        const tokens = question.Answer.match(/(\b\w+\b)|([.,*()=;])/g) || [];

        const bubbles: Bubble[] = tokens.map((word, i) => ({
            id: i,
            word,
            key: `${word}-${i}`,
        }));

        setAvailableBubbles(shuffleArray(bubbles));
    }, [question]);

    // ---------------- 3. Fetch Table Preview ----------------

    useEffect(() => {
        if (!question?.UsedTables) return;

        const fetchPreview = async () => {
            const tables = question.UsedTables.join(",");
            const res = await fetch(
                `http://localhost:3001/getapis/get-tables-preview?tables=${tables}`
            );
            const json: TablePreviewResponse = await res.json();
            if (json.status) setTablePreview(json.data);
        };

        fetchPreview();
    }, [question]);

    // ---------------- Computed Queries ----------------

    const correctQuery = useMemo(() => {
        return question?.Answer?.trim().toLowerCase() || "";
    }, [question]);

    const userQuery = useMemo(() => {
        return selectedQuery.map((b) => b.word).join(" ").toLowerCase().trim();
    }, [selectedQuery]);

    // ---------------- Handlers ----------------

    const selectBubble = (b: Bubble) => {
        setSelectedQuery((prev) => [...prev, b]);
        setAvailableBubbles((prev) => prev.filter((x) => x.id !== b.id));
    };

    const undoBubble = (b: Bubble) => {
        setSelectedQuery((prev) => prev.filter((x) => x.id !== b.id));
        setAvailableBubbles((prev) => shuffleArray([...prev, b]));
    };

    const checkAnswer = () => {
        const user = isManual ? manualQuery.trim().toLowerCase() : userQuery;

        //payload Builder
        const payload = {
            question_id: (questionId) ? parseInt(questionId) : 0,
            title: question?.Title,
            user_query: user,
        }

        console.log("payload is", payload)

        //run query api call
        async function runUserQuery() {
            try {
                const response = await fetch('http://localhost:3001/api/run-query', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();   // await correctly

                // console.log('User query result:', data);

                //  WRONG: if (response.status)
                // response.status = HTTP CODE (200, 400...)
                // 
                // RIGHT: if (data.status)
                if (data.status) {
                    setUserQueryResult(data.user_result);
                    setCorrectQueryResult(data.correct_result);

                    // console.log('Correct query result:', data.correct_result);
                } else {
                    window.alert("There was an error with your query.");
                    console.warn("Query incorrect:", data.message);
                }

                return data;

            } catch (error) {
                console.error('Error running user query:', error);
                return null;
            }
        }

        runUserQuery();

        if (!correctQuery) {
            setFeedback("❌ No correct answer found in backend.");
            return;
        }

        if (user === correctQuery) {
            setFeedback("✅ Correct! Well done.");
            setScore(prev => prev + (question?.Points || 10));
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        } else {
            setFeedback("❌ Incorrect. Try again!");
        }
    };



    // ---------------- UI ----------------

    if (!question)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
                    <p className="mt-4 text-2xl text-white font-bold">Loading Challenge...</p>
                </div>
            </div>
        );

    return (
        <>
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    25% { transform: translateY(-20px) rotate(5deg); }
                    50% { transform: translateY(-10px) rotate(-5deg); }
                    75% { transform: translateY(-15px) rotate(3deg); }
                }
                
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 10px rgba(251, 191, 36, 0.5); }
                    50% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.8); }
                }

                .floating-bubble {
                    display: inline-block;
                    padding: 0.5rem 1rem;
                    margin: 0.5rem;
                    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                    color: white;
                    border-radius: 9999px;
                    cursor: pointer;
                    font-weight: 600;
                    animation: float 3s ease-in-out infinite, pulse-glow 2s ease-in-out infinite;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(251, 191, 36, 0.4);
                    font-size: 0.875rem;
                }

                .floating-bubble:hover {
                    transform: scale(1.15) translateY(-5px);
                    box-shadow: 0 8px 25px rgba(251, 191, 36, 0.6);
                }

                @keyframes confetti {
                    0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }

                .confetti {
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: #fbbf24;
                    animation: confetti 3s linear forwards;
                }

                @media (max-width: 640px) {
                    .floating-bubble {
                        padding: 0.375rem 0.75rem;
                        font-size: 0.75rem;
                        margin: 0.25rem;
                    }
                }
            `}</style>

            <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 py-4 sm:py-10 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Confetti Effect */}
                    {showConfetti && (
                        <div className="fixed inset-0 pointer-events-none z-50">
                            {[...Array(50)].map((_, i) => (
                                <div
                                    key={i}
                                    className="confetti"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        background: ['#fbbf24', '#f59e0b', '#8b5cf6', '#3b82f6'][Math.floor(Math.random() * 4)],
                                        animationDelay: `${Math.random() * 0.5}s`,
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Header Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 mb-6 sm:mb-8">
                        {/* Score Bar */}
                        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                            <div className="flex items-center gap-3">
                                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-600">Your Score</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{score}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-500 px-4 sm:px-6 py-2 sm:py-3 rounded-xl">
                                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                <div>
                                    <p className="text-xs text-white/80">Challenge Points</p>
                                    <p className="text-lg sm:text-xl font-bold text-white">{question.Points}</p>
                                </div>
                            </div>
                        </div>

                        {/* Question */}
                        <div className="flex items-start gap-3 mb-4">
                            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    {questionId} {question.Title}
                                </h2>
                                <p className="text-sm sm:text-base text-gray-700 mt-2">{question.Description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tables */}
                    <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-4 sm:p-6 mb-6 sm:mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
                            <h3 className="text-lg sm:text-xl font-bold text-indigo-900">Database Tables</h3>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4">
                            {question.UsedTables.map((t) => (
                                <TablePreview
                                    key={t}
                                    tableName={t}
                                    rows={tablePreview[t.toLowerCase()] || []}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Query Builder */}
                    <div className="bg-white text-black rounded-2xl shadow-2xl p-4 sm:p-8">
                        <h3 className="text-lg sm:text-2xl font-bold text-yellow-600 mb-4 flex items-center gap-2">
                            <span className="text-2xl sm:text-3xl">🎯</span> Build Your SQL Query
                        </h3>

                        {/* Selected Query Display */}
                        <div className="border-4 border-dashed border-indigo-300 p-4 sm:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex flex-wrap gap-2 min-h-[80px] sm:min-h-[100px] mb-6">
                            {selectedQuery.map((b) => (
                                <span
                                    key={b.key}
                                    onClick={() => undoBubble(b)}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full cursor-pointer font-bold shadow-lg hover:scale-110 transition-transform text-sm sm:text-base"
                                >
                                    {b.word}
                                </span>
                            ))}
                            {selectedQuery.length === 0 && !isManual && (
                                <span className="text-gray-400 italic text-sm sm:text-base m-auto">
                                    ✨ Click the floating bubbles below to build your query...
                                </span>
                            )}
                        </div>

                        {/* Floating Bubbles */}
                        {!isManual && (
                            <div className="relative border-4 border-yellow-400 p-6 sm:p-8 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 min-h-[250px] sm:min-h-[300px] flex flex-wrap justify-center items-center content-center">
                                {availableBubbles.map((b, idx) => (
                                    <FloatingBubble
                                        key={b.key}
                                        bubble={b}
                                        onClick={() => selectBubble(b)}
                                        delay={idx * 0.1}
                                    />
                                ))}
                                {availableBubbles.length === 0 && (
                                    <p className="text-gray-500 italic text-sm sm:text-base">All bubbles selected! 🎉</p>
                                )}
                            </div>
                        )}

                        {/* Manual Query Mode */}
                        {isManual && (
                            <textarea
                                className="w-full border-4 border-indigo-300 p-4 rounded-xl font-mono bg-gray-50 focus:border-indigo-500 focus:outline-none text-sm sm:text-base"
                                rows={6}
                                value={manualQuery}
                                onChange={(e) => setManualQuery(e.target.value)}
                                placeholder="Write your SQL query here..."
                            />
                        )}

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                            <button
                                onClick={checkAnswer}
                                className="flex-1 px-6 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
                            >
                                🚀 Check Answer
                            </button>

                            <button
                                onClick={() => setIsManual(!isManual)}
                                className="flex-1 px-6 py-3 sm:py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
                            >
                                {isManual ? "🎮 Back to Bubbles" : "⌨️ Manual Mode"}
                            </button>
                        </div>

                        {/* Feedback */}
                        {feedback && (
                            <div className={`mt-6 p-4 sm:p-6 rounded-xl font-bold text-base sm:text-lg text-center ${feedback.includes("Correct")
                                ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white animate-pulse"
                                : "bg-gradient-to-r from-red-400 to-pink-500 text-white"
                                }`}>
                                {feedback}
                            </div>
                        )}

                        <div>
                            {(correctQueryResult || userQueryResult) ? (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div>
                                        <TablePreview
                                            tableName="Correct Answer"
                                            rows={correctQueryResult || []}
                                        />
                                    </div>

                                    <div>
                                        <TablePreview
                                            tableName="Your Answer"
                                            rows={userQueryResult || []}
                                        />
                                    </div>
                                </div>

                            ) : ("")}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SQLQueryGameTailwind;