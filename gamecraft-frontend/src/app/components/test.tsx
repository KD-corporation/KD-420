"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollSection() {

 

  return (
    <div className="min-h-40 fixed top-0 z-60 bg-gray-50 text-white flex flex-col items-center justify-start p-10">
      <h1 className="text-3xl text-black mb-10">Scroll down to trigger the effect 👇</h1>

      {/* Target Container */}
      <div
        
        className="container text-black w-full max-w-2xl h-40 bg-red-500 rounded-2xl flex items-center justify-center text-2xl font-bold"
      >
        I become fixed and change color
      </div>
    </div>
  );
}
