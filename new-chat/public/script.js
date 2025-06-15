// script.js

// Variables globales para elementos del DOM
// Es buena práctica obtener todas las referencias al inicio del script.
const from = document.querySelector('form');
const input = document.querySelector('input');
const mensaje = document.querySelector('ul'); // Esta es la <ul> dentro de #messages
const messagesContainer = document.getElementById('messages'); // El div que contiene la ul
const notificador = document.querySelector('.notificaciones');
const userOnlineElement = document.getElementById('user-online'); // Asumo que tienes un id="user-online" en tu HTML


let name = localStorage.getItem('userName');
let myId = null; // ID del socket del cliente

// Función para obtener el nombre del usuario
function obtenerNombre() {
    let userNameInput = prompt('¿Cuál es tu nombre? :');
    // Asegúrate de que se proporcione un nombre y no esté vacío/solo espacios
    while (!userNameInput || userNameInput.trim() === '') {
        userNameInput = prompt('Tu nombre no puede estar vacío. ¿Cuál es tu nombre? :');
    }
    localStorage.setItem('userName', userNameInput.trim()); // Guarda el nombre sin espacios extra
    return userNameInput.trim();
}

// Si no hay nombre almacenado o está vacío, pedirlo al usuario
if (!name || name.trim() === '') {
    name = obtenerNombre();
}

// Inicializar la conexión Socket.IO
// Asegúrate de que el script de Socket.IO cliente esté cargado en tu HTML
// <script src="/socket.io/socket.io.js"></script>
let socket = io({
    transports: ['polling'] // Forzar el uso de polling
});

// --- LISTENERS DE EVENTOS GLOBALES ---
// Gestiona el título del documento y limpia notificaciones al enfocar la ventana
let newMessagesCount = 0; // Contador de mensajes nuevos cuando la ventana no está enfocada
window.addEventListener('focus', () => {
    if (newMessagesCount > 0) {
        newMessagesCount = 0; // Reinicia el contador
        document.title = 'chat'; // Reinicia el título del documento
    }
    // Limpia todos los modales de notificación activos de forma robusta
    const activeModals = document.querySelectorAll('.notificaciones .modal');
    activeModals.forEach(modal => modal.remove());
});


// --- MANEJADORES DE EVENTOS DE SOCKET.IO ---
socket.on('chat-history', (messages) => {
  messages.forEach((data) => {
    const item = document.createElement('li');
    const messageTime = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const chat = `<div class="time">${messageTime}</div>
    <strong>${data.id === myId ? 'Tu' : data.name}</strong>: 
                  <p>${data.msg}</p>`;

    item.innerHTML = chat;
    item.classList.add(data.id === myId ? 'enviado' : 'recibido');
    mensaje.appendChild(item);
  });
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
});


socket.on('connect', () => {
    myId = socket.id; // Almacena el ID del cliente actual
    socket.emit('set-user-name', name); // Informa al servidor el nombre de usuario de este cliente

    // 1. SOLICITAR EL HISTORIAL DE MENSAJES (¡NUEVO EMIT!)
    // Aunque el servidor lo emite automáticamente, solicitarlo al conectar es una buena práctica
    // por si el servidor no lo hizo o para un control más explícito.
    socket.emit('get-message-history'); 

    // Solicitar la lista de usuarios conectados (para el panel "En línea...")
    socket.emit('get-connected-users');
});

// --- 2. LISTENER PARA RECIBIR EL HISTORIAL DE MENSAJES DEL SERVIDOR (¡NUEVO!) ---
socket.on('message-history', (history) => {
    // Limpia los mensajes existentes para evitar duplicados si hay una reconexión
    mensaje.innerHTML = '';
    history.forEach(messageData => { // messageData es un objeto {id, msg, name, timestamp}
        appendMessage(messageData); // Reutiliza tu función para agregar mensajes
    });
    // Desplázate al final del chat después de cargar todo el historial
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});


// --- Envío de Mensajes de Chat ---
from.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value.trim()) { // .trim() para evitar enviar mensajes solo con espacios
        const messageData = { msg: input.value.trim(), name: name }; // No es necesario 'id: myId' aquí, el servidor lo añade
        socket.emit('chat', messageData);
        // *** CAMBIO CLAVE AQUÍ: SE ELIMINA LA ACTUALIZACIÓN OPTIMISTA ***
        // *** appendMessage({ id: myId, msg: messageData.msg, name: messageData.name }); ***
        // Ahora el mensaje solo se añadirá cuando sea recibido del servidor vía socket.on('chat')
        input.value = ''; // Limpia el input
    }
});


