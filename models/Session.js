import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  participants: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: String,
      score: { type: Number, default: 0 }
    }
  ],
  status: { type: String, default: 'waiting' },
  startedAt: { type: Date },
  currentQuestionIndex: { type: Number, default: 0 },
  code: { type: String, required: true, unique: true }, // Added code field
}, { timestamps: true });

export default mongoose.models.Session || mongoose.model('Session', SessionSchema);