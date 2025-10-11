"use client";
import { X } from "lucide-react";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignupModal({ isOpen, onClose }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: check all fields
    if (!fullName || !email || !password) {
      setError("All fields are required");
      return;
    }
    else if(password.length < 5){
        setError("Password must be at least 5 charaters long");
        return;
    }

    // Clear error
    setError("");

    // Log the data (replace with actual signup logic)
    console.log("Signup data:", { fullName, email, password });

    // Close modal after successful submission
    onClose();

    // Optional: reset fields
    setFullName("");
    setEmail("");
    setPassword("");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed z-[110] w-80 bg-[#0B0F18] p-6 rounded-xl shadow-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Sign Up</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="px-3 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition-all duration-200"
          >
            Sign Up
          </button>
        </form>
      </div>
    </>
  );
}
