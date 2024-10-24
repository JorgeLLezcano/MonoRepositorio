let name = localStorage.getItem('userName');

// Function to get user name (unchanged)
function obtenerNombre() {
  name = prompt('¿Cuál es tu nombre? :');
  localStorage.setItem('userName', name);
  return name;
}

// Check for stored username (unchanged)
name = localStorage.getItem('userName');

// If no name, prompt for it (unchanged)
if (!name) {
  name = obtenerNombre();
}

let socket = io({
  transports: ['polling'] // Force polling
});

let myId = null;

const header = document.getElementById('header');
const connectedUsersContainer = document.getElementById('connected-users');
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

socket.on('connect', () => {
  myId = socket.id;
  socket.emit('get-connected-users'); // Request connected users on connection
});

function updateConnectedUsers(userList) {
  connectedUsersContainer.innerHTML = ''; // Clear existing list

  // Update title based on user count
  document.title = userList.length > 1 ? 'Usuarios conectados' : 'Chat';

  // Add elements for each connected user
  userList.forEach(user => {
    const userElement = document.createElement('span');
    userElement.textContent = `${user} está conectado`;
    connectedUsersContainer.appendChild(userElement);
  });
}

socket.on('connected-users', (data) => {
  updateConnectedUsers(data.users);
});

const sendMessage = () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('chat', { msg: message, name: name });
    messageInput.value = '';
  }
};

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

socket.on('new-user', (data) => {
  document.title = `${data.name} se ha conectado.`;

  const userElement = document.createElement('span');
  userElement.textContent = `${data.name} está conectado`;
  connectedUsersContainer.appendChild(userElement);
})