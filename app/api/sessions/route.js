// /app/api/sessions/route.js
import { NextResponse } from 'next/server';
import {connectMongoDB} from '../../../lib/mongodb';
import Session from '../../../models/Session';

export async function POST(req) {
  await connectMongoDB();
  const { quizId } = await req.json();

  const sessionCode = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join(''); // Generate 5-digit numeric code

  try {
    const session = new Session({
      quizId,
      participants: [],
      startedAt: new Date(),
      status: 'waiting',
      code: sessionCode, // Assign generated numeric code
    });

    await session.save();
    console.log('Created session with code:', sessionCode, 'session ID:', session._id.toString());
    // Explicitly return sessionCode and session ID for debugging
    return NextResponse.json({ success: true, sessionCode, sessionId: session._id.toString() }, { status: 200 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
