const mongoose = require('mongoose');

// ✅ Define schema for individual questions
const QuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    type: { type: String, enum: ["multiple_choice", "true_false", "fill_in_the_blank"], required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    choices: [{ type: String }], // Only used for multiple-choice questions
    correct_answer: { type: String, required: true }
});

// ✅ Define schema for quizzes
const QuizSchema = new mongoose.Schema({
    quizname: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    questions: [QuestionSchema] // Array of questions
});

// ✅ Export Quiz model
module.exports = mongoose.model('Quiz', QuizSchema);
