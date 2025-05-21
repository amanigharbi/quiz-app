require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const questionsRoutes = require("./routes/questions");
const quizzesRoutes = require("./routes/quizzes");

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizzesRoutes);
app.use("/api/questions", questionsRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Serveur backend sur http://localhost:${process.env.PORT}`);
});
