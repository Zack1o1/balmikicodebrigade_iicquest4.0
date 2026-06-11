const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

// SIMPLE AI CHAT (mock response for now)
router.post("/chat", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    let response = "";

    // Basic rule-based AI (you can replace with OpenAI later)
    if (message.includes("birth")) {
      response =
        "For Birth Registration, you need Citizenship, Hospital Report, and Ward Recommendation.";
    } else if (message.includes("migration")) {
      response =
        "For Migration Certificate, you need Citizenship and Tax Clearance.";
    } else {
      response =
        "I am PalikaAI assistant. Please ask about municipal services.";
    }

    res.json({
      query: message,
      response,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;