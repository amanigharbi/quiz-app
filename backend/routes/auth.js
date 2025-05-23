const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { sendResetPasswordEmail } = require("../utils/mailer");

const router = express.Router();

// ✅ Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hash]
    );

    res.json({ message: "Inscription réussie" });
  } catch (err) {
    console.error("❌ Erreur register :", err);
    res
      .status(400)
      .json({ error: "Utilisateur existe déjà ou erreur serveur" });
  }
});
router.post("/login", async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const [results] = await db.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [emailOrUsername, emailOrUsername]
    );

    if (results.length === 0) {
      return res.status(401).json({ error: "Utilisateur introuvable" });
    }

    const user = results[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("🔥 Erreur login:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ✅ Forgot password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const user = results[0];
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await sendResetPasswordEmail(email, resetLink);

    res.json({
      message: "Un lien de réinitialisation a été envoyé par email.",
    });
  } catch (err) {
    console.error("❌ Erreur forgot-password :", err);
    res.status(500).json({ error: "Erreur serveur ou d'envoi d'e-mail." });
  }
});

// ✅ Reset password
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashed, decoded.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (err) {
    console.error("❌ Erreur reset-password :", err);
    res.status(400).json({ error: "Lien invalide ou expiré." });
  }
});

module.exports = router;
