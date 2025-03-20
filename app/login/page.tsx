import Image from 'next/image'
// import { Afacad } from 'next/font/google'
// const afacad = Afacad({ subsets: ['latin'], weight: ['400', '700'] })
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#A7ABDE] flex justify-center items-center p-4">
      <div className="bg-[#D2D4F8] flex flex-col md:flex-row rounded-[30px] shadow-lg p-4 md:p-8 w-full max-w-[750px] min-h-[450px] md:h-[400px]">

        {/* รูปภาพ */}
        <div className="flex-1 flex justify-center items-center">
          <Image     
            src="/Logo%202.png"
            alt="logo"
            width={300} 
            height={300}
            className="rounded-lg" 
          />
        </div>

        {/* ฟอร์ม Login */}
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-[#8B6868] mb-6 text-center">
            Sign in
          </h2>

          <form className="space-y-3 md:space-y-4 text-[#A59696]">
            <input
              type="email"
              placeholder="Email Address"
              className="bg-[#F9F4F8] w-full p-2 md:p-3 border border-gray-300 rounded-full focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-[#F9F4F8] w-full p-2 md:p-3 border border-gray-300 rounded-full focus:outline-none"
            />
            <div className="text-right">
              <a href="#" className="text-red-400 text-xs md:text-sm hover:underline">
                Forget your password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-[#8D6C6C] text-white p-2 md:p-3 rounded-full hover:bg-[#7a5a5a]"
            >
              Login
            </button>
          </form>
          

          <p className="text-center mt-3 md:mt-4 text-xs md:text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-[#5B3C3C] hover:underline">
            Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
