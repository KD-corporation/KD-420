"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  UserCircle,
  LogOut,
  Award,
  Trophy,
  Target,
  Gamepad2,
  Github,
  Linkedin,
  Link2,
  Settings,
  Flame,
  Zap,
  ChevronRight,
} from "lucide-react";

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
  currentStreak?: number;
  maxStreak?: number;
}

interface HeatmapData {
  date: string;
  count: number;
}

const LEVEL_STEP = 750; // points required per level

const pointsForLevel = (level: number) => level * LEVEL_STEP;

const getRankTitle = (level: number = 0) => {
  if (level < 5) return "Novice";
  if (level < 10) return "Apprentice";
  if (level < 15) return "Expert";
  if (level < 20) return "Master";
  return "Grandmaster";
};

const getHeatmapColor = (count: number) => {
  if (count === 0) return "bg-gray-800";
  if (count === 1) return "bg-green-900";
  if (count === 2) return "bg-green-700";
  if (count === 3) return "bg-green-600";
  if (count === 4) return "bg-green-500";
  return "bg-green-400";
};

export default function UserProfilePage() {
  const router = useRouter();
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);

  useEffect(() => {
    let stored: UserData | null = null;
    try {
      stored = JSON.parse(localStorage.getItem("userData") || "null");
    } catch {
      stored = null;
    }

    const email = stored?.email || "";
    if (!email) {
      router.replace("/auth/login");
      return;
    }

    // Show locally known data immediately, then refresh from the backend
    setUser({
      FirstName: stored?.FirstName || "",
      LastName: stored?.LastName || "",
      Username: stored?.Username || email.split("@")[0],
      email,
      currentLevel: 1,
      totalPoints: 0,
      badges: [],
      gamesPlayed: 0,
      currentStreak: 0,
      maxStreak: 0,
      ...stored,
    });

    const BaseUrl = process.env.NEXT_PUBLIC_API_URL;

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${BaseUrl}/getapis/get-user-profile?email=${encodeURIComponent(email)}`
        );
        if (!response.ok) throw new Error("Failed to fetch profile");
        const result = await response.json();
        if (result.status && result.data) {
          setUser((prev) => ({ ...prev, ...result.data }));
          setProfileError(false);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setProfileError(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchActivity = async () => {
      try {
        const response = await fetch(
          `${BaseUrl}/getapis/getuser-activity?email=${encodeURIComponent(email)}`
        );
        if (!response.ok) throw new Error("Failed to fetch activity");
        const records: HeatmapData[] = await response.json();
        if (Array.isArray(records)) setHeatmapData(records);
      } catch (err) {
        console.error("Error fetching activity:", err);
      }
    };

    fetchProfile();
    fetchActivity();
  }, [router]);

  // GitHub-style grid: last 12 weeks, one column per week, aligned to today
  const heatmapCells = useMemo(() => {
    const counts = new Map<string, number>();
    heatmapData.forEach((d) => counts.set(d.date, d.count));

    const today = new Date();
    const end = new Date(today);
    end.setHours(0, 0, 0, 0);
    const start = new Date(end);
    start.setDate(start.getDate() - 83); // 12 weeks * 7 days

    const cells: HeatmapData[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const date = d.toISOString().split("T")[0];
      cells.push({ date, count: counts.get(date) || 0 });
    }
    // Pad the beginning so the grid starts on a weekday column
    const firstDow = new Date(cells[0].date + "T00:00:00").getDay();
    for (let i = 0; i < firstDow; i++) cells.unshift({ date: `pad-${i}`, count: -1 });
    return cells;
  }, [heatmapData]);

  const activeDays = heatmapData.filter((d) => d.count > 0).length;
  const totalActivities = heatmapData.reduce((sum, d) => sum + d.count, 0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    router.replace("/");
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const level = user.currentLevel ?? 1;
  const points = user.totalPoints ?? 0;
  const levelStart = pointsForLevel(level - 1);
  const levelEnd = pointsForLevel(level);
  const progress = Math.min(
    100,
    Math.max(0, Math.round(((points - levelStart) / (levelEnd - levelStart)) * 100))
  );
  const pointsToNext = Math.max(0, levelEnd - points);

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

              <h1 className="text-2xl font-bold mb-1">
                {user.FirstName || user.LastName
                  ? `${user.FirstName} ${user.LastName}`.trim()
                  : user.Username}
              </h1>
              <p className="text-gray-400 text-sm mb-1">@{user.Username}</p>
              <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>

              <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 px-4 py-2 rounded-full mb-3">
                <p className="text-sm font-semibold">
                  {getRankTitle(level)} · Level {level}
                </p>
              </div>

              {profileError && (
                <p className="text-amber-400 text-xs mb-3 text-center">
                  Offline mode — showing saved data
                </p>
              )}

              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          </div>

          {/* Score Card */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                Score
              </h2>
              <span className="text-xs text-gray-400">
                {pointsToNext} pts to Level {level + 1}
              </span>
            </div>

            <div className="text-center mb-4">
              <div className="text-5xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {points.toLocaleString()}
              </div>
              <div className="text-xs uppercase tracking-widest text-gray-400 mt-1">
                Total Points
              </div>
            </div>

            {/* Level progress */}
            <div className="w-full bg-gray-900 rounded-full h-3 mb-1 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-3 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-gray-400 mb-4">
              <span>{levelStart.toLocaleString()}</span>
              <span className="text-emerald-400 font-semibold">{progress}%</span>
              <span>{levelEnd.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-gray-900 rounded-lg p-3">
                <div className="text-orange-400 font-bold text-lg flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4" />
                  {user.currentStreak ?? 0}
                </div>
                <div className="text-[11px] text-gray-400">Day Streak</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-3">
                <div className="text-yellow-400 font-bold text-lg flex items-center justify-center gap-1">
                  <Trophy className="w-4 h-4" />
                  {user.maxStreak ?? 0}
                </div>
                <div className="text-[11px] text-gray-400">Best Streak</div>
              </div>
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
                <span className="font-bold text-emerald-400">{level}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                <span className="text-gray-400 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Badges Earned
                </span>
                <span className="font-bold text-purple-400">
                  {user.badges?.length || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                <span className="text-gray-400 flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  Games Played
                </span>
                <span className="font-bold text-orange-400">
                  {user.gamesPlayed ?? 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                <span className="text-gray-400 flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  Active Days
                </span>
                <span className="font-bold text-green-400">{activeDays}</span>
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
                <a
                  href={user.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
              )}

              {user.linkedinUrl && (
                <a
                  href={user.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </a>
              )}

              {user.websiteUrl && (
                <a
                  href={user.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Link2 className="w-5 h-5" />
                  <span>Website</span>
                </a>
              )}

              {!user.githubUrl && !user.linkedinUrl && !user.websiteUrl && (
                <p className="text-sm text-gray-500 p-3 bg-gray-900 rounded-lg text-center">
                  No links added yet
                </p>
              )}
            </div>
          </div>

          {/* Settings */}
          <a
            href="/User-Profile/update-profile"
            className="w-full bg-gray-800 hover:bg-gray-700 rounded-2xl p-4 border border-gray-700 flex items-center justify-center gap-2 transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </a>
        </aside>

        {/* Right Content Area */}
        <div className="flex-1 space-y-6">

          {/* Activity Heatmap */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-500" />
                Activity Overview
              </h2>
              <span className="text-sm text-gray-400">
                {totalActivities} actions · last 12 weeks
              </span>
            </div>

            <div className="overflow-x-auto">
              <div className="inline-grid grid-flow-col grid-rows-7 gap-1.5 mb-4">
                {heatmapCells.map((day, idx) =>
                  day.count < 0 ? (
                    <div key={`pad-${idx}`} className="w-3 h-3" />
                  ) : (
                    <div
                      key={day.date}
                      className={`w-3 h-3 rounded ${getHeatmapColor(day.count)} transition-all hover:scale-125 hover:shadow-lg`}
                      title={`${day.date}: ${day.count} ${
                        day.count === 1 ? "activity" : "activities"
                      }`}
                    />
                  )
                )}
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
                <div
                  key={idx}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-xl border border-gray-700 hover:border-emerald-500 transition-all hover:scale-105"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-3 mx-auto">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-center text-sm font-medium">{badge}</p>
                </div>
              ))}

              {(!user.badges || user.badges.length === 0) && (
                <p className="text-sm text-gray-500 col-span-full text-center py-4">
                  No badges yet — solve challenges to earn them!
                </p>
              )}

              {[...Array(Math.max(0, 8 - (user.badges?.length || 0)))].map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="bg-gray-900 p-4 rounded-xl border border-gray-700 border-dashed opacity-30"
                >
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3 mx-auto">
                    <Award className="w-6 h-6 text-gray-600" />
                  </div>
                  <p className="text-center text-xs text-gray-600">Locked</p>
                </div>
              ))}
            </div>
          </div>

          {/* Play CTA */}
          <a
            href="/features"
            className="block bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 rounded-2xl p-6 border border-emerald-400/30 shadow-xl transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Gamepad2 className="w-6 h-6" />
                  Ready for your next challenge?
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  Solve SQL puzzles to earn points, climb levels and extend your streak.
                </p>
              </div>
              <ChevronRight className="w-8 h-8" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
