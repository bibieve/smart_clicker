"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Question = {
  questionText: string;
  choices: string[];
  time: number;
  correctIndex: number;
  imageUrl?: string;
};

export default function StudentPlayQuiz() {
  const router = useRouter();
  const params = useSearchParams();
  // Student name passed from join/waiting
  const username = params?.get("username") || "";

  const sessionCode = params?.get("sessionCode") || "";
  const [status, setStatus] = useState<string>("");
  const [quizId, setQuizId] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);

  // Handle choice selection, reveal answer, and submit score
  const handleSelect = async (idx: number) => {
    setSelected(idx);
    const correct = questions[current].correctIndex;
    setCorrectIndex(correct);
    setShowAnswer(true);
    // Submit answer to update score
    try {
      await fetch(`/api/sessions/${sessionCode}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: username,
          questionIndex: current,
          selectedIndex: idx,
          correctIndex: correct,
        }),
      });
    } catch (e) {
      console.error('Failed to submit answer', e);
    }
  };

  // Fetch initial session data (status, quizId)
  useEffect(() => {
    if (!sessionCode) return;
    fetch(`/api/sessions/${sessionCode}`)
      .then(res => res.json())
      .then(data => {
        setStatus(data.status || 'waiting');
        setQuizId(data.quiz?._id || '');
      });
  }, [sessionCode]);

  // Poll session for status and current question index
  useEffect(() => {
    if (!sessionCode) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/sessions/${sessionCode}`);
      if (res.ok) {
        const data = await res.json();
        setStatus(data.status);
        setCurrent(data.currentQuestionIndex);
        setShowAnswer(false);
        setSelected(null);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [sessionCode]);

  // Load questions once quiz has started
  useEffect(() => {
    if (status !== 'started' || !quizId) return;
    fetch(`/api/quizzes/${quizId}/questions`)
      .then(res => res.json())
      .then(data => setQuestions(data || []));
  }, [status, quizId]);

  // Redirect to student winner page when done
  useEffect(() => {
    if (questions.length > 0 && current >= questions.length) {
      router.push(`/login/dashboardstudent/winner?sessionCode=${sessionCode}`);
    }
  }, [current, questions.length, router, sessionCode]);

  // Show waiting until quiz starts
  if (status !== 'started') {
    return (
      <div className="min-h-screen bg-[#A7ABDE] flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg px-8 py-8 w-full max-w-md flex flex-col items-center">
          <span className="animate-pulse text-2xl text-[#5B3C3C] font-bold mb-4">Waiting for teacher to start...</span>
          <div className="w-12 h-12 border-4 border-[#A7ABDE] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Once started, but questions not loaded yet
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#A7ABDE] flex items-center justify-center">
        <span className="text-xl text-[#5B3C3C]">Loading Quiz...</span>
      </div>
    );
  }

  // Avoid overflow: wait for redirect when all questions answered
  if (questions.length > 0 && current >= questions.length) {
    return null;
  }

  const q = questions[current];

  // Render quiz question UI
  return (
    <div className="min-h-screen bg-[#A7ABDE] flex flex-col items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg px-8 py-4 mb-6 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-[#5B3C3C] text-center mb-4 drop-shadow-sm bg-white rounded-full py-2">Question {current + 1}</h2>
        <div className="grid grid-cols-2 gap-6">
          {q.choices.map((choice, idx) => (
            <button
              key={idx}
              disabled={selected !== null}
              onClick={() => handleSelect(idx)}
              className={`rounded-2xl py-8 text-2xl font-bold shadow text-[#5B3C3C] transition duration-200
                ${idx === 0 ? "bg-pink-100" : idx === 1 ? "bg-green-100" : idx === 2 ? "bg-yellow-100" : "bg-orange-100"}
                ${selected === idx ? "ring-4 ring-[#A7ABDE] scale-105" : "hover:scale-105"}
                ${showAnswer && correctIndex === idx ? "border-4 border-green-500" : ""}
              `}
            >
              {choice}
            </button>
          ))}
        </div>
        {showAnswer && (
          <div className="mt-6 text-center text-green-600 text-xl font-semibold bg-green-50 rounded-xl py-3">
            Correct answer: <span className="font-bold">{q.choices[correctIndex ?? 0]}</span>
          </div>
        )}
      </div>
    </div>
  );
}
