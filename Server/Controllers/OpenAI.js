const axios = require("axios");

const generateQuestions = async (req, res) => {
  const { topic, count = 5 } = req.body;

  const prompt = `Generate ${count} quiz questions about "${topic}".
Include a balanced variety of question types: "multiple_choice", "true_false", and "fill_in_the_blank".
Format each question as JSON with these fields:
- question (string),
- type ("multiple_choice", "true_false", "fill_in_the_blank"),
- difficulty ("easy", "medium", "hard"),
- correct_answer (string),
- choices (array of strings, only for multiple_choice). 

Respond with a JSON array.`;


  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct", // ✅ Free model
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // optional for openrouter
        },
      }
    );

    const raw = response.data.choices[0].message.content;

    console.log("🧠 AI Raw Output:\n", raw);

    let questions;
    try {
      questions = JSON.parse(raw);
    } catch (parseErr) {
      console.error("❌ Failed to parse JSON from AI:", parseErr.message);
      return res.status(500).json({
        message: "Failed to parse questions. AI may have returned invalid JSON.",
        raw,
      });
    }

    res.json(questions);
  } catch (error) {
    console.error("❌ OpenRouter AI error:", error.response?.data || error.message);
    res.status(500).json({ message: "AI generation failed", error: error.message });
  }
};

module.exports = { generateQuestions };
