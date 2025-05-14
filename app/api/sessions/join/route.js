import { NextResponse } from 'next/server';
import {connectMongoDB} from '../../../../lib/mongodb';
import Session from '../../../../models/Session';

export async function POST(req) {
  await connectMongoDB();
  let { sessionCode, studentName } = await req.json();

  if (!sessionCode || !studentName) {
    return NextResponse.json({ error: 'Session code and student name are required' }, { status: 400 });
  }

  sessionCode = sessionCode.toString().trim();
  studentName = studentName.toString().trim();

  const session = await Session.findOne({ code: sessionCode });

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  if (session.status !== 'waiting' && session.status !== 'in-progress') {
    return NextResponse.json({ error: 'Session is not joinable' }, { status: 400 });
  }

  session.participants.push({ name: studentName });
  await session.save();

  return NextResponse.json({ success: true, sessionCode });
}