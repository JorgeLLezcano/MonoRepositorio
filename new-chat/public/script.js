import { createPicker } from "picmo";

let name = localStorage.getItem('userName');
let myId = null; // Se inicializará en socket.on('connect')

// Función para obtener el nombre del usuario
function obtenerNombre() {
    name = prompt('¿Cuál es tu nombre? :');
    localStorage.setItem('userName', name);
    return name;
}

// Verificar si hay un nombre almacenado en localStorage
name = localStorage.getItem('userName');

// Si no hay nombre, pedirlo al usuario
if (!name) {
    name = obtenerNombre();
}

let socket = io({
    transports: ['polling'] // Fuerza el uso de polling
});

const body = document.querySelector('body');
const header = document.querySelector('header');
const main = document.querySelector('main');
const from = document.querySelector('form');
const input = document.querySelector('input');
const mensaje = document.querySelector('ul'); // Este es el <ul> donde se añaden los <li> de mensajes
const messagesContainer = document.getElementById('messages'); // Asumo que este es el contenedor padre del <ul> (el div que tiene overflow)
const sent = document.querySelector('.sent');
const received = document.querySelector('.received');
const notificador = document.querySelector('.notificaciones');
const emojiButton = document.getElementById('emoji-button');
const emojiPiker = document.getElementById('emoji-picker');
emojiPiker.style.display = "none";

// Inicializar el selector de emojis
const picker = createPicker({ rootElement: emojiPiker });

// Insertar emoji en el input al seleccionarlo
picker.addEventListener("emoji:select", event => {
    input.value += event.emoji;
});

// Mostrar/ocultar el selector de emojis
emojiButton.addEventListener("click", (event) => {
    console.log('emojiButton');
    event.stopPropagation();
    emojiPiker.style.display = emojiPiker.style.display === "none" ? "block" : "none";
});

document.addEventListener('click', (event) => {
    // Si el clic no fue en el botón de toggle NI dentro del div del picker
    if (!emojiButton.contains(event.target) && !emojiPiker.contains(event.target)) {
        emojiPiker.style.display = "none";
    }
});

socket.on('connect', () => {
    myId = socket.id; // Almacena el ID del cliente actual
    socket.emit('set-user-name', name); // Informa su nombre al servidor
    socket.emit('get-connected-users'); // Solicita usuarios conectados
});

from.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat', { msg: input.value, name: name }); // Propiedades del mensaje
        input.value = '';
    }
});

socket.emit('new-user', name); // Escuchar el evento cuando un nuevo usuario se conecta

socket.on('user-connected', (data) => {
    document.title = `${data.name} se ha conectado.`;

    const modal = document.createElement('ul');
    modal.classList.add('modal');
    notificador.appendChild(modal);

    const userConected = document.createElement('li');
    if (data.id !== myId) {
        userConected.innerHTML = `${data.name} se ha conectado`;
    } else {
        userConected.innerHTML = 'Estás conectado';
    }
    modal.appendChild(userConected);

    window.addEventListener('focus', () => {
        setTimeout(() => {
            document.title = 'chat';
            // Asegúrate de que `modal` exista antes de intentar removerlo
            if (notificador.contains(modal)) {
                notificador.removeChild(modal);
            }
        }, 3000);
    });
});

socket.on('connected-users', (data) => {
    console.log('Usuarios conectados:', data);

    const connectedUsersElement = document.getElementById('user-online');
    // Limpia los usuarios anteriores para evitar duplicados al reconectar o actualizar
    if (connectedUsersElement) {
        connectedUsersElement.innerHTML = '';
    }

    const userCounts = {}; // Objeto para contar ocurrencias

    data.users.forEach((user) => {
        if (user !== name) {
            const modal = document.createElement('ul');
            modal.classList.add('modal');
            notificador.appendChild(modal);

            const userConected = document.createElement('li');
            userCounts[user] = (userCounts[user] || 0) + 1;

            if (userCounts[user] <= 1) { // Evita mostrar el mismo usuario varias veces si la lista viene con duplicados
                const userElement = document.createElement('span');
                userElement.textContent = user;
                connectedUsersElement.appendChild(userElement);
                userConected.innerHTML = user + ' ya está en conexión';
                modal.appendChild(userConected);

                setTimeout(() => {
                    // Asegúrate de que `modal` exista antes de intentar removerlo
                    if (notificador.contains(modal)) {
                        notificador.removeChild(modal);
                    }
                }, 3000);
            }
        }
    });
});

// Función para saber cuando está escribiendo
let typing = false;
let timeout;

input.addEventListener('input', () => {
    if (!typing) {
        socket.emit('typing', { name: name });
        typing = true;
    }

    clearTimeout(timeout);
    timeout = setTimeout(() => {
        socket.emit('stop-typing');
        typing = false;
    }, 2000); // 2 segundos sin escribir
});

