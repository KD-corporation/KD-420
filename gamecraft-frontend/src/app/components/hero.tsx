"use client"
import React, { useEffect, useRef } from 'react';
import { Database, Gamepad2, Trophy, Users, Zap, Code } from 'lucide-react';

const MySQLHeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const floatingIconsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically load GSAP
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.async = true;
    
    script.onload = () => {
      const gsap = (window as any).gsap;
      
      // Hero entrance animation
      gsap.from(titleRef.current, {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: 'power3.out'
      });

      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
      });

      gsap.from(ctaRef.current?.children || [], {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.6,
        ease: 'power3.out'
      });

      gsap.from(cardsRef.current?.children || [], {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.9,
        ease: 'power3.out'
      });

      // Floating icons animation
      gsap.to(floatingIconsRef.current?.children || [], {
        y: -20,
        duration: 2,
        stagger: 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });

      // Pulse animation for primary button
      gsap.to('.pulse-btn', {
        scale: 1.05,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div ref={heroRef} className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating icons */}
      <div ref={floatingIconsRef} className="absolute inset-0 pointer-events-none">
        <Database className="absolute top-20 left-10 text-blue-400 opacity-20" size={60} />
        <Code className="absolute top-40 right-20 text-cyan-400 opacity-20" size={50} />
        <Gamepad2 className="absolute bottom-32 left-20 text-purple-400 opacity-20" size={55} />
        <Trophy className="absolute bottom-20 right-32 text-yellow-400 opacity-20" size={45} />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-screen">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-6 py-2 mb-6">
            <Zap className="text-yellow-400" size={20} />
            <span className="text-blue-200 font-semibold">Level Up Your SQL Skills</span>
          </div>
          
          <h1 ref={titleRef} className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            Master MySQL
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
              Through Gaming
            </span>
          </h1>
          
          <p ref={subtitleRef} className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Transform database learning into an epic adventure. Write queries, solve challenges, 
            and compete with developers worldwide in the ultimate SQL gaming experience.
          </p>
        </div>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-wrap gap-4 justify-center mb-16">
          <button className="pulse-btn bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-blue-500/50 transition-all duration-300 flex items-center gap-2">
            <Gamepad2 size={24} />
            Start Playing Now
          </button>
          
          <button className="bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/50 border-2 border-slate-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center gap-2">
            <Code size={24} />
            View Challenges
          </button>
        </div>

        {/* Feature cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-400/20 rounded-2xl p-6 hover:border-blue-400/40 transition-all duration-300 hover:transform hover:scale-105">
            <div className="bg-blue-500/20 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Database className="text-blue-400" size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Interactive Learning</h3>
            <p className="text-slate-300">Write real SQL queries in an immersive game environment with instant feedback.</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-6 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105">
            <div className="bg-purple-500/20 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Trophy className="text-purple-400" size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Compete & Win</h3>
            <p className="text-slate-300">Climb leaderboards, earn achievements, and unlock new challenging levels.</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-green-500/10 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-6 hover:border-cyan-400/40 transition-all duration-300 hover:transform hover:scale-105">
            <div className="bg-cyan-500/20 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Users className="text-cyan-400" size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Join Community</h3>
            <p className="text-slate-300">Connect with thousands of developers and share your SQL mastery journey.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">50K+</div>
            <div className="text-slate-400 mt-1">Active Players</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">200+</div>
            <div className="text-slate-400 mt-1">Challenges</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">95%</div>
            <div className="text-slate-400 mt-1">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySQLHeroSection;