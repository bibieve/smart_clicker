'use client'

import { useState, ChangeEvent, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FiArrowLeft, FiSettings, FiX, FiCheck } from 'react-icons/fi'
import Image from 'next/image'


type QuestionBlock = {
  text: string
  imageFile: File | null
  preview: string
  choices: string[]
  correct: number | null
  time: number
}

export default function EditQuestionsPage() {
  const router = useRouter()
  const params = useSearchParams()
  const setId = params?.get('_id') || ''
  const setTitle = params?.get('title') ||'Unnamed Set'

  const [blocks, setBlocks] = useState<QuestionBlock[]>([
    { text: '', imageFile: null, preview: '', choices: ['', '', '', ''], correct: null, time: 0 }
  ])

  // โหลดคำถามเดิม (ถ้ามี)
  useEffect(() => {
    if (!setId) return
    ;(async () => {
      const res = await fetch(`/api/quizzes/${setId}`)
      if (!res.ok) {
        console.error('Failed to load quiz', await res.text())
        return
      }
      const quiz = await res.json()
      // ถ้า payload quiz.questions เป็น array ของ QuestionBlock
      setBlocks(quiz.questions || [])
    })()
  }, [setId])

  const addBlock = () => {
    setBlocks(ps => [
      ...ps,
      { text: '', imageFile: null, preview: '', choices: ['', '', '', ''], correct: null, time: 0 }
    ])
  }
  const removeBlock = (i: number) => {
    setBlocks(ps => ps.filter((_, idx) => idx !== i))
  }
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
    updateBlock(i, 'imageFile', file)
    updateBlock(i, 'preview', url)
  }
  const removeImage = (i: number) => {
    updateBlock(i, 'imageFile', null)
    updateBlock(i, 'preview', '')
  }

  // ส่งทุกคำถาม
  const onFinish = async () => {
    if (!setId || blocks.length === 0) {
      alert("Please provide at least one question.")
      return
    }

    try {
      for (const b of blocks) {
        let imageUrl = ''
        // อัปโหลดรูปก่อน
        if (b.imageFile) {
          const fd = new FormData()
          fd.append('file', b.imageFile)
          const upRes = await fetch('/api/upload/question-image', { method: 'POST', body: fd })
          if (!upRes.ok) {
            alert('Image upload failed')
            return
          }
          const upData = await upRes.json()
          imageUrl = upData.imageUrl
        }
        // ส่งคำถาม
        const qRes = await fetch(`/api/quizzes/${setId}/questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionText: b.text,
            choices: b.choices,
            correctIndex: b.correct,
            time: b.time,
            imageUrl
          })
        })
        if (!qRes.ok) {
          const err = await qRes.json().catch(() => ({}))
          alert('Failed to save a question: ' + (err.error || qRes.statusText))
          return
        }
      }
      alert("All questions saved!")
      router.push("/login/dashboardteacher/questionslists")
    } catch (e) {
      console.error(e)
      alert("Unexpected error. Please try again.")
    }
  }

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
              <h2 className="text-center text-2xl font-bold">Question {i + 1}</h2>
            </div>
            <div className="p-4 flex justify-center">
              {b.preview ? (
                <div className="relative">
                  <Image src={b.preview} alt="Preview" width={128} height={128}
                    className="w-32 h-32 object-cover rounded-lg" />
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
              <textarea rows={2} placeholder="Enter question..." value={b.text} 
                onChange={e => updateBlock(i, 'text', e.target.value)}
                className="w-full bg-[#F9F4F8] p-3 rounded-xl focus:outline-none text-gray-500" />
            </div>
            <div className="bg-[#D2D4F8] p-6 rounded-b-2xl">
              {b.choices.map((c, ci) => (
                <div key={ci} className="flex items-center mb-3">
                  <button onClick={() => updateBlock(i, 'correct', ci)}
                    className={`mr-3 p-1 rounded-full ${b.correct === ci ? 'bg-green-400' : 'bg-white'}`}>
                    <FiCheck size={20} color={b.correct === ci ? 'white' : '#c4bcbc'} />
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
