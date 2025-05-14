// /app/api/sessions/route.js
import { NextResponse } from 'next/server';
import {connectMongoDB} from '../../../lib/mongodb';
import Session from '../../../models/Session';

export async function POST(req) {
  await connectMongoDB();
  const { quizId } = await req.json();

  const session = new Session({
    quizId,
    participants: [],
    startedAt: new Date(),
    status: 'waiting', 
  });

  await session.save();
  return NextResponse.json({ success: true, sessionCode: session._id });
}
