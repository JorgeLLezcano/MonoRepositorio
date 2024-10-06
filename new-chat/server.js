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
      transports: ['polling'] 
    }
)
io.on('connection',(socket)=>{
    socket.on('chat', (msg)=>{
        const messageId = socket.id;
        io.emit('chat', { id: messageId, msg: msg })
    })
})
app.get('/', (req, res)=>{
    res.sendFile(`${__dirname}/public/index.html`)
})
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});