import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import Question from '../../../../models/Question';

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
