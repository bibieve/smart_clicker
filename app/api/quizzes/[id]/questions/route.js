import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Question from '../../../../../models/Question';

export async function GET(req, props) {
  const params = await props.params;
  await connectMongoDB();
  try {
    const questions = await Question.find({ quizId: params.id });
    const questionsWithAnswers = questions.map((q) => {
      const baseResponse = {
        questionText: q.text, // Map `text` to `questionText`
        choices: q.choices,
        correctIndex: q.correct, // Map `correct` to `correctIndex`
        time: q.time,
        correctAnswer: q.correct === 0 ? 0 : q.choices[q.correct], // Explicitly set `choices: 0` when `correct` is 0
      };

      // Include imageUrl only if it exists
      if (q.imageUrl) {
        baseResponse.imageUrl = q.imageUrl;
      }

      return baseResponse;
    });

    return NextResponse.json(questionsWithAnswers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 });
  }
}

export async function POST(req, props) {
  const params = await props.params;
  await connectMongoDB();
  try {
    const body = await req.json();
    
    console.log('Incoming request body:', body); // Log the request body
    console.log('Quiz ID:', params.id); // Log the quiz ID

    // Ensure database connection
    if (!params.id) {
      return NextResponse.json({ error: 'Quiz ID is missing' }, { status: 400 });
    }

    // ตรวจสอบข้อมูลที่ต้องมี
    const { questionText, choices, correctIndex, time, imageUrl } = body;

    if (!questionText) {
      return NextResponse.json({ error: 'Question text is required' }, { status: 400 });
    }

    if (!Array.isArray(choices) || choices.length < 2) {
      return NextResponse.json({ error: 'At least two choices are required' }, { status: 400 });
    }

    // Ensure correctIndex is between 0 and 3
    if (correctIndex < 0 || correctIndex > 3) {
      return NextResponse.json({ error: 'Correct index must be between 0 and 3' }, { status: 400 });
    }

    const newQuestion = await Question.create({
      quizId: params.id,
      text: questionText, // Map to schema field
      choices,
      correct: correctIndex, // Map to schema field
      time,
      imageUrl
    });

    return NextResponse.json({ success: true, questionId: newQuestion._id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}

export async function PUT(req, props) {
  const params = await props.params;
  await connectMongoDB();
  try {
    const { id } = params;
    const { questionText, choices, correctIndex, time, imageUrl } = await req.json();

    // Ensure correctIndex is between 0 and 3
    if (correctIndex < 0 || correctIndex > 3) {
      return NextResponse.json({ error: 'Correct index must be between 0 and 3' }, { status: 400 });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(id, {
      text: questionText, // Map to schema field
      choices,
      correct: correctIndex, // Map to schema field
      time,
      imageUrl
    }, { new: true });

    if (!updatedQuestion) {
      return NextResponse.json({ error: 'Question not found or invalid ID' }, { status: 404 });
    }

    return NextResponse.json({ success: true, updatedQuestion });
  } catch (error) {
    console.error('Error updating question:', error.stack); // Log full error stack
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
  }
}

export async function DELETE(req, props) {
  const params = await props.params;
  await connectMongoDB();
  try {
    const { id } = params;

    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return NextResponse.json({ error: 'Question not found or invalid ID' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting question:', error.stack); // Log full error stack
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
  }
}

export async function DELETE_ALL(req, props) {
  const params = await props.params;
  await connectMongoDB();
  try {
    const deletedQuestions = await Question.deleteMany({ quizId: params.id });

    return NextResponse.json({ success: true, deletedCount: deletedQuestions.deletedCount });
  } catch (error) {
    console.error('Error deleting questions:', error.stack); // Log full error stack
    return NextResponse.json({ error: 'Failed to delete questions' }, { status: 500 });
  }
}