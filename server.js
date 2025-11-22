const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configuración CORS más permisiva
app.use(cors({
  origin: "*", // Permitir todos los orígenes temporalmente
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Configuración de Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Middleware para logs detallados
app.use((req, res, next) => {
  console.log(`📨 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Endpoint para recibir HTTP POST del ESP32
app.post('/api/button', (req, res) => {
  console.log('📍 Botón recibido via HTTP:', req.body);
  
  // Validar datos
  if (!req.body.button) {
    return res.status(400).json({ error: 'Falta el campo button' });
  }
  
  // Retransmitir a todos los clientes WebSocket
  io.emit('buttonPress', {
    button: req.body.button,
    state: req.body.state || '1',
    timestamp: new Date().toISOString()
  });
  
  res.json({ 
    status: 'success', 
    button: req.body.button,
    message: 'Botón recibido correctamente',
    clients: io.engine.clientsCount
  });
});

// Endpoint de prueba
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Servidor de joystick funcionando!',
    timestamp: new Date().toISOString(),
    clients: io.engine.clientsCount,
    version: '3.0'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    clients: io.engine.clientsCount,
    time: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Manejo de conexiones WebSocket
io.on('connection', (socket) => {
  console.log('🎮 Nuevo cliente conectado:', socket.id);
  console.log('👥 Total de clientes:', io.engine.clientsCount);
  
  // Enviar mensaje de bienvenida
  socket.emit('welcome', {
    message: 'Conectado al servidor de joystick',
    socketId: socket.id,
    timestamp: new Date().toISOString()
  });
  
  // Manejar mensajes del cliente
  socket.on('message', (data) => {
    console.log('💬 Mensaje del cliente:', socket.id, data);
  });
  
  // Manejar desconexión
  socket.on('disconnect', (reason) => {
    console.log('❌ Cliente desconectado:', socket.id, 'Razón:', reason);
    console.log('👥 Clientes restantes:', io.engine.clientsCount);
  });
  
  // Manejar errores
  socket.on('error', (error) => {
    console.log('❌ Error en socket', socket.id, ':', error);
  });
});

// Manejo de errores del servidor
server.on('error', (error) => {
  console.log('❌ Error del servidor HTTP:', error);
});

// Iniciar servidor
const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor de joystick corriendo en puerto ${PORT}`);
  console.log(`📍 Endpoints HTTP:`);
  console.log(`   GET  http://localhost:${PORT}/api/test`);
  console.log(`   POST http://localhost:${PORT}/api/button`);
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log(`📍 WebSocket: ws://localhost:${PORT}`);
});