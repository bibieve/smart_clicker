import { NextResponse } from 'next/server';
import {connectMongoDB} from '../../../../lib/mongodb';
import Session from '../../../../models/Session';

export async function POST(req) {
  await connectMongoDB();
  const { sessionCode, studentName } = await req.json();

  const session = await Session.findOne({ _id: sessionCode });
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  if (session.status === 'waiting') {
    session.participants.push({ name: studentName, score: 0 });
    await session.save();
    return NextResponse.json({ success: true, message: 'Joined session' });
  } else {
    return NextResponse.json({ error: 'Session already started' }, { status: 400 });
  }
}