import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Quiz from '@/models/Quiz';

export async function GET(req, { params }) {
  await dbConnect();
  try {
    const quiz = await Quiz.findById(params.id);
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid quiz ID' }, { status: 400 });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();
  try {
    const body = await req.json();
    const updatedQuiz = await Quiz.findByIdAndUpdate(params.id, body, { new: true });
    if (!updatedQuiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, updatedQuiz });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data or quiz ID' }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();
  try {
    const deleted = await Quiz.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid quiz ID' }, { status: 400 });
  }
}
