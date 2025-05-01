"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiSettings } from "react-icons/fi";
import Image from "next/image";
import { useSearchParams } from "next/navigation";


export default function SetQuestionsPage() {
  const router = useRouter();
  const [questionText, setQuestionText] = useState("");
  const [choices, setChoices] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [time, setTime] = useState("");

  const handleChoiceChange = (index: number, value: string) => {
    const updated = [...choices];
    updated[index] = value;
    setChoices(updated);
  };

  const handleAddQuestion = () => {
    console.log({ questionText, choices, correctAnswer, time });
    // TODO: Save to DB or state
    setQuestionText("");
    setChoices(["", "", "", ""]);
    setCorrectAnswer(null);
    setTime("");
  };

  const searchParams = useSearchParams();
  const setTitle = searchParams.get("title") || "Unnamed Set";
  

  return (
    <div className="min-h-screen bg-[#A7ABDE] flex flex-col items-center justify-start p-6 relative">
      {/* Top Bar */}
      <div className="absolute top-4 left-4 cursor-pointer" onClick={() => router.back()}>
        <FiArrowLeft className="text-white text-2xl" />
      </div>
      <div className="absolute top-4 right-4">
        <FiSettings className="text-white text-2xl cursor-pointer" />
      </div>

      <div className="absolute top-4 left-16 text-white font-bold text-lg z-10">
        {setTitle}
      </div>


      <div className="bg-white rounded-3xl p-4 mt-6 w-full max-w-lg">
        <h2 className="text-[#5B3C3C] font-bold text-xl text-center mb-4">Question 1</h2>

        {/* Question Input */}
        <textarea
          placeholder="Enter question..."
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full bg-[#F5D8D8] rounded-xl p-3 mb-4 text-black"
        />

        {/* Image Upload (placeholder) */}
        <div className="w-full flex justify-center mb-6">
          <Image src="/image-upload.png" alt="Upload" width={80} height={80} />
        </div>

        {/* Choices */}
        <div className="bg-[#D2D4F8] rounded-xl p-4">
          {choices.map((choice, i) => (
            <div key={i} className="flex items-center mb-3">
              <input
                type="radio"
                name="correct"
                checked={correctAnswer === i}
                onChange={() => setCorrectAnswer(i)}
                className="mr-2"
              />
              <span className="text-[#5B3C3C] font-medium mr-2">Choice {i + 1}</span>
              <input
                type="text"
                value={choice}
                onChange={(e) => handleChoiceChange(i, e.target.value)}
                className="flex-1 bg-[#ECEBFF] p-2 rounded-md text-black"
              />
            </div>
          ))}

          {/* Set time */}
          <div className="flex items-center justify-end mt-4">
            <span className="text-sm text-[#5B3C3C] mr-2">Set time:</span>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-20 p-1 rounded-md text-black"
              placeholder="sec"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-col gap-4 w-full max-w-sm">
        <button
          onClick={handleAddQuestion}
          className="bg-[#F5D8D8] text-[#5B3C3C] font-semibold py-2 rounded-full"
        >
          Add
        </button>
        <button
          className="bg-[#C7F6C7] text-[#5F6E54] font-semibold py-2 rounded-full"
          onClick={() => router.push("/login/dashboardteacher/Questionslists")}
        >
          Finish
        </button>
      </div>
    </div>
  );
}