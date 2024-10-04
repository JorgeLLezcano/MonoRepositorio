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
// const messages = document.getElementById('messages');
// const socket = io();
// const messageInput = document.getElementById('message');
// const form = document.getElementById('form'); // Referencia al formulario

// form.addEventListener('submit', (event) => { // Escuchador de eventos
//   event.preventDefault(); // Evita la recarga de la página
//   const message = messageInput.value;
//   if (message) {
//     socket.emit('chat message', message);
//     const item = document.createElement('li');
//     item.textContent = message;
//     item.classList.add('sent'); // Clase para mensajes enviados
//     messages.appendChild(item);
//     messageInput.value = '';
//   }
// });