"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiHome, FiSettings } from "react-icons/fi";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#A7ABDE] flex flex-col items-center justify-center p-6 relative">
      {/* Navbar */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <FiHome className="text-white text-2xl" />
        <span className="text-white font-semibold text-lg">Home Page</span>
      </div>
      <div className="absolute top-4 right-4">
        <FiSettings className="text-white text-2xl cursor-pointer" />
      </div>

      {/* Main Content */}
      <div className="flex flex-wrap justify-center gap-8 md:flex-row sm:flex-col">
        {/* Questions Button */}
        <div
          className="bg-[#D2D4F8] w-full sm:w-72 md:w-80 h-72 sm:h-80 flex flex-col items-center justify-center rounded-2xl shadow-lg cursor-pointer transition transform hover:scale-105"
          onClick={() => router.push("/login/dashboardstudent/play_quiz")}
        >
          <Image
            src="/iconQR.png"
            alt="Questions"
            width={200}
            height={200}
          />
          <p className="text-[#5B3C3C] font-semibold text-lg mt-2">Join Quiz</p>
        </div>

        {/* Logout Button */}
        <div
          className="bg-[#D2D4F8] w-full sm:w-72 md:w-80 h-72 sm:h-80 flex flex-col items-center justify-center rounded-2xl shadow-lg cursor-pointer transition transform hover:scale-105"
          onClick={() => router.push("/login")}
        >
          <Image
            src="/logoutlogo.png"
            alt="logout"
            width={200}
            height={200}
          />
          <p className="text-[#5B3C3C] font-bold text-lg mt-2">Log out</p>
        </div>
      </div>
    </div>
  );
}
