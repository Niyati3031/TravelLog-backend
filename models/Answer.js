const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  answer: String,
  questionId: {
    type: mongoose.Types.ObjectId,
    ref: "questions",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user:{
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("Answers", AnswerSchema);