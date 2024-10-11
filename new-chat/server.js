const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')

app.use(express.static('public'));

const io = new Server(server, {
  cors: {
    origin: "*",
  },
  transports: ['polling'],
  connectionStateRecovery: {
    ttl: 60000, // Tiempo máximo para intentar reconectar (ms)
    minTimeout: 1000, // Tiempo mínimo entre intentos de reconexión (ms)
    maxAttempts: 5 // Número máximo de intentos de reconexión
  }
})

// Almacenamiento de mensajes en memoria
const mensajes = {}

io.on('connection', (socket) => {
  const userId = socket.id

  // Envía mensajes almacenados al usuario cuando se conecta
  if (mensajes[userId]) {
    mensajes[userId].forEach((mensaje) => {
      socket.emit('chat', mensaje)
    })
    delete mensajes[userId]
  }

  socket.on('chat', (data) => {
    // Almacena el mensaje para cada usuario conectado
    io.emit('chat', { id: socket.id, msg: data.msg, name: data.name })

    // Almacena el mensaje para usuarios no conectados
    if (!mensajes[data.id]) {
      mensajes[data.id] = []
    }
    mensajes[data.id].push({ id: socket.id, msg: data.msg, name: data.name })
  })

  socket.on('disconnect', () => {
    // No es necesario hacer nada aquí
  })
})

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`)
})

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});