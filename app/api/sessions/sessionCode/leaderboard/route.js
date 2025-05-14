// /app/api/sessions/[sessionCode]/leaderboard/route.js
import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Session from '../../../../../models/Session';

export async function GET(req, { params }) {
  await connectMongoDB();
  const session = await Session.findOne({ _id: params.sessionCode }).populate('participants');

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
