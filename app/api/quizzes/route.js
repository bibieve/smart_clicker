import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Quiz from '@/models/Quiz';

// ดึงชุดคำถามทั้งหมด
export async function GET() {
  await dbConnect();
  const quizzes = await Quiz.find({});
  return NextResponse.json(quizzes);
}

// สร้างชุดคำถามใหม่
export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  if (!body.title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const quiz = await Quiz.create({ title: body.title, teacherId: body.teacherId });
  return NextResponse.json({ success: true, quizId: quiz._id });
}
