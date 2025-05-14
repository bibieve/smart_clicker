"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import React, { useEffect, useState } from "react";

function ParticipantList({ sessionCode }: { sessionCode: string }) {
  const [participants, setParticipants] = useState<string[]>([]);

  useEffect(() => {
    if (!sessionCode || sessionCode === "-") return;
    // ดึงรายชื่อผู้เข้าร่วมจาก API
    const fetchParticipants = async () => {
      try {
        const res = await fetch(`/api/sessions/sessionCode?sessionCode=${sessionCode}`);
        if (res.ok) {
          const data = await res.json();
          setParticipants(data.participants || []);
        }
      } catch (e) {
        // ignore error
      }
    };
    fetchParticipants();
    // อัปเดตรายชื่อทุก 3 วินาที
    const interval = setInterval(fetchParticipants, 3000);
    return () => clearInterval(interval);
  }, [sessionCode]);

  if (!participants.length) return null;
  return (
    <div className="w-full mt-2">
      <div className="text-[#5B3C3C] font-semibold text-base mb-1">Participants</div>
      <ul className="bg-[#F9F4F8] rounded-xl border border-[#D2D4F8] px-4 py-2 max-h-40 overflow-y-auto">
        {participants.map((name, idx) => (
          <li key={idx} className="text-gray-800 py-1 text-base">{name}</li>
        ))}
      </ul>
    </div>
  );
}

export default function WaitingPage() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionCode = params?.get("sessionCode") || "-";
  const username = params?.get("username") || "-";

  return (
    <div className="min-h-screen bg-[#A7ABDE] flex flex-col items-center justify-center p-6 relative">
      {/* Top bar */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
      </div>

      <div className="flex flex-col items-center gap-6 bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border-2 border-[#A7ABDE]">
        <h2 className="text-3xl font-extrabold text-[#5B3C3C] mb-2 tracking-wide drop-shadow-sm">Waiting Room</h2>
        <div className="flex flex-col items-center gap-2 w-full">
          <span className="text-[#5B3C3C] font-semibold text-lg">Session Code</span>
          <span className="text-3xl text-[#5B3C3C] font-extrabold bg-[#F9F4F8] px-8 py-3 rounded-2xl border border-[#D2D4F8] tracking-widest shadow-sm select-all">
            {sessionCode}
          </span>
          {/* รายชื่อผู้เข้าร่วม */}
          <ParticipantList sessionCode={sessionCode} />
        </div>
        <div className="flex flex-col items-center gap-2 w-full">
          <span className="text-[#5B3C3C] font-semibold text-lg">Your Name</span>
          <span className="text-2xl text-gray-800 font-bold bg-[#F9F4F8] px-8 py-2 rounded-2xl border border-[#D2D4F8] shadow-sm">
            {username}
          </span>
        </div>
        <div className="mt-4 text-[#5B3C3C] text-lg text-center font-medium bg-[#F6EFFF] rounded-xl px-4 py-3 shadow">
          <span className="block mb-1">Please wait for the teacher to start the quiz.</span>
          <span className="text-base text-[#8B6868]">(You'll be taken to the quiz when it starts.)</span>
        </div>
        <div className="mt-6">
          <button
            onClick={() => router.push('/login/dashboardstudent')}
            className="flex items-center gap-2 bg-[#A7ABDE] hover:bg-[#8d91c7] text-white font-semibold py-2 px-6 rounded-full shadow transition-all duration-200"
          >
            <FiArrowLeft className="text-xl" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
