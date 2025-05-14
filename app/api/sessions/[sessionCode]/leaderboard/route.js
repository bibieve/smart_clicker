import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Session from '../../../../../models/Session';

export async function GET(req, { params }) {
  await connectMongoDB();
  const sessionCode = params.sessionCode;

  if (!sessionCode) {
    return NextResponse.json({ error: 'Session code is required' }, { status: 400 });
  }

  const session = await Session.findOne({ code: sessionCode }).populate('participants');

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const leaderboard = session.participants
    .sort((a, b) => b.score - a.score)
    .map((participant, index) => ({
      rank: index + 1,
      name: participant.name,
      score: participant.score,
    }));

  return NextResponse.json({ leaderboard });
}
