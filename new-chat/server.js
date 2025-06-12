// server.js (o index.js)

const express = require('express')
const app =express()
const http =require('http')
const server =http.createServer(app)
const {Server}=require('socket.io')
const path = require('path'); // Importado para consistencia, aunque no es usado en la lógica de persistencia directamente aquí.

app.use(express.static('public')); // Servir archivos estáticos desde la carpeta 'public'
const io=new Server(server,{
    cors: {
        origin: "*",  
        methods: ["GET", "POST"]
      },
      transports: ['polling'],
      connectionStateRecovery:{
        ttl: 60000, // Tiempo máximo para intentar reconectar (ms)
        minTimeout: 1000, // Tiempo mínimo entre intentos de reconexión (ms)
        maxAttempts: 5 // Número máximo de intentos de reconexión
      }
    }
)

// --- NUEVA VARIABLE CLAVE: ALMACENAMIENTO DE MENSAJES ---
// Aquí guardaremos todos los mensajes enviados.
// En una aplicación real, esto sería una base de datos (MongoDB, PostgreSQL, Firebase Firestore, etc.)
let messageHistory = []; 

// Variables para manejar usuarios conectados (tu estructura de array)
let connectedUsers = []; 
// Nota: Tu implementación de connectedUsers es un array. La de Map es más robusta para IDs.
// Si quieres usar el Map como en mi sugerencia anterior, necesitarías cambiar el manejo en 'set-user-name' y 'disconnect'.

io.on('connection',(socket)=>{
    console.log('Un usuario se ha conectado:', socket.id);

    // 1. Cuando un cliente se conecta, **envía el historial de mensajes COMPLETO**
    // Este es el punto CLAVE para la persistencia. El cliente recibe esto al conectar.
    socket.emit('message-history', messageHistory); 

    let userName; // Variable para almacenar el nombre de usuario de este socket

    socket.on('set-user-name', (name) => {
        userName = name; // Asigna el nombre de usuario a la variable local de este socket
        // Asegúrate de que el nombre no sea nulo o vacío
        if (userName && userName.trim()) {
            connectedUsers.push({ id: socket.id, name: userName.trim() });
            // Notifica a todos (incluido el nuevo usuario) que un usuario se ha conectado
            io.emit('user-connected', { id: socket.id, name: userName.trim() });
            updateConnectedUsersList(); // Actualiza la lista de usuarios en línea para todos
        }
    }); 

    socket.on('disconnect', () => {
        const disconnectedUserName = connectedUsers.find(user => user.id === socket.id)?.name;
        connectedUsers = connectedUsers.filter(user => user.id !== socket.id); // Eliminar usuario al desconectar
        // readMessages = {}; // Esto parece ser global; si es por usuario, debería estar dentro de un mapa de usuarios
        
        // Notifica a todos que el usuario se ha desconectado
        if (disconnectedUserName) {
            io.emit('user-disconnected', { id: socket.id, name: disconnectedUserName });
        }
        updateConnectedUsersList(); // Actualiza la lista de usuarios en línea para todos
    });

    socket.on('get-connected-users', () => {
        const usernames = connectedUsers.map(user => user.name); // Extraer nombres de usuario
        socket.emit('connected-users', { users: usernames });
    });
    
    // Este listener 'new-user' ya emite 'user-connected', puede ser redundante con 'set-user-name'
    // que también emite 'user-connected'. Considera unificar tu lógica de conexión.
    socket.on('new-user', (name)=>{
        io.emit('user-connected', {id: socket.id, name});
    });

    // Evento de tipeo
    socket.on('typing', (data) => {
      socket.broadcast.emit('user-typing', data);
    });

    // Evento de dejar de tipear
    socket.on('stop-typing', () => {
      socket.broadcast.emit('user-stop-typing');
    });

    socket.on('chat', (data)=>{
        const messageData = {
            id: socket.id, 
            msg: data.msg, 
            name: data.name,
            timestamp: new Date().toISOString() // Opcional: añade un timestamp
        };
        
        // ¡Almacena el mensaje en el historial ANTES de enviarlo a otros!
        messageHistory.push(messageData); 

        io.emit('chat', messageData); // Envía el mensaje a todos los clientes
    });

    socket.on('message-read', (receiverId) => {
        // Asumiendo que `userName` ya ha sido establecido para este socket
        if (userName) {
            io.to(receiverId).emit('message-read-confirmation', { id: socket.id, name: userName });
        }
    });

    // Función auxiliar para emitir la lista actualizada de usuarios
    function updateConnectedUsersList() {
        io.emit('connected-users', { users: connectedUsers.map(user => user.name) });
    }
})

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Usa path.join para rutas correctas
})

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
