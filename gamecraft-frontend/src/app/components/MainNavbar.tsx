"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MailMinus, HomeIcon, DollarSign, CropIcon, Menu, X } from "lucide-react";
import SqlLogO from "@/app/assets/sql-triangle-letter-logo.webp";

interface NavBarItems {
  name: string;
  icon: typeof MailMinus;
  url: string;
}

const navObject: NavBarItems[] = [
  { name: "Main", icon: MailMinus, url: "#main" },
  { name: "Features", icon: HomeIcon, url: "#features" },
  { name: "Pricing", icon: DollarSign, url: "#pricing" },
  { name: "About Us", icon: CropIcon, url: "#about" },
];

export default function MainNavbar() {
  const navRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [showFixedNav, setShowFixedNav] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);

      // Trigger fixed navbar after 70px
      if (currentScroll > 70) {
        setShowFixedNav(true);
      } else {
        setShowFixedNav(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP animation when navbar appears
  useEffect(() => {
    const navbar = navRef.current;
    if (!navbar) return;

    if (showFixedNav) {
      const tl = gsap.timeline();
      tl.fromTo(
        navbar,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      ).fromTo(
        navbar,
        { background: "linear-gradient(to bottom, transparent, transparent)" },
        {
          background:
            "linear-gradient(to bottom, rgba(220,38,38,0.95), rgba(153,27,27,0.85))",
          duration: 1.2,
          ease: "power2.out",
        },
        "-=0.4"
      );
    }
  }, [showFixedNav]);

  const NavbarContent = () => (
    <nav className="w-full flex flex-row items-center justify-between">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img
          src={SqlLogO.src}
          className="w-10 h-10 sm:w-12 sm:h-12"
          alt="logo"
        />
        <span className="text-xl font-bold tracking-wide">SQL Gaming</span>
      </div>

      {/* Desktop Navbar Items */}
      <div className="hidden md:flex space-x-8 text-base font-medium">
        {navObject.map((item) => (
          <a
            key={item.name}
            href={item.url}
            className="flex items-center gap-2 hover:text-gray-300 transition-all duration-200"
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </a>
        ))}
      </div>

      {/* Right Side (Desktop) */}
      <div className="hidden md:flex items-center gap-4 text-sm font-medium">
        <button className="hover:text-gray-300 transition-all duration-200">
          Login
        </button>
        <button className="bg-white text-black px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-all duration-200">
          Sign up
        </button>
      </div>

      {/* Hamburger (Mobile) */}
      <div className="md:hidden">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="text-white hover:text-gray-300"
        >
          <Menu size={26} />
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Default Navbar */}
      <div className="top-0 w-full bg-[#0B0F18] text-white flex items-center justify-between px-6 h-16 shadow-md transition-all duration-300">
        <NavbarContent />
      </div>

      {/* Fixed Navbar (after scroll) */}
      {showFixedNav && (
        <div
          ref={navRef}
          className="fixed top-0 left-0 w-full text-white flex items-center justify-between px-6 h-30 z-50 shadow-lg backdrop-blur-md border-b border-red-400/20 transition-all duration-500"
        >
          <NavbarContent />
        </div>
      )}

      {/* Side Drawer (Mobile) */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#0B0F18] text-white transform ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-500 ease-in-out z-[100] shadow-xl flex flex-col`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <span className="text-lg font-bold">SQL Gaming</span>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="text-gray-300 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col px-6 mt-4 space-y-4 text-base">
          {navObject.map((item) => (
            <a
              key={item.name}
              href={item.url}
              className="flex items-center gap-3 hover:text-red-400 transition-all"
              onClick={() => setIsDrawerOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </a>
          ))}
        </div>

        <div className="mt-auto px-6 py-6 border-t border-gray-700 flex flex-col gap-3">
          <button className="hover:text-gray-300 transition-all duration-200">
            Login
          </button>
          <button className="bg-white text-black px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-all duration-200">
            Sign up
          </button>
        </div>
      </div>

      {/* Overlay (when drawer open) */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
          onClick={() => setIsDrawerOpen(false)}
        ></div>
      )}
    </>
  );
}
