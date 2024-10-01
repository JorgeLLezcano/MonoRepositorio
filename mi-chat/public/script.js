const socket = io();
const messageInput = document.getElementById('message');
const messages = document.getElementById('messages');

messageInput.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    socket.emit('chat message', messageInput.value);
    messageInput.value = '';
  }
});

socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});