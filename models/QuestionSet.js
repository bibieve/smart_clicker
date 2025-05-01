// models/QuestionSet.js
import mongoose from "mongoose";

const QuestionSetSchema = new mongoose.Schema({
  name: String,       // ชื่อชุดคำถาม เช่น "Forward Kinematics"
  createdAt: {
    type: Date,
    default: Date.now
  },
});

export default mongoose.models.QuestionSet || mongoose.model("QuestionSet", QuestionSetSchema);
