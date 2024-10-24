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


    let users = {};

io.on('connection',(socket)=>{
socket.on('new-user', (name)=>{
    users[socket.id] = name; 
    io.emit('user-connected', {id: socket.id, name})
    socket.emit('connected-users', users);
})


    socket.on('chat', (data)=>{
        // const messageId = socket.id;
        io.emit('chat', { id: socket.id, msg: data.msg, name: data.name })
    })
    
    socket.on('disconnect', () => {
        const name = users[socket.id];
        delete users[socket.id];  // Eliminar el usuario desconectado
        io.emit('user-disconnected', { id: socket.id, name });  // Notificar a todos que el usuario se desconectó
    });

})
app.get('/', (req, res)=>{
    res.sendFile(`${__dirname}/public/index.html`)
})
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});