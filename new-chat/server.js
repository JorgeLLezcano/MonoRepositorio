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
    connectedUsers.push({ id: socket.id, name: socket.handshake.auth.name })

    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(user => user.id !== socket.id); // Remove user on disconnect
      });
      socket.on('get-connected-users', () => {
        const usernames = connectedUsers.map(user => user.name); // Extract usernames
        socket.emit('connected-users', { users: usernames });
      });
      
socket.on('new-user', (name)=>{
    io.emit('user-connected', {id: socket.id, name})
})


    socket.on('chat', (data)=>{
        // const messageId = socket.id;
        io.emit('chat', { id: socket.id, msg: data.msg, name: data.name })
    })
})
app.get('/', (req, res)=>{
    res.sendFile(`${__dirname}/public/index.html`)
})
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});