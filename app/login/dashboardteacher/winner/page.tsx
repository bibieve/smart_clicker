"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiHome } from "react-icons/fi";

// API Example: GET /api/sessions/[sessionCode]/leaderboard
// Response: { leaderboard: [{ name: string, score: number }, ...] }
// The winner is the first item in the leaderboard array.

export default function WinnerPage() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionCode = params?.get("sessionCode");
  const [winner, setWinner] = useState<string>("");

  useEffect(() => {
    if (!sessionCode) return;
    const fetchWinner = async () => {
      const response = await fetch(`/api/sessions/${sessionCode}/leaderboard`);
      const data = await response.json();
      if (data && data.leaderboard && data.leaderboard.length > 0 && data.leaderboard[0].score > 0) {
        setWinner(data.leaderboard[0].name);
      } else {
        setWinner('No one win');
      }
    };
    fetchWinner();
  }, [sessionCode]);

  return (
    <div className="min-h-screen bg-[#A7ABDE] flex items-center justify-center">
      <div className="relative w-[900px] h-[540px] bg-[#E4E6FF] rounded-3xl shadow-2xl flex flex-col items-center justify-center px-0 py-0 overflow-hidden">
        {/* Home button */}
        <button
          className="absolute top-7 left-7 bg-[#bfa3b6] rounded-full w-10 h-10 flex items-center justify-center z-10 hover:scale-110 transition"
          onClick={() => router.push("/")}
          aria-label="Back to Home"
        >
          <FiHome className="text-white text-2xl" />
        </button>
        <div className="flex flex-row items-center justify-center w-full gap-0 relative" style={{height:180}}>
          {/* Trophy with white border, overlap pink box */}
          <div className="z-20 rounded-full bg-[#3b2e6e] flex items-center justify-center border-[12px] border-white shadow-xl" style={{width:160, height:160, marginRight:-40}}>
            <img
              src="/winner.png"
              alt="Trophy"
              className="w-28 h-28"
            />
          </div>
          {/* Winner name in pink box, with overlap */}
          <div className="z-10 bg-[#F8D6EE] rounded-2xl px-28 py-10 flex items-center min-w-[300px] shadow-lg border border-pink-200" style={{marginLeft:-40}}>
            <span className="text-black text-5xl font-extrabold tracking-wide" style={{letterSpacing:'0.04em'}}>
              {winner || <span style={{color:'#917791'}} className='italic'>Loading...</span>}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
