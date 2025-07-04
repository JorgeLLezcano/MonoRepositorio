// server.js
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

app.use(express.static('public'));

const io = new Server(server, {
  cors: {
    origin: "*",
  },
  transports: ['polling'],
  connectionStateRecovery: {
    ttl: 60000,
    minTimeout: 1000,
    maxAttempts: 5
  }
});

let messageHistory = [];
let readTimestamps = {}; // Stores { messageId: { readerSocketId: timestampWhenRead } }

// This interval clears messages older than 24 hours (original functionality)
setInterval(() => {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000; // 24 hours
  messageHistory = messageHistory.filter(msg => msg.timestamp > cutoff);
  // Also clean up readTimestamps for messages that no longer exist
  for (const msgId in readTimestamps) {
    if (!messageHistory.some(msg => msg.id === msgId)) {
      delete readTimestamps[msgId];
    }
  }
}, 1000 * 60 * 10); // Runs every 10 minutes

let connectedUsers = [];

io.on('connection', (socket) => {
  let userName;

  socket.on('set-user-name', (name) => {
    userName = name;
    connectedUsers.push({ id: socket.id, name });
    socket.emit('chat-history', messageHistory);
  });

  socket.on('disconnect', () => {
    connectedUsers = connectedUsers.filter(user => user.id !== socket.id);
  });

  socket.on('get-connected-users', () => {
    const usernames = connectedUsers.map(user => user.name);
    socket.emit('connected-users', { users: usernames });
  });

  socket.on('new-user', (name) => {
    io.emit('user-connected', { id: socket.id, name });
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('user-typing', data);
  });

  socket.on('stop-typing', () => {
    socket.broadcast.emit('user-stop-typing');
  });

  socket.on('chat', (data) => {
    const message = {
      id: `${socket.id}-${Date.now()}`, // Unique ID for each message
      msg: data.msg,
      name: data.name,
      timestamp: Date.now()
    };
    messageHistory.push(message);
    io.emit('chat', message);
  });

  socket.on('message-read', (messageId) => {
    const readerSocketId = socket.id;
    const readerName = userName;

    // Record when this message was read by this specific user
    if (!readTimestamps[messageId]) {
      readTimestamps[messageId] = {};
    }
    readTimestamps[messageId][readerSocketId] = Date.now();

    // Check if the message should be removed
    const messageIndex = messageHistory.findIndex(msg => msg.id === messageId);

    if (messageIndex !== -1) {
      const message = messageHistory[messageIndex];

      // Don't delete if the sender is the only one who read it, or if no one else has read it yet
      const otherReaders = Object.keys(readTimestamps[messageId]).filter(id => id !== message.id);

      // If another user has read this message
      if (otherReaders.length > 0) {
        // Find the timestamp of the *first* read by a user other than the sender
        const firstOtherReadTimestamp = Math.min(
          ...otherReaders.map(readerId => readTimestamps[messageId][readerId])
        );

        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000); // 5 minutes in milliseconds

        if (firstOtherReadTimestamp <= fiveMinutesAgo) {
          // Remove the message from history
          messageHistory.splice(messageIndex, 1);
          delete readTimestamps[messageId]; // Clean up read timestamps for this message
          io.emit('remove-message', messageId); // Tell clients to remove it
          console.log(`🗑️ Message "${message.msg}" (ID: ${messageId}) removed after 5 minutes of being read by another user.`);
        }
      }
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});