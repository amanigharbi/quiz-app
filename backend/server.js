require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL },
});

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log("Utilisateur connecté :", socket.id);

  socket.on("disconnect", () => {
    console.log("Utilisateur déconnecté :", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Backend opérationnel !");
});

server.listen(process.env.PORT, () => {
  console.log(`Serveur lancé sur le port ${process.env.PORT}`);
});
