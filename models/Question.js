const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionName: String,
  questionUrl: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  answers: {
    type: mongoose.Types.ObjectId,
    ref: "Answers",
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("Questions", QuestionSchema);