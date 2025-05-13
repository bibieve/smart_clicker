// // models/QuestionSet.js
// import mongoose from "mongoose";

// const QuestionSetSchema = new mongoose.Schema({
//   name: String,       // ชื่อชุดคำถาม
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   questions: [
//     {
//       text: String,
//       imageFile: String,  // ชื่อไฟล์ภาพ (ถ้ามี)
//       choices: [String],
//       correct: Number,   // ตัวเลือกที่ถูก
//       time: Number       // เวลาที่ตั้งในแต่ละข้อ
//     }
//   ]
// });

// const QuestionSet = mongoose.models.QuestionSet || mongoose.model("QuestionSet", QuestionSetSchema);
// export default QuestionSet;

