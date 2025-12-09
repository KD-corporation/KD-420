"use client";

import { Search, Filter, Trophy, Zap, Target, Flame, Code, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SqlQuestions from "../components/QuestionFormates/All-question";

interface LevelOption {
    value: string;
    label: string;
    color: string;
    icon: string;
}

export const Features = () => {
    const levelOptions: LevelOption[] = [
        { value: "Easy", label: "Easy", color: "text-green-500", icon: "🟢" },
        { value: "Medium", label: "Medium", color: "text-yellow-500", icon: "🟡" },
        { value: "Hard", label: "Hard", color: "text-red-500", icon: "🔴" },
    ];

    const [searchValue, setSearchValue] = useState("");
    const [debouncedValue, setDebouncedValue] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [stats, setState] = useState({
        Easy: 0,
        Medium: 0,
        Hard: 0,
        totalEasy: 0,
        totalMedium: 0,
        totalHard: 0,
        solved: 0,
        total: 0,
        points_earned : 0,
    });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const email = userData.email || "";

        const fetchStats = async () => {
            try {
                const response = await fetch(`http://localhost:3001/getapis/get-total-solved?email=${email}`, {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = (await response.json()).data;
                    // console.log(data)
                    setState({
                        Easy: data.total_easy_solved || 0,
                        Medium: data.total_medium_solved || 0,
                        Hard: data.total_hard_solved || 0,
                        totalEasy: data.total_available_easy || 0,
                        totalMedium: data.total_available_medium || 0,
                        totalHard: data.total_available_hard || 0,
                        solved: data.total_easy_solved + data.total_medium_solved + data.total_hard_solved || 0,
                        total: data.total_available_easy + data.total_available_medium + data.total_available_hard || 0,
                        points_earned: data.points_earned || 0,
                    });
                } else {
                    console.error("Failed to fetch user stats");
                }
            } catch (error) {
                console.error("Error fetching user stats:", error);
            }
        };

        fetchStats();
    }, [])

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(searchValue);
        }, 400);

        return () => clearTimeout(handler);
    }, [searchValue]);

    const queryString = useMemo(() => {
        const arrQueries = debouncedValue.split(" ").filter(Boolean);
        const mapped = arrQueries
            .map((q, i) => `query${i + 1}=${encodeURIComponent(q)}`)
            .join("&");
        return `${mapped}&originalSearch=${encodeURIComponent(debouncedValue)}`;
    }, [debouncedValue]);

    const handleLevelChange = (level: string) => {
        setSelectedLevel(selectedLevel === level ? "" : level);
        console.log("Selected Level:", level);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600">
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                                <Code className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                SQLCode
                            </span>
                        </div>

                        {/* Quick Links */}
                        <div className="hidden md:flex items-center gap-6">
                            <a href="/Game/mazeExplorer" className="flex items-center gap-2 text-gray-600 hover:text-orange-600 font-medium transition-colors group">
                                <Target className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                Maze Explorer
                            </a>
                            <a href="/test" className="flex items-center gap-2 text-gray-600 hover:text-orange-600 font-medium transition-colors group">
                                <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Bubble Select
                            </a>
                            <a href="/Game/Arrange-queries" className="flex items-center gap-2 text-gray-600 hover:text-orange-600 font-medium transition-colors group">
                                <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                Arrange Query
                            </a>
                        </div>

                        {/* User Stats */}
                        <div className="hidden lg:flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                                <Flame className="w-4 h-4 text-orange-500" />
                                <span className="text-sm font-bold text-gray-700">{0} day streak</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                                <Trophy className="w-4 h-4 text-purple-500" />
                                <span className="text-sm font-bold text-gray-700">{stats.points_earned}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Progress Card */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-600 text-sm font-medium">Problems Solved</span>
                            <Trophy className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-gray-900">{stats.solved}</span>
                            <span className="text-gray-500 text-sm">/ {stats.total}</span>
                        </div>
                        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(stats.solved / stats.total) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Easy Card */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-600 text-sm font-medium">Easy</span>
                            <span className="text-2xl">🟢</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-green-600">{stats.Easy}</span>
                            <span className="text-gray-500 text-sm">/ {stats.totalEasy}</span>
                        </div>
                        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stats.Easy / stats.totalEasy) * 100}%` }} />
                        </div>
                    </div>

                    {/* Medium Card */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-600 text-sm font-medium">Medium</span>
                            <span className="text-2xl">🟡</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-yellow-600">{stats.Medium}</span>
                            <span className="text-gray-500 text-sm">/ {stats.totalMedium}</span>
                        </div>
                        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(stats.Medium / stats.totalMedium) * 100}%` }} />
                        </div>
                    </div>

                    {/* Hard Card */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-600 text-sm font-medium">Hard</span>
                            <span className="text-2xl">🔴</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-red-600">{stats.Hard}</span>
                            <span className="text-gray-500 text-sm">/ {stats.totalHard}</span>
                        </div>
                        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(stats.Hard / stats.totalHard) * 100}%` }} />
                        </div>
                    </div>
                </div>

                {/* Problems Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Filter className="w-5 h-5 text-orange-600" />
                            Problem Set
                        </h2>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="px-6 py-5 border-b border-gray-200 bg-white">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search Input */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    name="search"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    type="text"
                                    placeholder="Search problems by title, tags, or description..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm bg-gray-50 hover:bg-white"
                                />
                            </div>

                            {/* Difficulty Filter Pills */}
                            <div className="flex gap-2">
                                {levelOptions.map((level) => (
                                    <button
                                        key={level.value}
                                        onClick={() => handleLevelChange(level.value)}
                                        className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all border-2 ${selectedLevel === level.value
                                            ? `${level.color} bg-opacity-10 border-current shadow-md scale-105`
                                            : 'text-gray-600 border-gray-300 hover:border-gray-400 bg-white'
                                            }`}
                                    >
                                        <span className="mr-1.5">{level.icon}</span>
                                        {level.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Active Filters */}
                        {(debouncedValue || selectedLevel) && (
                            <div className="flex items-center gap-2 mt-4 flex-wrap">
                                <span className="text-sm text-gray-600 font-medium">Active filters:</span>
                                {debouncedValue && (
                                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium flex items-center gap-2">
                                        Search: "{debouncedValue}"
                                        <button
                                            onClick={() => setSearchValue("")}
                                            className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )}
                                {selectedLevel && (
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${selectedLevel === 'easy' ? 'bg-green-100 text-green-700' :
                                        selectedLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        Difficulty: {selectedLevel}
                                        <button
                                            onClick={() => setSelectedLevel("")}
                                            className="hover:opacity-70 rounded-full p-0.5 transition-opacity"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                )}
                                <button
                                    onClick={() => {
                                        setSearchValue("");
                                        setSelectedLevel("");
                                    }}
                                    className="text-sm text-gray-500 hover:text-gray-700 underline ml-2"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Question List */}
                    <div className="p-6">
                        <SqlQuestions
                            {...({
                                search: debouncedValue,
                                level: selectedLevel
                            } as unknown as any)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;