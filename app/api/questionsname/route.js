// import {connectMongoDB} from "../../../lib/mongodb";
// import QuestionSet from "../../../models/QuestionSet";
// import next from "next";
// import { NextResponse } from "next/server";

// export async function questionName(request) {
//     const { questionName } = await request.json();
//     console.log("questionName", questionName);
//     await connectMongoDB();
//     await QuestionSet.create({ name: questionName });
//     return NextResponse.json({ questionName });
// }
import { connectMongoDB } from "../../../lib/mongodb";
import QuestionSet from "../../../models/QuestionSet";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { questionName } = await request.json();
        console.log("questionName", questionName);

        await connectMongoDB();
        await QuestionSet.create({ name: questionName });

        return NextResponse.json({ message: "Question added successfully", questionName });
    } catch (error) {
        console.error("Error adding question:", error);
        return NextResponse.json({ error: "Failed to add question" }, { status: 500 });
    }
}