// models/QuestionSet.js
import mongoose from "mongoose";

const QuestionNameSchema = new mongoose.Schema({
  name: String,       // ชื่อชุดคำถาม
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const QuestionName = mongoose.models.QuestionSet || mongoose.model("QuestionName", QuestionNameSchema);
export default QuestionName;