let typingIndicator;

socket.on('user-typing', (data) => {
    // Asegúrate de que el indicador solo se cree una vez
    if (!typingIndicator && data.name !== name) { // No mostrar "tú estás escribiendo"
        typingIndicator = document.createElement('li');
        typingIndicator.innerHTML = `
            <i>${data.name} está escribiendo...</i>
            <div class="loader">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="star star1" viewBox="0 0 256 256">
                    <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="star star2" viewBox="0 0 256 256">
                    <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="star star3" viewBox="0 0 256 256">
                    <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                </svg>
            </div>`;
        mensaje.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});

socket.on('user-stop-typing', () => {
    if (typingIndicator) {
        // Asegúrate de que el indicador de escritura sea un hijo directo de 'mensaje' antes de intentar eliminarlo
        if (mensaje.contains(typingIndicator)) {
            mensaje.removeChild(typingIndicator);
        }
        typingIndicator = null;
    }
});

let newMenssges = 0;
// No necesitamos readMessages aquí en el cliente con la nueva lógica del servidor
// let readMessages = {}; // Eliminado o comentado

// Función para verificar si un elemento está en la ventana gráfica (simplificada)
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Función para agregar un mensaje a la pantalla, ahora con lógica de "leído"
function addMessageToChat(message) {
    const messageElement = document.createElement('li'); // Usamos 'li' directamente
    messageElement.id = `msg-${message.id}`; // Dale a cada mensaje un ID de DOM único
    const messageTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageElement.innerHTML = `
        <strong>${message.id === myId ? 'Tu' : message.name}</strong>: <p>${message.msg}</p>
        <span>${messageTime}</span>`;

    messageElement.classList.add(message.id === myId ? 'enviado' : 'recibido');
    mensaje.appendChild(messageElement); // 'mensaje' es tu <ul>

    // Desplazar hacia abajo
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Emitir 'message-read' si el mensaje es de otro usuario y está visible
    if (message.id !== myId) { // Solo si no es tu propio mensaje
        // Usamos setTimeout para asegurar que el elemento esté renderizado en el DOM
        // y la comprobación de visibilidad sea precisa.
        setTimeout(() => {
            if (isElementInViewport(messageElement)) {
                console.log(`Emitiendo 'message-read' para ID: ${message.id}`);
                socket.emit('message-read', message.id);
            }
        }, 300); // Pequeño retraso para la renderización
    }
}


/// Evento 'chat' (nuevo mensaje entrante)
socket.on('chat', (data) => {
    newMenssges++;
    typing = false;
    // Eliminar indicador de escritura si existe
    if (typingIndicator && mensaje.contains(typingIndicator)) {
        mensaje.removeChild(typingIndicator);
        typingIndicator = null;
    }

    addMessageToChat(data); // Reutilizamos la función para añadir el mensaje

    if (data.id !== myId) {
        document.title = newMenssges + ' Mensaje nuevo';
    }

    window.addEventListener('focus', () => {
        newMenssges = 0;
        document.title = 'chat';
    });
});

// Escuchar el evento para eliminar un mensaje del DOM
socket.on('remove-message', (messageId) => {
    const messageElement = document.getElementById(`msg-${messageId}`);
    if (messageElement) {
        messageElement.remove();
        console.log(`Mensaje con ID: ${messageId} eliminado de la interfaz de usuario.`);
    }
});

// Verificación de mensaje leído por otro usuario (confirmación)
socket.on('message-read-confirmation', (data) => {
    const readIndicator = document.createElement('li');
    readIndicator.innerHTML = `<i>${data.name} ha leído el mensaje.</i>`;
    readIndicator.classList.add('read-indicator'); // Añadir una clase para posibles estilos o remoción

    // Si quieres que el indicador aparezca justo después del mensaje leído (del remitente)
    // Esto es un poco más complejo y podría requerir buscar el mensaje específico por ID en el DOM
    // Por ahora, lo añadimos al final del chat.
    mensaje.appendChild(readIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    window.addEventListener('focus', () => {
        setTimeout(() => {
            if (mensaje.contains(readIndicator)) {
                mensaje.removeChild(readIndicator);
            }
        }, 2000);
    });
});

// Mensajes históricos (se cargan al unirse)
socket.on('chat-history', (messages) => {
    // Limpiamos el contenedor antes de añadir el historial
    mensaje.innerHTML = '';
    messages.forEach((data) => {
        addMessageToChat(data); // Reutilizamos la función para añadir cada mensaje del historial
    });
});

const clearBtn = document.getElementById('clearHistoryBtn');
if (clearBtn) { // Asegurarse de que el botón existe
    clearBtn.addEventListener('click', () => {
        socket.emit('clear-history'); // Emitir al servidor para que borre
    });
}