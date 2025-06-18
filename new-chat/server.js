const express = require('express')
const app =express()
const http =require('http')
const server =http.createServer(app)
const {Server}=require('socket.io')
app.use(express.static('public'));
const io=new Server(server,{
    cors: {
        origin: "*",  
      },
      transports: ['polling'],
     connectionStateRecovery:{
        ttl: 60000, // Tiempo máximo para intentar reconectar (ms)
        minTimeout: 1000, // Tiempo mínimo entre intentos de reconexión (ms)
        maxAttempts: 5 // Número máximo de intentos de reconexión
     }
    })
//crea un historico
 let messageHistory = [];
//elimina el historico cada 10 minm
setInterval(() => {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000; // 24 horas
  messageHistory = messageHistory.filter(msg => msg.timestamp > cutoff);
}, 1000 * 60 * 10); 


let connectedUsers = [];

io.on('connection',(socket)=>{
    let userName;                     

    socket.on('set-user-name', (name) => {
    userName = name;
    connectedUsers.push({ id: socket.id, name });
    socket.emit('chat-history', messageHistory);
});           

socket.on('clear-history', () => {
  messageHistory = [];
  console.log('📭 Historial de mensajes borrado por el usuario:', socket.id);
  
  // Opcional: avisar a todos los usuarios
  io.emit('chat-history-cleared');
});
socket.on('chat-history-cleared', () => {
  const messagesContainer = document.getElementById('mensaje'); // o el contenedor correcto
  messagesContainer.innerHTML = ''; // borrar todo visualmente
});



    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(user => user.id !== socket.id); // Remove user on disconnect
        readMessages = {};
      });
      socket.on('get-connected-users', () => {
        const usernames = connectedUsers.map(user => user.name); // Extract usernames
        socket.emit('connected-users', { users: usernames });
      });
      
socket.on('new-user', (name)=>{
    io.emit('user-connected', {id: socket.id, name})
})
///evento de tipeo
socket.on('typing', (data) => {
  socket.broadcast.emit('user-typing', data);
});
//stop tipeo
socket.on('stop-typing', () => {
  socket.broadcast.emit('user-stop-typing');
});

    socket.on('chat', (data)=>{
  
        // const messageId = socket.id;
        const message = { id: socket.id, msg: data.msg, name: data.name, timestamp: Date.now()}
        
        messageHistory.push(message); // Guardar mensaje
         io.emit('chat', message);
         
    })

    socket.on('message-read', (senderId) => {
      io.to(senderId).emit('message-read-confirmation', { id: socket.id, name: userName });
    messageHistory=[]
      // Si hay solo un usuario conectado, no eliminamos nada
      if (connectedUsers.length <= 1) return;
    
      // Marcar como leído o eliminar si lo leyó otro usuario
      messageHistory = messageHistory.filter(msg => {
       
        // Si no es el mensaje original, lo dejamos
        if (msg.id !== senderId) return true;
    
        // Si el que leyó no es el autor, eliminamos el mensaje
        if (msg.name !== userName) {
          return false; // Elimina el mensaje
        }
    
        // Si lo leyó el autor, no hacemos nada
        return true;
      });
    });
  }) 
app.get('/', (req, res)=>{
    res.sendFile(`${__dirname}/public/index.html`)
})
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});