import mongoose from 'mongoose';

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: { type: Array, default: [] },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);
export default Quiz;