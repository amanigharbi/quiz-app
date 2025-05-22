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
// routes/quizzes.js

router.delete("/questions/:id", async (req, res) => {
  const questionId = req.params.id;

  try {
    // Supprimer d'abord les réponses liées
    await db.execute("DELETE FROM answers WHERE question_id = ?", [questionId]);

    // Puis supprimer la question
    await db.execute("DELETE FROM questions WHERE id = ?", [questionId]);

    res.json({ message: "Question supprimée." });
  } catch (err) {
    console.error("Erreur suppression question:", err.message);
    res.status(500).json({ error: "Erreur lors de la suppression." });
  }
});
router.get("/users/:userId/quizzes", async (req, res) => {
  const userId = req.params.userId;

  try {
    const [quizzes] = await db.execute(
      "SELECT id, title, description, created_at FROM quizzes WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    res.json(quizzes);
  } catch (err) {
    console.error("Erreur chargement des quizzes:", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
router.put("/:id/quiz", async (req, res) => {
  const quizId = req.params.id;
  let { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Le titre est requis." });
  }

  // Remplacer undefined par null
  if (description === undefined) {
    description = null;
  }

  try {
    const [result] = await db.execute(
      "UPDATE quizzes SET title = ?, description = ? WHERE id = ?",
      [title, description, quizId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Quiz non trouvé." });
    }

    res.json({ message: "Quiz mis à jour." });
  } catch (err) {
    console.error("Erreur update quiz:", err.message);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

router.delete("/:id/quiz", async (req, res) => {
  const quizId = req.params.id;

  try {
    // Vérifier si le quiz existe
    const [quiz] = await db.execute("SELECT * FROM quizzes WHERE id = ?", [
      quizId,
    ]);

    if (quiz.length === 0) {
      return res.status(404).json({ error: "Quiz introuvable." });
    }

    // Supprimer le quiz
    await db.execute("DELETE FROM quizzes WHERE id = ?", [quizId]);

    res.json({ message: "Quiz supprimé avec succès." });
  } catch (err) {
    console.error("Erreur suppression quiz:", err.message);
    res.status(500).json({ error: "Erreur lors de la suppression du quiz." });
  }
});
// routes/quizzes.js
router.post("/:id/submit", async (req, res) => {
  const quizId = req.params.id;
  const { user_id, answers, duration } = req.body;

  try {
    const [questions] = await db.execute(
      "SELECT id, question_text FROM questions WHERE quiz_id = ?",
      [quizId]
    );

    let rawScore = 0;
    const details = [];

    for (const q of questions) {
      const [allAnswers] = await db.execute(
        "SELECT id, answer_text, is_correct FROM answers WHERE question_id = ?",
        [q.id]
      );
      const selected = answers[q.id];

      const correct = allAnswers.find((a) => a.is_correct === 1)?.id;
      if (selected && selected == correct) rawScore++;

      details.push({
        question: q.question_text,
        selected,
        answers: allAnswers,
      });
    }

    const totalQuestions = questions.length;
    const percentScore = Math.round((rawScore / totalQuestions) * 100);

    // Sauvegarde du score en pourcentage
    await db.execute(
      "INSERT INTO scores (user_id, quiz_id, score,duration_seconds) VALUES (?, ?, ?,?)",
      [user_id, quizId, percentScore, duration]
    );

    res.json({
      score: percentScore,
      rawScore,
      totalQuestions,
      details,
      quiz_id: quizId,
      duration,
    });
  } catch (err) {
    console.error("Erreur submit quiz:", err.message);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Classement des scores pour un quiz donné
router.get("/:id/scores", async (req, res) => {
  const quizId = req.params.id;
  try {
    const [rows] = await db.execute(
      `
      SELECT s.score, s.completed_at,s.duration_seconds, u.username
      FROM scores s
      JOIN users u ON s.user_id = u.id
      WHERE s.quiz_id = ?
      ORDER BY s.score DESC, s.completed_at ASC
      `,
      [quizId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Erreur classement scores:", err.message);
    res.status(500).json({ error: "Erreur lors du chargement des scores." });
  }
});

module.exports = router;
