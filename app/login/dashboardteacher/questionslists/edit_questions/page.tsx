'use client'

import { useState, ChangeEvent, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FiArrowLeft, FiSettings, FiX, FiCheck } from 'react-icons/fi'
import Image from 'next/image'

type QuestionBlock = {
  questionId: string | null; // Added questionId for updates
  quizId: string | null;
  questionText: string;
  choices: string[];
  correctIndex: number | null;
  time: number;
  imageUrl: string | File; // Updated to support both string and File
}

export default function EditQuestionsPage() {
  const router = useRouter()
  const params = useSearchParams()
  const setId = params?.get('_id') || ''
  const setTitle = params?.get('title') || 'Unnamed Set'

  console.log('Query parameters:', params?.toString()); // Log query parameters
  if (!setId) {
    alert('Quiz ID (_id) is missing in the URL. Please check the link.');
    return;
  }

  const [blocks, setBlocks] = useState<QuestionBlock[]>([]);

  // โหลดคำถามเดิม (ถ้ามี)
  useEffect(() => {
    if (!setId) {
      console.error('setId is missing or invalid');
      return;
    }

    (async () => {
      try {
        const res = await fetch(`/api/quizzes/${setId}/questions`); // Updated endpoint
        if (!res.ok) {
          console.error('Failed to load questions', await res.text());
          return;
        }
        const questions = await res.json();
        console.log('Fetched questions:', questions); // Log the API response to inspect its structure

        if (!Array.isArray(questions)) {
          console.error('API response is not a valid array of questions:', questions);
          return;
        }

        // Map API response to QuestionBlock structure
        setBlocks(
          questions.map((q: any) => ({
            questionId: q.questionId || null, // Added questionId for updates
            quizId: setId,
            questionText: q.questionText || '',
            choices: q.choices || ['', '', '', ''],
            correctIndex: q.correctIndex || null,
            time: q.time || 0,
            imageUrl: q.imageUrl || '',
          }))
        );
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    })();
  }, [setId]);

  const addBlock = () => {
    setBlocks(ps => [
      ...ps,
      { questionId: null, quizId: setId, questionText: '', choices: ['', '', '', ''], correctIndex: null, time: 0, imageUrl: '' },
    ])
  }
  const removeBlock = async (i: number) => {
    const blockToRemove = blocks[i];

    if (blockToRemove.questionId) {
      try {
        const res = await fetch(`/api/quizzes/${setId}/questions/${blockToRemove.questionId}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          alert('Failed to delete the question from the database.');
          return;
        }
      } catch (error) {
        console.error('Error deleting question:', error);
        alert('An error occurred while deleting the question.');
        return;
      }
    }

    setBlocks(ps => ps.filter((_, idx) => idx !== i));
  };
  const updateBlock = (i: number, field: keyof QuestionBlock, val: any) => {
    setBlocks(ps => {
      const a = [...ps]
      a[i] = { ...a[i], [field]: val }
      return a
    })
  }
  const updateChoice = (i: number, ci: number, val: string) => {
    setBlocks(ps => {
      const a = [...ps]
      a[i].choices[ci] = val
      return a  
    })
  }

  // เตรียม preview รูป
  const onImage = (i: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    updateBlock(i, 'imageUrl', file)
  }
  const removeImage = (i: number) => {
    updateBlock(i, 'imageUrl', null)
  }

  // ส่งทุกคำถาม
  const onFinish = async () => {
    console.log('setId:', setId); // Log setId value
    console.log('API call URL:', `/api/quizzes/${setId}/questions`); // Log the API endpoint being called

    if (!setId || blocks.length === 0) {
      alert("Please provide at least one question.");
      return;
    }

    try {
      // Proceed to save the latest questions
      for (const b of blocks) {
        let imageUrl = typeof b.imageUrl === 'string' ? b.imageUrl : '';

        if (b.imageUrl instanceof File) {
          const fd = new FormData();
          fd.append('file', b.imageUrl);
          const upRes = await fetch('/api/upload/question-image', { method: 'POST', body: fd });
          if (!upRes.ok) {
            alert('Image upload failed');
            return;
          }
          const upData = await upRes.json();
          imageUrl = upData.imageUrl;
        }

        const qRes = await fetch(`/api/quizzes/${setId}/questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionText: b.questionText,
            choices: b.choices,
            correctIndex: b.correctIndex,
            time: b.time,
            imageUrl,
          }),
        });

        if (!qRes.ok) {
          const err = await qRes.json().catch(() => ({}));
          alert('Failed to save a question: ' + (err.error || qRes.statusText));
          return;
        }
      }
      alert("All questions saved!");
      router.push("/login/dashboardteacher/questionslists");
    } catch (e) {
      console.error(e);
      alert("Unexpected error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#A7ABDE] p-6 flex flex-col items-center">
      {/* Top bar */}
      <div className="relative w-full max-w-xl flex items-center justify-center mb-6">
        <button onClick={() => router.back()} className="absolute left-0 text-white p-2">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-white text-lg font-semibold">{setTitle}</h1>
        <button className="absolute right-0 text-white p-2">
          <FiSettings size={24} />
        </button>
      </div>
      {/* Question blocks */}
      <div className="w-full max-w-xl space-y-8">
        {blocks.map((b, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden relative">
            <button onClick={() => removeBlock(i)} className="absolute top-2 right-2 bg-red-300 rounded-full p-1">
              <FiX size={16} color="white" />
            </button>
            <div className="bg-white p-4">
              <h2 className="text-center text-2xl font-bold text-black">Question {i + 1}</h2>
            </div>
            <div className="p-4 flex justify-center">
              {b.imageUrl ? (
                <div className="relative">
                  <Image
                    src={typeof b.imageUrl === 'string' ? b.imageUrl : URL.createObjectURL(b.imageUrl)}
                    alt="Preview"
                    width={128}
                    height={128}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <button onClick={() => removeImage(i)} className="absolute top-1 right-1">
                    <FiX size={16} color="white" />
                  </button>
                </div>
              ) : (
                <label className="w-32 h-32 bg-[#F0F0F0] rounded-lg flex items-center justify-center cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={e => onImage(i, e)} />
                  <Image src="/image-upload.png" width={48} height={48} alt="upload" />
                </label>
              )}
            </div>
            <div className="px-6 pb-4">
              <textarea rows={2} placeholder="Enter question..." value={b.questionText} 
                onChange={e => updateBlock(i, 'questionText', e.target.value)}
                className="w-full bg-[#F9F4F8] p-3 rounded-xl focus:outline-none text-gray-800" />
            </div>
            <div className="bg-[#D2D4F8] p-6 rounded-b-2xl">
              {b.choices.map((c, ci) => (
                <div key={ci} className="flex items-center mb-3">
                  <button onClick={() => updateBlock(i, 'correctIndex', ci)}
                    className={`mr-3 p-1 rounded-full ${b.correctIndex === ci ? 'bg-green-400' : 'bg-white'}`}>
                    <FiCheck size={20} color={b.correctIndex === ci ? 'white' : '#c4bcbc'} />
                  </button>
                  <input type="text" placeholder={`Choice ${ci + 1}`} value={c}
                    onChange={e => updateChoice(i, ci, e.target.value)}
                    className="flex-1 h-10 bg-white rounded-full px-4 focus:outline-none text-gray-800" />
                </div>
              ))}
              <div className="flex items-center justify-end mt-4">
                <span className="text-sm text-[#5B3C3C] mr-3">Set time:</span>
                <input type="number" value={b.time} min={0} max={60}
                  onChange={e => updateBlock(i, 'time', Math.min(60, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-20 p-1 rounded-md text-gray-800" />
              </div>
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-4">
          <button onClick={addBlock} className="py-3 rounded-full bg-pink-200 text-[#8B6868] font-semibold">
            Add
          </button>
          <button onClick={onFinish} className="py-3 rounded-full bg-green-200 text-[#5B3C3C] font-semibold">
            Finish
          </button>
        </div>
      </div>
    </div>
  )
}
