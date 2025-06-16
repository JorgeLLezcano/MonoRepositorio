import { createPicker } from "picmo";


let name = localStorage.getItem('userName');

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
    
    transports: ['polling']  // Fuerza el uso de polling
  });

let myId = null;
const body=document.querySelector('body')
const header=document.querySelector('header')
const main=document.querySelector('main')
const from =document.querySelector('form')
const input=document.querySelector('input')
const mensaje=document.querySelector('ul')
const messagesContainer = document.getElementById('messages');
const sent=document.querySelector('.sent')
const received=document.querySelector('.received')
const notificador=document.querySelector('.notificaciones')
const emojiButton = document.getElementById('emoji-button');
const emojiPiker=document.getElementById('emoji-picker')
emojiPiker.style.display="none"
// const emojis = ['😀', '😂', '😍', '😎', '😢', '👍', '🔥', '❤️', '🎉', '🚀'];



// Inicializar el selector de emojis
const picker = createPicker({ rootElement: emojiPiker });

// Insertar emoji en el input al seleccionarlo
picker.addEventListener("emoji:select", event => {
  input.value += event.emoji;
  
});

// Mostrar/ocultar el selector de emojis
emojiButton.addEventListener("click", (event) => {
  console.log('emojiButton')
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
    myId = socket.id;                    // Almacena el ID del cliente actual
    socket.emit('set-user-name', name); //Informe su nombre al servidor
    socket.emit('get-connected-users');//solicita usuarios conectados

})

  
from.addEventListener('submit',(e)=>{
    e.preventDefault()
    if(input.value){
        socket.emit('chat', { msg: input.value, name: name })///propiedades del mensaje
        input.value=''
    }
})

socket.emit('new-user', name);// Escuchar el evento cuando un nuevo usuario se conecta


socket.on('user-connected', (data) => {
   
    document.title=`${data.name} se ha conectado.`

  
   const modal=document.createElement('ul')
   modal.classList.add('modal')
   notificador.appendChild(modal)
   
    const userConected=document.createElement('li')
    if(data.id !== myId){
      userConected.innerHTML=`${data.name}  se ha conectado`
      
   }else {
        userConected.innerHTML = 'Estás conectado';
       
      }
      modal.appendChild(userConected)
      window.addEventListener('focus', () => {
        setTimeout(() => {
            document.title = 'chat';
            notificador.removeChild(modal)
        }, 3000);
     }
 );    
});

socket.on('connected-users', (data) => {
    console.log('Usuarios conectados:', data);
  
    const connectedUsersElement = document.getElementById('user-online');
   
  
    const userCounts = {}; // Objeto para contar ocurrencias
  
    data.users.forEach((user) => {
      if (user !== name) {
        const modal=document.createElement('ul')
        modal.classList.add('modal')
        notificador.appendChild(modal)



        const userConected=document.createElement('li')

        userCounts[user] = (userCounts[user] || 0) + 1;
  

        if (userCounts[user] <= 1) {

        const userElement = document.createElement('span');
        userElement.textContent = user;
        
        connectedUsersElement.appendChild(userElement);
        userConected.innerHTML=user  + '  ya esta en coneccion';
        
        modal.appendChild(userConected)

                  setTimeout(() => {
                    notificador.removeChild(modal);
                }, 3000);
              }
      }
    });

   
  
  });

   //funcion para saber cuando esta escribiendo
  let typing = false;
  let timeout;

  input.addEventListener('input', () => {
    if (!typing){
    socket.emit('typing', { name: name });
    typing=true
  }

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    socket.emit('stop-typing');
    typing = false;
  }, 2000); // 2 segundos sin escribir
  });

  let typingIndicator;

socket.on('user-typing', (data) => {
  if (!typingIndicator) {
    typingIndicator = document.createElement('li');
    typingIndicator.innerHTML = `
    <i>${data.name} está escribiendo...</i>
    <div class="loader">
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    class="star star1"
    viewBox="0 0 256 256"
  >
    <path
      d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
    ></path>
  </svg>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    class="star star2"
    viewBox="0 0 256 256"
  >
    <path
      d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
    ></path>
  </svg>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    class="star star3"
    viewBox="0 0 256 256"
  >
    <path
      d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
    ></path>

  
  </svg>
 
    </div>
    `;
    // ${data.name} está escribiendo
    
    mensaje.appendChild(typingIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
});

socket.on('user-stop-typing', () => {
  if (typingIndicator) {
    mensaje.removeChild(typingIndicator);
    typingIndicator = null;
  }
});
let newMenssges=0
let readMessages = {};
///funcion chat
socket.on('chat', (data)=>{
  newMenssges++
  typing = false;
  // Eliminar indicador de escritura
  if (typingIndicator) {
    mensaje.removeChild(typingIndicator);
    typingIndicator = null;
  }
    const item=document.createElement('li')
    const chat=`
<strong>${data.id===myId? 'Tu' :data.name}</strong>: <p>${data.msg}</p>`
 item.innerHTML+=chat

 if (data.id !== myId) {
    document.title = newMenssges  +'  Mensaje nuevo';

    window.addEventListener('focus', () => {
     
      if (!readMessages[data.id]) {
    socket.emit('message-read', data.id);
    readMessages[data.id] = true;
      }
  })
}

window.addEventListener('focus', () => {
    newMenssges=0
    document.title = 'chat';
});
   
    mensaje.appendChild(item)
   
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
    if(data.id===myId){
        item.classList.add('enviado')
        item.classList.remove('recivido')
       
    }else{
        item.classList.add('recibido')
        item.classList.remove('enviado')
        
    }
})

//verfica si el mensaje fue leido
socket.on('message-read-confirmation', (data) => {
  
  const readIndicator = document.createElement('li');
  readIndicator.innerHTML = `<i>${data.name} ha leído el mensaje . </i>`;
  mensaje.appendChild(readIndicator);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;


  window.addEventListener('focus', () => {
setTimeout(() => {
    mensaje.removeChild(readIndicator);
},2000)
  })
});

//mensajes histoircos
socket.on('chat-history', (messages) => {
    messages.forEach((data) => {
      const item = document.createElement('li');
      const messageTime = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const chat = `${messageTime}
           <strong>${data.id === myId ? 'Tu' : data.name}</strong>: <p>${data.msg}</p>`;
      item.innerHTML = chat;
      item.classList.add(data.id === myId ? 'enviado' : 'recibido');
      mensaje.appendChild(item);
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });


