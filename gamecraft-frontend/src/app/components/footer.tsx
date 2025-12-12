"use client"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid gap-10 sm:grid-cols-2 md:grid-cols-3">

        {/* Platform Info */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">
            SQL Learning with Games
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Master SQL through interactive, fun-based learning.  
            Play games, solve challenges, and sharpen your query skills effortlessly.
          </p>
        </div>

        {/* Game Types */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">
            Game Types
          </h2>
          <ul className="space-y-2 text-sm">
            <li>🎮 Maze Explorer</li>
            <li>🧩 Arrange the Query</li>
            <li>🫧 Select the Bubble (Correct Order)</li>
          </ul>
        </div>

        {/* Contributors */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">
            Contributors
          </h2>
          <ul className="space-y-2 text-sm">
            <li>• Gaurav Krrr</li>
            <li>• Gagan</li>
            <li>• Kuldeep</li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SQL Learning with Games. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
