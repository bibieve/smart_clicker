import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  questionText: String,
  choices: [String],
  correctIndex: Number,
  time: Number
});

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);