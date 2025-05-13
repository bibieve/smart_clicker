"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FiArrowLeft, FiSettings, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation"; // ใช้ useRouter สำหรับการนำทาง

export default function AddQuestionsPage() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [questionName, setQuestionName] = useState("");
  const [setId, setSetId] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<string[]>([]);
  const router = useRouter(); // สร้าง instance ของ useRouter

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/quizzes', {
          method: 'GET',
        });

        if (!response.ok) {
          console.error('Failed to fetch questions');
          return;
        }

        const data = await response.json();
        setQuestions(data.map((quiz: { title: string }) => quiz.title)); // ดึงเฉพาะชื่อชุดคำถาม
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (!setId) return;

    (async () => {
      try {
        const res = await fetch(`/api/quizzes/${setId}`);
        if (!res.ok) {
          console.error('Failed to load quiz', await res.text());
          return;
        }
        const quiz = await res.json();
        setBlocks(quiz.questions || []); // โหลดคำถามเดิม (ถ้ามี)
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    })();
  }, [setId]);

  // ฟังก์ชันเพิ่มคำถามใหม่
  const addQuestion = () => {
    setIsAdding(true); // เปิดกล่องให้กรอกชื่อคำถาม
  };

  const createQuiz = async () => {
    const response = await fetch('/api/quizzes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: questionName,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      alert(`Failed to create quiz: ${errorData.error}`);
      return;
    }

    const data = await response.json();
    console.log('Quiz created successfully:', data);
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh
    if (!questionName) {
      alert("Please enter a question name.");
      return;
    }
    try {
      await createQuiz();

      if (questionName.trim() !== "") {
        setQuestions((Questions) => [...Questions, questionName]);
        setQuestionName(""); // Clear input after adding
        setIsAdding(false); // Close input box
        router.push("/login/dashboardteacher/questionslists"); // Redirect to questions list
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };
  
  // ฟังก์ชันลบคำถาม
  const handleDelete = async (index: number) => {
    const questionToDelete = questions[index];

    try {
      // ส่งคำขอ DELETE ไปยัง API
      const response = await fetch(`/api/quizzes/${encodeURIComponent(questionToDelete)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert(`Failed to delete question: ${errorData.error}`);
        return;
      }

      // อัปเดต state หลังจากลบสำเร็จ
      setQuestions((prevQuestions) => prevQuestions.filter((_, i) => i !== index));
      alert(`Question "${questionToDelete}" deleted successfully.`);
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('An error occurred while deleting the question.');
    }
  };
  
  // ฟังก์ชันย้อนกลับไปหน้า dashboardteacher
  const handleBack = () => {
    router.push("/login/dashboardteacher"); // เปลี่ยนเส้นทางไปยังหน้า dashboardteacher
  };

  return (
    <div className="min-h-screen bg-[#A7ABDE] flex flex-col items-center justify-center p-6 relative">
      {/* Back Button */}
      <div className="absolute top-4 left-4 cursor-pointer z-10" onClick={handleBack}>
        <FiArrowLeft className="text-white text-2xl" />
      </div>

      {/* Questions lists - Title */}
      <div className="absolute top-4 left-16 text-white font-bold text-lg z-10">
        Questions lists
      </div>

      {/* Settings Button */}
      <div className="absolute top-4 right-4 cursor-pointer">
        <FiSettings className="text-white text-2xl" />
      </div>

      {/* คำถามที่เพิ่มขึ้นมา */}
      <div className="flex gap-6 flex-wrap justify-center mb-10">
        {questions.map((question, index) => (
          <div
            key={index}
            className="bg-[#D2D4F8] w-full sm:w-40 md:w-48 lg:w-60 flex flex-col items-center justify-center rounded-2xl shadow-lg p-4 relative"
          >
            <button
              onClick={() => handleDelete(index)}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-red-300 rounded-full text-white cursor-pointer"
            >
              <FiX size={20} />
            </button>
            <p className="text-[#5B3C3C] font-semibold text-sm text-xl">{question}</p>
            <div className="flex w-full justify-between mt-4">
              <button
                className="bg-white text-[#5B3C3C] text-sm font-semibold px-4 py-1 rounded-full shadow"
                onClick={() =>
                  router.push(
                    `/login/dashboardteacher/questionslists/edit_questions?id=${encodeURIComponent(index)}&QuestionName=${encodeURIComponent(question)}`
                  )
                }
              >
                Edit
              </button>
              <button
                className="bg-[#D2F7B6] text-[#5B3C3C] text-sm font-semibold px-4 py-1 rounded-full shadow"
                onClick={() => alert(`Send ${question}`)}
              >
                Send
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* เงาสีขาวโปร่งใส เบลอ */}
      <div className="absolute w-[180px] h-[180px] bg-white opacity-40 rounded-full blur-3xl"></div>

      {/* ปุ่ม ADD */}
      <button onClick={addQuestion} className="relative z-10 flex flex-col items-center">
        <Image
          src="/Add.png"
          alt="Add"
          width={150}
          height={150}
        />
      </button>

      {/* กล่องกรอกชื่อชุดคำถาม */}
      {isAdding && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-20 w-full sm:w-80 md:w-96 lg:w-[400px]">
          <h3 className="text-lg font-semibold text-center mb-4 text-black">Question name</h3>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md mb-4 text-black"
            placeholder="Enter question name"
            value={questionName}
            onChange={(e) => setQuestionName(e.target.value)}
          />
          <div className="flex justify-between">
            <button onClick={() => setIsAdding(false)} className="bg-red-500 text-white px-4 py-2 rounded-md">
              Cancel
            </button>
            <button onClick={handleConfirm} className="bg-green-500 text-white px-4 py-2 rounded-md">
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}