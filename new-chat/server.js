const express = require('express')
const app =express()


const http =require('http')
const server =http.createServer(app)

const {Server}=require('socket.io')

app.use(express.static('public'));


  

const io=new Server(server,{
    cors: {
        origin: "*",  // Asegúrate de permitir la CORS en producción
      },
      transports: ['polling'] // Usa polling en lugar de websockets
    }
)

io.on('connection',(socket
    
)=>{
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
const port = process.env.PORT || 3000;

server.listen(3000,()=>{
    console.log('Servidor corriendo en http://localhost:${port}')
})