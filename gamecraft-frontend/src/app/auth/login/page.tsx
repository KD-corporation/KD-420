// LoginSignupSlider.jsx
"use client"

import { useState } from "react";

export default function LoginSignupSlider() {
  const [isSignUp, setIsSignUp] = useState(false);

  const socialButtonClasses =
    "border-2 border-gray-300 h-12 w-12 flex items-center justify-center rounded-full text-gray-600 hover:bg-red-50 hover:border-red-500 transition-all duration-300";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-500 to-red-800 p-4 text-black">
      <div className="relative w-full max-w-4xl min-h-[550px] bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* --- SIGN UP FORM CONTAINER --- */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center transition-all duration-700 ease-in-out ${
            isSignUp ? "translate-x-full opacity-100 z-20" : "opacity-0 z-10"
          }`}
        >
          <form className="w-full px-12 space-y-4">
            <h1 className="text-3xl font-bold text-red-600 text-center">
              Create Account
            </h1>

            <div className="flex justify-center gap-3 py-2">
              <button type="button" className={socialButtonClasses}>
                <i className="fab fa-facebook-f"></i>
              </button>
              <button type="button" className={socialButtonClasses}>
                <i className="fab fa-google-plus-g"></i>
              </button>
              <button type="button" className={socialButtonClasses}>
                <i className="fab fa-linkedin-in"></i>
              </button>
            </div>

            <span className="text-sm text-gray-500 block text-center">
              or use your email for registration
            </span>

            <input
              type="text"
              placeholder="Name"
              className="w-full bg-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold uppercase tracking-wider hover:bg-red-700 transition-transform transform hover:scale-105 shadow-lg"
            >
              Sign Up
            </button>
          </form>
        </div>

        {/* --- SIGN IN FORM CONTAINER --- */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center transition-all duration-700 ease-in-out ${
            isSignUp ? "opacity-0 z-10" : "opacity-100 z-20"
          }`}
        >
          <form className="w-full px-12 space-y-4">
            <h1 className="text-3xl font-bold text-red-600 text-center">
              Sign In
            </h1>

            <div className="flex justify-center gap-3 py-2">
              <button type="button" className={socialButtonClasses}>
                <i className="fab fa-facebook-f"></i>
              </button>
              <button type="button" className={socialButtonClasses}>
                <i className="fab fa-google-plus-g"></i>
              </button>
              <button type="button" className={socialButtonClasses}>
                <i className="fab fa-linkedin-in"></i>
              </button>
            </div>

            <span className="text-sm text-gray-500 block text-center">
              or use your account
            </span>

            <input
              type="email"
              placeholder="Email"
              className="w-full bg-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <a
              href="#"
              className="text-sm text-gray-500 hover:text-red-600 hover:underline transition-colors block text-center"
            >
              Forgot your password?
            </a>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold uppercase tracking-wider hover:bg-red-700 transition-transform transform hover:scale-105 shadow-lg"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* --- OVERLAY CONTAINER --- */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-50 ${
            isSignUp ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <div
            className={`bg-gradient-to-br from-red-600 to-red-800 text-white relative -left-full h-full w-[200%] transform transition-transform duration-700 ease-in-out ${
              isSignUp ? "translate-x-1/2" : "translate-x-0"
            }`}
          >
            {/* LEFT OVERLAY PANEL (For Sign In) */}
            <div className="absolute top-0 flex flex-col items-center justify-center text-center px-10 h-full w-1/2 transform transition-transform duration-700 ease-in-out">
              <h1 className="text-3xl font-bold">Welcome Back!</h1>
              <p className="mt-4 mb-8 text-base">
                To keep connected with us please login with your personal info
              </p>
              <button
                onClick={() => setIsSignUp(false)}
                className="border-2 border-white px-8 py-2 rounded-full font-semibold uppercase tracking-wider hover:bg-white hover:text-red-700 transition-all duration-300"
              >
                Sign In
              </button>
            </div>

            {/* RIGHT OVERLAY PANEL (For Sign Up) */}
            <div className="absolute top-0 right-0 flex flex-col items-center justify-center text-center px-10 h-full w-1/2 transform transition-transform duration-700 ease-in-out">
              <h1 className="text-3xl font-bold">Hello, Friend!</h1>
              <p className="mt-4 mb-8 text-base">
                Enter your personal details and start your journey with us
              </p>
              <button
                onClick={() => setIsSignUp(true)}
                className="border-2 border-white px-8 py-2 rounded-full font-semibold uppercase tracking-wider hover:bg-white hover:text-red-700 transition-all duration-300"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
