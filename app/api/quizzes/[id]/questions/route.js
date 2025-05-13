import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Question from '@/models/Question';

export async function GET(req, { params }) {
  await dbConnect();
  try {
    const questions = await Question.find({ quizId: params.id });
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  await dbConnect();
  try {
    const body = await req.json();
    
    // ตรวจสอบข้อมูลที่ต้องมี
    const { questionText, choices, correctIndex, time, imageUrl } = body;
    if (!questionText || !choices || correctIndex === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newQuestion = await Question.create({
      quizId: params.id,
      questionText,
      choices,
      correctIndex,
      time,
      imageUrl
    });

    return NextResponse.json({ success: true, questionId: newQuestion._id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}
