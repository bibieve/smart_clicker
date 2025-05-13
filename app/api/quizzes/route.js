import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../lib/mongodb';
import Quiz from '../../../models/Quiz';

// ดึงชุดคำถามทั้งหมด
export async function GET() {
  await connectMongoDB();
  try {
    const quizzes = await Quiz.find({}, '_id title'); // ดึงเฉพาะ _id และ title
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error.message);
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
  }
}

// สร้างชุดคำถามใหม่
export async function POST(req) {
  await connectMongoDB();
  try {
    const body = await req.json();

    // ตรวจสอบว่าฟิลด์ title มีค่าหรือไม่
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // สร้าง Quiz ใหม่
    const quiz = await Quiz.create({ title: body.title, teacherId: body.teacherId });
    return NextResponse.json({ success: true, quizId: quiz._id });
  } catch (error) {
    console.error('Error creating quiz:', error.message);
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
  }
}
