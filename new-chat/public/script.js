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

   
socket.on('connect', () => {
    myId = socket.id;  // Almacena el ID del cliente actual
    socket.emit('set-user-name', name); 
    socket.emit('get-connected-users');//solicita usuarios conectados

})

  
from.addEventListener('submit',(e)=>{
    e.preventDefault()
    if(input.value){
        socket.emit('chat', { msg: input.value, name: name })
        input.value=''
    }
})

socket.emit('new-user', name);

// Escuchar el evento cuando un nuevo usuario se conecta


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
  
        if (userCounts[user] <= 2) {
        const userElement = document.createElement('span');
        userElement.textContent = user + '🗯';
        
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
    typingIndicator.innerHTML = `<i>${data.name} está escribiendo...</i>`;
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

socket.on('chat', (data)=>{
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
    document.title = 'Mensaje nuevo';
}

window.addEventListener('focus', () => {
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