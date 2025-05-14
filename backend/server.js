// backend/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL },
});

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log("Un utilisateur connecté :", socket.id);

  socket.on("disconnect", () => {
    console.log("Utilisateur déconnecté :", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Serveur backend actif !");
});

server.listen(3001, () => {
  console.log("Serveur Node démarré sur le port 3001");
});
