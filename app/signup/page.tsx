"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'


export default function Signup() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="min-h-screen bg-[#A7ABDE] flex justify-center items-center p-4">
      <div className="bg-[#D2D4F8] rounded-[30px] shadow-lg p-10 w-full max-w-[700px] max-h-[700px]">

        <h2 className="text-3xl font-bold text-[#8B6868] mb-6 ">Sign up</h2>

        <form className="space-y-4">
          {/* First Name */}
          <div className="flex items-center">
            <label className="w-1/4 font-bold text-[#8B6868]">First Name</label>
            <input
              type="text"
              className="w-3/4 p-4 h-[40px] bg-[#F9F4F8] font-boldborder border-gray-200 rounded-full focus:outline-none"
              placeholder="First Name"
            />
          </div>

          {/* Last Name */}
          <div className="flex items-center">
            <label className="w-1/4 text-[#8B6868] font-bold ">Last Name</label>
            <input
              type="text"
              className="w-3/4 p-4 h-[40px] bg-[#F9F4F8] border border-gray-200 rounded-full focus:outline-none"
              placeholder="Last Name"
            />
          </div>

          {/* Student ID */}
          <div className="flex items-center">
            <label className="w-1/4 text-[#8B6868] font-bold">Student ID</label>
            <input
              type="text"
              className="w-3/4 p-4 h-[40px] bg-[#F9F4F8] border border-gray-200 rounded-full focus:outline-none"
              placeholder="Student ID"
            />
          </div>

          {/* Email */}
          <div className="flex items-center">
            <label className="w-1/4 text-[#8B6868] font-bold">Email</label>
            <input
              type="email"
              className="w-3/4 p-4 h-[40px] bg-[#F9F4F8] border border-gray-200 rounded-full focus:outline-none"
              placeholder="Email"
            />
          </div>

          {/* Password */}
          <div className="flex items-center relative">
            <label className="w-1/4 text-[#8B6868] font-bold">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-3/4 p-4 h-[40px] bg-[#F9F4F8] border border-gray-200 rounded-full focus:outline-none pr-12"
              placeholder="Password"
            />
            <div
              className="absolute right-4 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEye size={24} /> : <AiOutlineEyeInvisible size={24} />}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex items-center relative">
            <label className="w-1/4 text-[#8B6868] font-bold">Confirm password</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="w-3/4 p-4 h-[40px] bg-[#F9F4F8] border border-gray-200 rounded-full focus:outline-none pr-12"
              placeholder="Confirm Password"
            />
            <div
              className="absolute right-4 cursor-pointer text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <AiOutlineEye size={24} /> : <AiOutlineEyeInvisible size={24} />}
            </div>
          </div>

          {/* ปุ่ม Back และ Submit */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="bg-[#F9F4F8] font-bold text-[#5B3C3C] px-6 py-3 rounded-full shadow-md"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-[#8D6C6C] font-bold text-white px-6 py-3 rounded-full shadow-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}