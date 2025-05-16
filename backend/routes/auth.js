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
  console.log("userrr ", emailOrUsername);
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

router.get("/profile", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token manquant" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token invalide" });
    res.json({ user });
  });
});

module.exports = router;
