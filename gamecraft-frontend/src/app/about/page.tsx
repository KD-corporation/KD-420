"use client"


import React, { useState } from "react";
import { Database, Gamepad2, Brain, Users, Github, Linkedin, Mail, Layers, Trophy, Zap, Target, Sparkles, Code, Play, Sword, Shield, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutUs() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const contributors = [
    {
      name: "Gaurav Kumar",
      role: "Developer",
      level: 99,
      xp: 15420,
      email: "gk022135@gmail.com",
      linkedin: "https://linkedin.com/in/gaurav_krrr",
      github: "https://github.com/gk022135",
      dockerhub: "https://hub.docker.com/u/gaurav",
      avatar: "👨‍💻",
      specialty: "UI Architect and Backend Wizard(Go Lang)",
    },
    {
      name: "Gagan Verma",
      role: "Game Designer",
      level: 87,
      xp: 12890,
      email: "gagan22053@gmail.com",
      linkedin: "https://linkedin.com/in/gaganverma225",
      github: "https://github.com/GaganVerma225",
      dockerhub: "https://hub.docker.com/u/gagan",
      avatar: "🎮",
      specialty: "Backend",
    },
    {
      name: "Kuldeep Sharma",
      role: "Code Warrior",
      level: 92,
      xp: 14210,
      email: "kuldeep8410mtr@gmail.com",
      linkedin: "https://linkedin.com/in/kuldeep-sharma-b555a21b8",
      github: "https://github.com/kuldeep8410mtr",
      dockerhub: "https://hub.docker.com/",
      avatar: "⚔️",
      specialty: "Full Stack Developer",
    },
  ];

  const features = [
    {
      title: "SQL Quest System",
      desc: "Embark on epic quests with real SQL challenges. Battle through beginner dungeons to legendary raids!",
      icon: <Sword className="w-10 h-10 text-yellow-400" />,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      title: "Level Up & Earn XP",
      desc: "Gain experience points, unlock achievements, and climb the global leaderboard!",
      icon: <Trophy className="w-10 h-10 text-purple-400" />,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Interactive Playground",
      desc: "Execute queries in real-time. See results instantly and master SQL through hands-on practice.",
      icon: <Play className="w-10 h-10 text-blue-400" />,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Boss Battles",
      desc: "Face challenging SQL boss fights that test your knowledge of joins, aggregations, and more!",
      icon: <Shield className="w-10 h-10 text-red-400" />,
      gradient: "from-red-500 to-pink-500",
    },
    {
      title: "Power-Up Skills",
      desc: "Unlock special abilities like query optimization, indexing mastery, and transaction control.",
      icon: <Zap className="w-10 h-10 text-green-400" />,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Guild System",
      desc: "Join forces with other SQL warriors. Share knowledge, compete in tournaments, and dominate!",
      icon: <Users className="w-10 h-10 text-indigo-400" />,
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  const stats = [
    { label: "Active Players", value: "50K+", icon: <Users className="w-6 h-6" /> },
    { label: "Quests Completed", value: "1.2M+", icon: <Target className="w-6 h-6" /> },
    { label: "Total XP Earned", value: "89M+", icon: <Star className="w-6 h-6" /> },
    { label: "Boss Battles Won", value: "340K+", icon: <Trophy className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-950 text-white overflow-hidden">
      
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500 rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-4 sm:px-6 py-16">
        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          
          <h1 className="text-5xl sm:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-transparent bg-clip-text animate-pulse">
              Master SQL
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text">
              Through Epic Quests
            </span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-xl text-slate-300 leading-relaxed">
            🎮 Transform boring database queries into thrilling adventures! Battle through SQL dungeons, 
            defeat query bosses, and become the ultimate <span className="text-yellow-400 font-bold">Database Hero</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <button className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl font-bold text-lg shadow-2xl hover:scale-110 transition-transform flex items-center gap-2">
              <Play className="w-5 h-5" />
              Start Your Quest
            </button>
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg shadow-2xl hover:scale-110 transition-transform flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              View Leaderboard
            </button>
          </div>
        </motion.div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500 rounded-2xl p-6 text-center shadow-2xl hover:scale-105 transition-transform"
            >
              <div className="flex justify-center mb-3 text-purple-400">
                {stat.icon}
              </div>
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-yellow-400 to-pink-500 text-transparent bg-clip-text">
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* GAME FEATURES */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-4 flex items-center justify-center gap-3">
              <Sparkles className="w-10 h-10 text-yellow-400" />
              <span className="bg-gradient-to-r from-yellow-400 to-pink-500 text-transparent bg-clip-text">
                Epic Features
              </span>
            </h2>
            <p className="text-slate-300 text-lg">Power-ups that make SQL learning addictive!</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onHoverStart={() => setHoveredCard(i)}
                onHoverEnd={() => setHoveredCard(null)}
                className={`relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 rounded-2xl p-6 transition-all shadow-2xl ${
                  hoveredCard === i ? 'scale-105 border-yellow-400' : 'border-slate-700'
                }`}
              >
                {/* Glow effect */}
                {hoveredCard === i && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-20 rounded-2xl blur-xl`} />
                )}
                
                <div className="relative z-10">
                  <div className="mb-4 flex items-center gap-3">
                    {f.icon}
                    <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${f.gradient} text-white`}>
                      NEW
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{f.title}</h3>
                  <p className="text-slate-400">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CONTRIBUTORS / GUILD LEADERS */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-4 flex items-center justify-center gap-3">
              <Trophy className="w-10 h-10 text-yellow-400" />
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                Guild Leaders
              </span>
            </h2>
            <p className="text-slate-300 text-lg">The legendary heroes who built this realm</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {contributors.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: i * 0.2, type: "spring" }}
                className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500 rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/50 transition-all group"
              >
                {/* Level Badge */}
                {/* <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-xl">
                  <div className="text-center">
                    <div className="text-xs font-bold">LVL</div>
                    <div className="text-lg font-black">{c.level}</div>
                  </div>
                </div> */}

                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-5xl border-4 border-yellow-400 shadow-2xl group-hover:scale-110 transition-transform">
                    {c.avatar}
                  </div>
                </div>

                {/* Name & Role */}
                <h3 className="text-2xl font-black text-center mb-2 bg-gradient-to-r from-yellow-400 to-pink-500 text-transparent bg-clip-text">
                  {c.name}
                </h3>
                <div className="text-center text-purple-400 font-bold mb-1">{c.role}</div>
                <div className="text-center text-slate-400 text-sm mb-4">{c.specialty}</div>

                {/* XP Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>XP</span>
                    <span>{c.xp.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                      style={{ width: `${(c.xp % 1000) / 10}%` }}
                    />
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mb-4">
                  <Mail className="w-4 h-4" />
                  <span>{c.email}</span>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-4">
                  <a 
                    href={c.linkedin} 
                    target="_blank" 
                    className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a 
                    href={c.github} 
                    target="_blank"
                    className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a 
                    href={c.dockerhub} 
                    target="_blank"
                    className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-cyan-600 transition-colors"
                  >
                    <Database className="w-5 h-5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CALL TO ACTION */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-purple-900 to-pink-900 rounded-3xl p-12 border-4 border-yellow-400 shadow-2xl">
            <h3 className="text-3xl sm:text-4xl font-black mb-4 text-yellow-400">
              Ready to Begin Your Adventure?
            </h3>
            <p className="text-lg text-slate-200 mb-8">
              Join thousands of SQL warriors and start your journey today. No experience needed - we'll turn you into a database master!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-xl font-black text-lg shadow-2xl hover:scale-110 transition-transform flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Play Now - Free!
              </button>
              <button className="px-8 py-4 bg-slate-800 border-2 border-purple-500 rounded-xl font-bold text-lg shadow-2xl hover:scale-110 transition-transform flex items-center gap-2">
                <Code className="w-5 h-5" />
                View Tutorial
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}