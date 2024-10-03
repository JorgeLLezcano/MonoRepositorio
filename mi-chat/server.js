const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");

const port = 3000;

app.use(express.static('public')); // Servir archivos estáticos (HTML, CSS, JS)

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('Un usuario se ha conectado');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}  http://localhost:${port}`);
});

