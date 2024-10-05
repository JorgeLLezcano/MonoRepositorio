const express = require('express')
const app =express()


const http =require('http')
const server =http.createServer(app)

const {Server}=require('socket.io')

app.use(express.static('public'));

const io=new Server(server)

io.on('connection',(socket)=>{
    //console.log('un usuario conectado')

    // socket.on('diconnect', ()=>{
    //     console.log('un usurio se a desconectado')
    // })
    
    // socket.on('chat',(msg)=>{
    //     console.log('mensaje: ' +msg)
    // })
     
    socket.on('chat', (msg)=>{
        const messageId = socket.id;
        io.emit('chat', { id: messageId, msg: msg })
        // socket.emit('messageId', { id: messageId, msg: msg });
    })
})
app.get('/', (req, res)=>{
    // res.send('<h1>Aplicacion de chat</h1>')

    res.sendFile(`${__dirname}/public/index.html`)
})
server.listen(3000,()=>{
    console.log('servidor corriendo en http://localhost:3000')
})