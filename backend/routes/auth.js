const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

router.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  db.query(
    "INSERT INTO users (username,email, password) VALUES (?, ?,?)",
    [username, email, hash],
    (err, result) => {
      if (err)
        return res.status(400).json({ error: "Utilisateur existe déjà" });
      res.json({ message: "Inscription réussie" });
    }
  );
});

router.post("/login", (req, res) => {
  const { emailOrUsername, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE email = ? OR username = ?",
    [emailOrUsername, emailOrUsername],
    (err, results) => {
      if (err || results.length === 0)
        return res.status(401).json({ error: "Utilisateur introuvable" });

      const user = results[0];
      const valid = bcrypt.compareSync(password, user.password);
      if (!valid)
        return res.status(401).json({ error: "Mot de passe incorrect" });

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
    }
  );
});
const { sendResetPasswordEmail } = require("../utils/mailer");

router.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur serveur" });
      }
      if (results.length === 0)
        return res.status(404).json({ error: "Utilisateur non trouvé" });

      const user = results[0];
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      const resetLink = `${process.env.FRONTEND_URL}reset-password/${token}`;

      try {
        await sendResetPasswordEmail(email, resetLink);
        res.json({
          message: "Un lien de réinitialisation a été envoyé par email.",
        });
      } catch (mailErr) {
        console.error(mailErr);
        res.status(500).json({ error: "Erreur lors de l'envoi de l'e-mail." });
      }
    }
  );
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashed = await bcrypt.hash(password, 10);

    db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashed, decoded.id],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erreur serveur" });
        }
        if (result.affectedRows === 0)
          return res.status(404).json({ error: "Utilisateur non trouvé" });

        res.json({ message: "Mot de passe réinitialisé avec succès." });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Lien invalide ou expiré." });
  }
});

router.get("/profile", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token manquant" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token invalide" });
    res.json({ user });
  });
});

module.exports = router;