// --- Notificaciones de Conexión/Desconexión de Usuario ---
socket.on('user-connected', (data) => {
    // Solo muestra notificación para OTROS usuarios que se conectan
    if (data.id !== myId) {
        const notificationItem = document.createElement('li');
        notificationItem.className = 'system-notification'; // Clase para estilos de notificaciones del sistema
        notificationItem.innerHTML = `<i>${data.name} se ha conectado.</i>`;
        mensaje.appendChild(notificationItem);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Cambia brevemente el título del documento
        document.title = `${data.name} se ha conectado.`;
        setTimeout(() => { document.title = 'chat'; }, 3000); // Vuelve al título original
    } else {
        // Mensaje de bienvenida para el propio usuario al conectarse
        const welcomeMessage = document.createElement('li');
        welcomeMessage.className = 'system-notification';
        welcomeMessage.innerHTML = `<i>Estás conectado como ${name}.</i>`;
        mensaje.appendChild(welcomeMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});

// Actualiza la lista de usuarios conectados en el panel derecho (recibida del servidor)
socket.on('connected-users', (data) => {
    if (userOnlineElement) { // Asegúrate de que el elemento exista
        userOnlineElement.innerHTML = ''; // Limpia la lista existente para evitar duplicados
        if (data.users && data.users.length > 0) {
            // Usa Set para asegurar que no haya nombres duplicados si el servidor los enviara
            const uniqueUsers = new Set(data.users);
            uniqueUsers.forEach(userName => {
                const userElement = document.createElement('span');
                userElement.textContent = userName;
                userOnlineElement.appendChild(userElement);
            });
        } else {
            userOnlineElement.textContent = 'Nadie más en línea.';
        }
    }
});

socket.on('user-disconnected', (data) => {
    const notificationItem = document.createElement('li');
    notificationItem.className = 'system-notification';
    notificationItem.innerHTML = `<i>${data.name} se ha desconectado.</i>`;
    mensaje.appendChild(notificationItem);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Solicita la lista actualizada de usuarios conectados después de una desconexión
    socket.emit('get-connected-users');
});


// --- Lógica de Indicador de Escritura ---
let typing = false;
let typingTimeout;
let typingIndicatorElement; // Variable para mantener la referencia al elemento del indicador de escritura

input.addEventListener('input', () => {
    if (!typing) {
        socket.emit('typing', { name: name, id: myId }); // Envía también tu ID al servidor
        typing = true;
    }

    clearTimeout(typingTimeout); // Reinicia el temporizador cada vez que se escribe
    typingTimeout = setTimeout(() => {
        socket.emit('stop-typing', { id: myId }); // Envía también tu ID al servidor
        typing = false;
    }, 2000); // 2 segundos de inactividad
});

socket.on('user-typing', (data) => {
    // Solo muestra el indicador si no es tu propio evento de escritura y si no está ya visible
    if (data.id !== myId && !typingIndicatorElement) {
        typingIndicatorElement = document.createElement('li');
        typingIndicatorElement.className = 'typing-indicator'; // Clase para estilos del indicador
        typingIndicatorElement.innerHTML = `
            <i>${data.name} está escribiendo...</i>
            <div class="loader">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="star star1" viewBox="0 0 256 256"><path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="star star2" viewBox="0 0 256 256"><path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="star star3" viewBox="0 0 256 256"><path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path></svg>
            </div>
        `;
        mensaje.appendChild(typingIndicatorElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});

socket.on('user-stop-typing', (data) => {
    // Si el usuario que dejó de escribir NO eres tú, y el indicador está visible
    if (data.id !== myId && typingIndicatorElement) { 
        mensaje.removeChild(typingIndicatorElement);
        typingIndicatorElement = null;
    }
});


// --- Función unificada para agregar mensajes al DOM ---
// Ahora esta función se llamará tanto para mensajes nuevos como para los del historial
function appendMessage(data) {
    const item = document.createElement('li');
    const senderName = data.id === myId ? 'Tú' : data.name; // 'Tú' en lugar de 'Tu' para gramática
    const messageContent = `<strong>${senderName}</strong>: <p>${data.msg}</p>`;
    item.innerHTML = messageContent;

    // Aplica clases para estilos (enviado/recibido)
    if (data.id === myId) {
        item.classList.add('enviado');
        item.classList.remove('recibido'); // Asegura que no tenga ambas
    } else {
        item.classList.add('recibido');
        item.classList.remove('enviado'); // Asegura que no tenga ambas

        // Incrementa el contador de mensajes nuevos si la ventana no está enfocada
        if (!document.hasFocus()) {
            newMessagesCount++;
            document.title = `${newMessagesCount} Mensaje${newMessagesCount > 1 ? 's' : ''} nuevo`;
        }
    }
    
    mensaje.appendChild(item); // Agrega el mensaje a la lista (<ul>)
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll
}


// Listener principal para mensajes de chat (tanto los tuyos como los de otros)
socket.on('chat', (data) => {
    typing = false; // Reinicia el estado de escritura porque se recibió un mensaje
    if (typingTimeout) clearTimeout(typingTimeout); // Limpia cualquier temporizador de "dejar de escribir"

    // Remueve el indicador de escritura si está visible (por si el mensaje llega antes del timeout)
    if (typingIndicatorElement) {
        mensaje.removeChild(typingIndicatorElement);
        typingIndicatorElement = null;
    }

    appendMessage(data); // Usa la función unificada para agregar el mensaje
});


// Listener para confirmación de lectura (podría ser más sofisticado)
socket.on('message-read-confirmation', (data) => {
    const readIndicator = document.createElement('li');
    readIndicator.className = 'system-notification'; // Usa una clase para estas notificaciones
    readIndicator.innerHTML = `<i>${data.name} ha leído el mensaje.</i>`;
    mensaje.appendChild(readIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Desplázate al final


    // Elimina el indicador después de un tiempo, sin un listener global de 'focus' aquí
    // ya que este setTimeout es por el indicador específico.
    setTimeout(() => {
        readIndicator.remove(); // .remove() es más directo que removeChild
    }, 2000);
});
