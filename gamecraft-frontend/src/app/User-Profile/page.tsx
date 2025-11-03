"use client";

import { useEffect, useState } from "react";
import { User, Mail, UserCircle, LogOut, Award, Trophy, Target, Gamepad2, Github, Linkedin, Link2, Settings, Star, Flame } from "lucide-react";

interface UserData {
  FirstName: string;
  LastName: string;
  Username: string;
  email: string;
  currentLevel?: number;
  totalPoints?: number;
  badges?: string[];
  gamesPlayed?: number;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
}

interface HeatmapData {
  date: string;
  count: number;
}

export default function UserProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);

  useEffect(() => {
    // Simulating user data since localStorage isn't available
    const stored = localStorage.getItem("userData");
    let parsed: Partial<UserData> | null = null;
    if (stored) {
      try {
        parsed = JSON.parse(stored) as Partial<UserData>;
      } catch (e) {
        console.error("Failed to parse stored userData:", e);
      }
    }

    const mockUser: UserData = {
      FirstName: parsed?.FirstName ?? "",
      LastName: parsed?.LastName ?? "Doe",
      Username: parsed?.Username ?? "johndoe_sql",
      email: parsed?.email ?? "john.doe@example.com",
      currentLevel: parsed?.currentLevel ?? 12,
      totalPoints: parsed?.totalPoints ?? 8547,
      badges: parsed?.badges ?? ["Speed Demon", "Query Master", "100 Day Streak", "Perfect Score"],
      gamesPlayed: parsed?.gamesPlayed ?? 234,
      githubUrl: parsed?.githubUrl ?? "https://github.com/johndoe",
      linkedinUrl: parsed?.linkedinUrl ?? "https://linkedin.com/in/johndoe",
      websiteUrl: parsed?.websiteUrl ?? "https://johndoe.dev"
    };
    // merge parsed values with mock defaults so stored values override mock
    setUser({ ...mockUser, ...(parsed || {}) });

    // Generate mock heatmap data for the last 12 weeks
    const data: HeatmapData[] = [];
    const today = new Date();
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 6)
      });
    }
    setHeatmapData(data);
  }, []);

  const handleLogout = () => {
    alert("Logging out...");
  };

  const getHeatmapColor = (count: number) => {
    if (count === 0) return "bg-gray-800";
    if (count === 1) return "bg-green-900";
    if (count === 2) return "bg-green-700";
    if (count === 3) return "bg-green-600";
    if (count === 4) return "bg-green-500";
    return "bg-green-400";
  };

  const getRankTitle = (level: number = 0) => {
    if (level < 5) return "Novice";
    if (level < 10) return "Apprentice";
    if (level < 15) return "Expert";
    if (level < 20) return "Master";
    return "Grandmaster";
  };

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading profile...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-4 lg:p-6 gap-6">

        {/* Left Sidebar */}
        <aside className="lg:w-80 flex-shrink-0 space-y-6">

          {/* Profile Card */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <UserCircle className="w-16 h-16 text-white" />
              </div>

              <h1 className="text-2xl font-bold mb-1">{user.Username}</h1>
              <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>

              <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 px-4 py-2 rounded-full mb-6">
                <p className="text-sm font-semibold">{getRankTitle(user.currentLevel)}</p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl space-y-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-emerald-500" />
              Statistics
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                <span className="text-gray-400 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Current Level
                </span>
                <span className="font-bold text-emerald-400">{user.currentLevel}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                <span className="text-gray-400 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Total Points
                </span>
                <span className="font-bold text-cyan-400">{user.totalPoints?.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                <span className="text-gray-400 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Badges Earned
                </span>
                <span className="font-bold text-purple-400">{user.badges?.length || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                <span className="text-gray-400 flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  Games Played
                </span>
                <span className="font-bold text-orange-400">{user.gamesPlayed}</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-emerald-500" />
              Links
            </h2>

            <div className="space-y-2">
              {user.githubUrl && (
                <a href={user.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors">
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
              )}

              {user.linkedinUrl && (
                <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors">
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </a>
              )}

              {user.websiteUrl && (
                <a href={user.websiteUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors">
                  <Link2 className="w-5 h-5" />
                  <span>Website</span>
                </a>
              )}
            </div>
          </div>

          {/* Settings */}
          <button className="w-full bg-gray-800 hover:bg-gray-700 rounded-2xl p-4 border border-gray-700 flex items-center justify-center gap-2 transition-colors">
            <Settings className="w-5 h-5" />
            <a href="/User-Profile/update-profile">Settings</a>
          </button>
        </aside>

        {/* Right Content Area */}
        <div className="flex-1 space-y-6">

          {/* Activity Heatmap */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              Activity Overview
            </h2>

            <div className="overflow-x-auto">
              <div className="inline-grid grid-cols-12 gap-2 mb-4">
                {heatmapData.map((day, idx) => (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded ${getHeatmapColor(day.count)} transition-all hover:scale-125 hover:shadow-lg`}
                    title={`${day.date}: ${day.count} activities`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded bg-gray-800"></div>
                  <div className="w-3 h-3 rounded bg-green-900"></div>
                  <div className="w-3 h-3 rounded bg-green-700"></div>
                  <div className="w-3 h-3 rounded bg-green-500"></div>
                  <div className="w-3 h-3 rounded bg-green-400"></div>
                </div>
                <span>More</span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              Badges Collection
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {user.badges?.map((badge, idx) => (
                <div key={idx} className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-xl border border-gray-700 hover:border-emerald-500 transition-all hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-3 mx-auto">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-center text-sm font-medium">{badge}</p>
                </div>
              ))}

              {[...Array(Math.max(0, 8 - (user.badges?.length || 0)))].map((_, idx) => (
                <div key={`empty-${idx}`} className="bg-gray-900 p-4 rounded-xl border border-gray-700 border-dashed opacity-30">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3 mx-auto">
                    <Award className="w-6 h-6 text-gray-600" />
                  </div>
                  <p className="text-center text-xs text-gray-600">Locked</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-blue-500" />
              Recent Activity
            </h2>

            <div className="space-y-3">
              {[
                { title: "Completed SQL Joins Challenge", points: 150, time: "2 hours ago" },
                { title: "Mastered Subqueries Level", points: 200, time: "5 hours ago" },
                { title: "Perfect Score on Aggregations", points: 100, time: "1 day ago" },
                { title: "Achieved 7-day Streak", points: 50, time: "2 days ago" }
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg hover:bg-gray-850 transition-colors">
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-400">{activity.time}</p>
                  </div>
                  <div className="text-emerald-400 font-bold">+{activity.points}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}