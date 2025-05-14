// /app/api/sessions/[sessionCode]/route.js
import { NextResponse } from 'next/server';
import {connectMongoDB} from '../../../../lib/mongodb';
import Session from '../../../../models/Session';

export async function GET(req, { params }) {
  await connectMongoDB();
  const session = await Session.findOne({ _id: params.sessionCode }).populate('participants');
  
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  return NextResponse.json(session);
}
