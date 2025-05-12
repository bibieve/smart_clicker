import { connectMongoDB } from "../../../lib/mongodb";
import QuestionSet from "../../../models/QuestionSet";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { setTitle, questions } = await request.json();

    if (!setTitle || !questions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectMongoDB();

    const result = await QuestionSet.create({ title: setTitle, questions });

    return NextResponse.json({ message: "Question set saved successfully", result });
  } catch (error) {
    console.error("Error saving question set:", error.message);
    return NextResponse.json({ error: error.message || "Failed to save question set" }, { status: 500 });
  }
}