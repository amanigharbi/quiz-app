const express = require("express");
const router = express.Router();
const db = require("../db"); // Connexion MySQL (mysql2 ou autre)

router.post("/", async (req, res) => {
  const { title, description, user_id } = req.body;

  if (!title || !user_id) {
    return res.status(400).json({ error: "Titre et user_id requis." });
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO quizzes (title,description, user_id) VALUES (?, ?,?)",
      [title, description, user_id]
    );

    res.status(201).json({
      message: "Quiz créé",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Erreur lors de la création du quiz :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// routes/quizzes.js

router.get("/:id/questions", async (req, res) => {
  const quizId = req.params.id;

  try {
    const [questions] = await db.execute(
      "SELECT id, question_text FROM questions WHERE quiz_id = ?",
      [quizId]
    );

    for (const q of questions) {
      const [answers] = await db.execute(
        "SELECT id, answer_text, is_correct FROM answers WHERE question_id = ?",
        [q.id]
      );
      q.answers = answers;
    }

    res.status(200).json(questions);
  } catch (err) {
    console.error("Erreur chargement questions:", err.message);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

router.put("/:id", async (req, res) => {
  const questionId = req.params.id;
  const { question_text, answers } = req.body;

  try {
    await db.execute("UPDATE questions SET question_text = ? WHERE id = ?", [
      question_text,
      questionId,
    ]);

    // Supprimer les anciennes réponses
    await db.execute("DELETE FROM answers WHERE question_id = ?", [questionId]);

    // Ajouter les nouvelles
    for (const a of answers) {
      await db.execute(
        "INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)",
        [questionId, a.text, a.is_correct ? 1 : 0]
      );
    }

    res.json({ message: "Question mise à jour." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la mise à jour." });
  }
});

module.exports = router;
