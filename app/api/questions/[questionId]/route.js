import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import Question from '../../../../models/Question';

export async function GET(req) {
  await connectMongoDB();
  const { searchParams } = new URL(req.url);
  const quizId = searchParams.get('quizId');

  console.log('quizId:', quizId); // ตรวจสอบค่า quizId

  if (!quizId) {
    return NextResponse.json({ error: 'quizId is required' }, { status: 400 });
  }

  try {
    const questions = await Question.find({ quizId });
    console.log('Fetched questions:', questions); // ตรวจสอบข้อมูลที่ดึงมา
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connectMongoDB();
  try {
    const body = await req.json();
    
    // อัปเดตคำถามโดยใช้ questionId
    const updatedQuestion = await Question.findByIdAndUpdate(params.questionId, body, { new: true });

    if (!updatedQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, updated: updatedQuestion });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectMongoDB();
  try {
    const deletedQuestion = await Question.findByIdAndDelete(params.questionId);

    if (!deletedQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
  }
}
