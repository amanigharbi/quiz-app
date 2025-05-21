const express = require("express");
const router = express.Router();
const db = require("../db"); // connexion mysql2

// Créer une question + réponses
router.post("/", async (req, res) => {
  const { quiz_id, question_text, answers } = req.body;

  if (!quiz_id || !question_text || !Array.isArray(answers)) {
    return res.status(400).json({ error: "Données manquantes." });
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO questions (quiz_id, question_text) VALUES (?, ?)",
      [quiz_id, question_text]
    );

    const questionId = result.insertId;

    for (let answer of answers) {
      await db.execute(
        "INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)",
        [questionId, answer.text, answer.is_correct ? 1 : 0]
      );
    }

    res.status(201).json({ message: "Question et réponses ajoutées.", questionId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
