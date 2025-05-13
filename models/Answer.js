import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  selectedIndex: Number,
  isCorrect: Boolean,
  answeredAt: { type: Date, default: Date.now }
});

export default mongoose.models.Answer || mongoose.model('Answer', AnswerSchema);