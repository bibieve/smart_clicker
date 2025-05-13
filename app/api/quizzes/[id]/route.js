import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import Quiz from '../../../../models/Quiz';

export async function GET(req, { params }) {
  await connectMongoDB();
  try {
    const quiz = await Quiz.findById(params.id);
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error.message);
    return NextResponse.json({ error: 'Invalid quiz ID' }, { status: 400 });
  }
}

export async function PUT(req, { params }) {
  await connectMongoDB();
  try {
    const { id } = params;
    const body = await req.json();

    // อัปเดตสถานะ isDeleted เป็น true
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { isDeleted: true }, // อัปเดตฟิลด์ isDeleted
      { new: true } // ส่งเอกสารที่อัปเดตกลับมา
    );

    if (!updatedQuiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, updatedQuiz });
  } catch (error) {
    console.error('Error updating quiz:', error.message);
    return NextResponse.json({ error: 'Failed to update quiz' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectMongoDB();
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(params.id);
    if (!deletedQuiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quiz:', error.message);
    return NextResponse.json({ error: 'Failed to delete quiz' }, { status: 500 });
  }
}

