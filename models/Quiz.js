import mongoose from 'mongoose';

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);