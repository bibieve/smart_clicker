"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

export default function JoinQuizPage() {
  const [sessionCode, setSessionCode] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSessionJoin = async () => {
    if (!sessionCode) {
      alert("Please enter a session code");
      return;
    }

    // Call API to join the session
    const res = await fetch("/api/sessions/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionCode, studentName: username }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Joined session successfully", data);

      // Redirect to waiting page with session info
      router.push(`/waiting/${sessionCode}`);
    } else {
      alert("Failed to join the session");
    }
  };

  return (
    <div className="min-h-screen bg-[#A7ABDE] flex flex-col items-center justify-center p-6 relative">
      {/* Top bar */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <button onClick={() => router.push('/login/dashboardstudent')} className="focus:outline-none">
          <FiArrowLeft className="text-white text-2xl" />
        </button>
        <span className="text-white font-semibold text-lg">Join Quiz</span>
      </div>

      {/* Form for session code */}
      <div className="flex flex-col items-center gap-4 mt-8 bg-white p-8 rounded-2xl shadow-2xl w-80 border-2 border-[#A7ABDE]">
        <h2 className="text-xl font-bold text-[#5B3C3C] mb-2">Join a Quiz Session</h2>
        <div className="w-full flex flex-col gap-2">
          <label className="text-[#5B3C3C] font-semibold text-sm mb-1" htmlFor="sessionCode">Session Code</label>
          <input
            id="sessionCode"
            type="text"
            placeholder="Enter session code"
            value={sessionCode}
            onChange={(e) => setSessionCode(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-50 text-gray-900 bg-[#F9F4F8] focus:ring-2 focus:ring-gray-300 focus:outline-none placeholder:text-gray-400"
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="text-[#5B3C3C] font-semibold text-sm mb-1" htmlFor="username">Your Name</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-50 text-gray-900 bg-[#F9F4F8] focus:ring-2 focus:ring-gray-300 focus:outline-none placeholder:text-gray-400"
          />
        </div>
        <button
          onClick={handleSessionJoin}
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full mt-4 shadow-md transition-transform duration-200"
        >
          <span className="text-base">Join</span>
        </button>
      </div>
    </div>
  );
}
