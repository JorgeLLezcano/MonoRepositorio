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
    }
    
)
let connectedUsers = [];

io.on('connection',(socket)=>{

    let userName;                     

    socket.on('set-user-name', (name) => {
    userName = name;
    connectedUsers.push({ id: socket.id, name });
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
        io.emit('chat', { id: socket.id, msg: data.msg, name: data.name })
        
    })

    socket.on('message-read', (receiverId) => {
      io.to(receiverId).emit('message-read-confirmation', { id: socket.id, name: userName });
  });
})
app.get('/', (req, res)=>{
    res.sendFile(`${__dirname}/public/index.html`)
})
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});