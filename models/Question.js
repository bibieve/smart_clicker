import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true }, // เชื่อมโยงกับ Quiz
  text: { type: String, required: true },
  choices: { type: [String], required: true },
  correct: { type: Number, required: true },
  time: { type: Number, default: 0 },
  imageUrl: { type: String, default: '' },
});

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);