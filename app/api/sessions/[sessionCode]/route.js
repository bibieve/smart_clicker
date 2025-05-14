// filepath: app/api/sessions/[sessionCode]/route.js
import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import Session from '../../../../models/Session';

export async function GET(req, context) {
  await connectMongoDB();
  const sessionCode = context.params.sessionCode;

  if (!sessionCode || sessionCode === 'undefined') {
    return NextResponse.json({ error: 'Session code is required and cannot be undefined' }, { status: 400 });
  }

  const session = await Session.findOne({ code: sessionCode })
    .populate('participants')
    .populate('quizId');

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const sessionObj = session.toObject();
  sessionObj.quiz = sessionObj.quizId;
  delete sessionObj.quizId;

  const currentIndex = sessionObj.currentQuestionIndex || 0;
  sessionObj.currentQuestion = sessionObj.quiz?.questions?.[currentIndex] || null;

  return NextResponse.json(sessionObj);
}

export async function PATCH(req, context) {
  await connectMongoDB();
  const sessionCode = context.params.sessionCode;
  const body = await req.json();

  if (!sessionCode) {
    return NextResponse.json({ error: 'Session code is required' }, { status: 400 });
  }

  const updateData = {};
  if (body.status) updateData.status = body.status;
  if (body.currentQuestionIndex !== undefined) updateData.currentQuestionIndex = body.currentQuestionIndex;

  console.log('PATCH session update:', sessionCode, updateData);
  const session = await Session.findOneAndUpdate(
    { code: sessionCode },
    updateData,
    { new: true }
  );

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  console.log('Updated session:', session);
  return NextResponse.json({ success: true, session });
}
