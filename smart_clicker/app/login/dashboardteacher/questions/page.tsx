"use client";

import { useState } from "react";
import Image from "next/image";
import { FiArrowLeft, FiSettings } from "react-icons/fi";

export default function AddQuestionsPage() {
  const [questions, setQuestions] = useState<string[]>([]);

  // ฟังก์ชันเพิ่มคำถามใหม่
  const addQuestion = () => {
    const newQuestion = `question ${questions.length + 1}`;
    setQuestions([...questions, newQuestion]);
  };

  return (
    <div className="min-h-screen bg-[#A7ABDE] flex flex-col items-center justify-center p-6 relative">
      {/* Back & Settings */}
      <div className="absolute top-4 left-4 cursor-pointer">
        <FiArrowLeft className="text-white text-2xl" />
      </div>
      <div className="absolute top-4 right-4 cursor-pointer">
        <FiSettings className="text-white text-2xl" />
      </div>

      {/* คำถามที่เพิ่มขึ้นมา */}
      <div className="flex gap-6 flex-wrap justify-center mb-10">
        {questions.map((question, index) => (
          <div key={index} className="bg-[#D2D4F8] w-40 h-40 flex flex-col items-center justify-center rounded-2xl shadow-lg p-4">
            <p className="text-[#5B3C3C] font-bold text-lg"> {index + 1} </p>
            <p className="text-[#5B3C3C] font-semibold text-sm"> {question} </p>
          </div>
        ))}
      </div>
      {/*เงาสีขาว*/}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[180px] h-[180px] bg-white opacity-40 rounded-full blur-3xl"></div>
        </div>
        
      </div>
      {/* ปุ่ม ADD */}
      <button onClick={addQuestion} className="relative z-10 flex flex-col items-center">
        <Image 
        src="/Add.png" 
        alt="Add" 
        width={150} 
        height={150} 
        />
      </button>
    </div>
  );
}

