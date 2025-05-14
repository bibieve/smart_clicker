import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Session from '../../../../../models/Session';

export async function POST(req, { params }) {
  await connectMongoDB();
  const sessionCode = params.sessionCode;
  const { studentName, questionIndex, selectedIndex, correctIndex } = await req.json();

  if (!sessionCode || !studentName) {
    return NextResponse.json({ error: 'Missing session code or student name' }, { status: 400 });
  }

  const session = await Session.findOne({ code: sessionCode });
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const participant = session.participants.find(p => p.name === studentName);
  if (!participant) {
    return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
  }

  // Only score once per question
  const scoreAwarded = selectedIndex === correctIndex ? 1 : 0;
  session.participants = session.participants.map(p => {
    if (p.name === studentName) {
      return { ...p, score: p.score + scoreAwarded };
    }
    return p;
  });

  await session.save();
  return NextResponse.json({ success: true, updatedScore: participant.score + scoreAwarded });
}
