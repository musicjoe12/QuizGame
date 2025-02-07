const Quiz = require('../Models/quizModelNew');

// ✅ Fetch a quiz by ID
exports.getQuizById = async (req, res) => {
    try {
        const { quizId } = req.params;
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ message: "❌ Quiz not found!" });
        }

        res.json(quiz);
    } catch (error) {
        console.error("❌ Error fetching quiz:", error);
        res.status(500).json({ message: "❌ Server error", error });
    }
};
