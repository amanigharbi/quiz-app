const express = require("express");
const router = express.Router();
const db = require("../db"); // Connexion MySQL (mysql2 ou autre)

router.post("/", async (req, res) => {
  const { title, user_id } = req.body;

  if (!title || !user_id) {
    return res.status(400).json({ error: "Titre et user_id requis." });
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO quizzes (title, user_id) VALUES (?, ?)",
      [title, user_id]
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


module.exports = router;
