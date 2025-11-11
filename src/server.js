import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());

// Crear servidor HTTP y WebSocket
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Cuando el ESP32 envía /api/button
app.get("/api/button", (req, res) => {
  const { button, state } = req.query;
  console.log(`Botón ${button}: ${state}`);

  // Emitir evento a todos los navegadores conectados
  io.emit("buttonPress", { button, state });

  res.send("OK");
});

// WebSocket conectado
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado al WebSocket");
  socket.on("disconnect", () => console.log("🔴 Cliente desconectado"));
});

const PORT = 3000;
server.listen(PORT, "0.0.0.0", () =>
  console.log(`Servidor escuchando en http://172.31.3.97:${PORT}`)
);
