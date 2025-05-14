"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TeacherPlayQuiz() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionCode = searchParams ? searchParams.get("sessionCode") : null;
  const [quizTitle, setQuizTitle] = useState("");
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quiz, setQuiz] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timer, setTimer] = useState<number>(10);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (!sessionCode) return;
    // Fetch session info (get quiz title)
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/sessions/${sessionCode}`);
        if (!res.ok) throw new Error("Session not found");
        const data = await res.json();
        setQuizTitle(data.quiz?.title || "");
        setStarted(data.status === "started");
        setCurrentIndex(data.currentQuestionIndex || 0);
        setQuiz(data.quiz);
        // Fetch actual questions for the quiz
        if (data.quiz?._id) {
          const qRes = await fetch(`/api/quizzes/${data.quiz._id}/questions`);
          if (qRes.ok) {
            const qData = await qRes.json();
            setQuestions(qData);
          }
        }
      } catch (e: any) {
        setError(e.message || "Error loading session");
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionCode]);

  useEffect(() => {
    if (!started || questions.length === 0) return;
    setTimer(10);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          const nextIndex = currentIndex + 1;
          // update session index
          fetch(`/api/sessions/${sessionCode}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentQuestionIndex: nextIndex }),
          });
          setCurrentIndex(nextIndex);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [started, questions, currentIndex]);

  useEffect(() => {
    if (started && questions.length > 0 && currentIndex >= questions.length) {
      router.push(`/login/dashboardteacher/winner?sessionCode=${sessionCode}`);
    }
  }, [started, currentIndex, questions.length, router, sessionCode]);

  const handleStart = async () => {
    if (!sessionCode) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/sessions/${sessionCode}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "started" }),
      });
      if (!res.ok) throw new Error("Failed to start session");
      setStarted(true);
    } catch (e: any) {
      setError(e.message || "Error starting session");
    } finally {
      setLoading(false);
    }
  };

  if (!sessionCode) {
    return <div className="flex items-center justify-center min-h-screen text-red-500 text-xl">No session code provided.</div>;
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500 text-lg">{error}</div>;
  }

  if (started && questions && currentIndex >= questions.length) {
    return null; // Navigation handled in useEffect
  }

  if (started && questions) {
    const question = questions[currentIndex];
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#A7ABDE] py-12 px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-3xl space-y-8">
          <div className="text-right text-lg font-semibold text-black">Time: {timer}s</div>
          <h2 className="text-3xl font-bold mb-2 text-center text-black">{question.questionText}</h2>
          {question.imageUrl && (
            <div className="mt-4 flex justify-center">
              <img
                src={question.imageUrl}
                alt="Question image"
                className="max-h-80 w-auto rounded-lg border border-gray-300 shadow-sm object-contain"
              />
            </div>
          )}
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {question.choices.map((c: string, idx: number) => (
              <li
                key={idx}
                className="p-6 rounded-lg shadow-md flex items-center justify-center text-black font-semibold hover:shadow-lg transition"
                style={{
                  backgroundColor:
                    idx === 0 ? '#F8D2EB' :
                    idx === 1 ? '#D2F8D8' :
                    idx === 2 ? '#F7F8D2' :
                    '#F8E0D2'
                }}
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#A7ABDE] p-8">
      <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center w-full max-w-xl">
        <div className="mb-6 text-center">
          <div className="text-2xl font-bold text-[#3b2e6e] mb-2">Session Code</div>
          <div className="text-3xl font-mono text-[#6C63FF] tracking-widest mb-2">{sessionCode}</div>
          <div className="text-lg text-[#5B3C3C] font-semibold">Quiz: {quizTitle || "-"}</div>
        </div>
        {!started ? (
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold px-10 py-4 rounded-full shadow-lg transition mb-2"
            onClick={handleStart}
          >
            Start Quiz
          </button>
        ) : (
          <div className="text-green-600 text-xl font-bold mb-2">Quiz Started!</div>
        )}
        <div className="text-gray-500 text-sm mt-4">Share the session code with students to join.</div>
      </div>
    </div>
  );
}
