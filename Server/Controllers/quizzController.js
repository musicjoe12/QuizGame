const Quiz = require('../Models/quizModelNew'); // ✅ Use the correct model

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

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    console.error("❌ Failed to fetch quizzes:", error);
    res.status(500).json({ message: "Server error fetching quizzes" });
  }
};

// ✅ Create quiz
exports.createQuiz = async (req, res) => {
    try {
        const { quizname, description, category, questions } = req.body; // Destructure the data from the payload

        // Validate the data, make sure all required fields are present
        if (!quizname || !category) {
            return res.status(400).json({ message: "❌ Quiz name and category are required." });
        }

        const newQuiz = new Quiz({
            quizname,
            description,
            category,
            questions
        });

        const savedQuiz = await newQuiz.save();
        res.status(201).json(savedQuiz); // Respond with the saved quiz

    } catch (err) {
        console.error("❌ Failed to create quiz:", err);
        res.status(500).json({ message: "Server error creating quiz" });
    }
};
exports.deleteQuiz = async (req, res) => {
    try {
      const { quizId } = req.params;
      await Quiz.findByIdAndDelete(quizId);
      res.json({ message: "✅ Quiz deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting quiz:", error);
      res.status(500).json({ message: "Server error deleting quiz" });
    }
  };
  exports.updateQuiz = async (req, res) => {
    try {
      const { quizId } = req.params;
      const updatedData = req.body;
  
      const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, updatedData, { new: true });
  
      if (!updatedQuiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
  
      res.json(updatedQuiz);
    } catch (error) {
      console.error("❌ Error updating quiz:", error);
      res.status(500).json({ message: "Server error updating quiz" });
    }
  };
  