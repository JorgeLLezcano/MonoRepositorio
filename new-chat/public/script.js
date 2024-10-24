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
    // 'https://pruebaidx-chat.onrender.com',
    transports: ['polling']  // Fuerza el uso de polling
  });

let myId = null;

const header=document.querySelector('header')
const main=document.querySelector('main')
const from =document.querySelector('form')
const input=document.querySelector('input')
const mensaje=document.querySelector('ul')
const messagesContainer = document.getElementById('messages');
const sent=document.querySelector('.sent')
const received=document.querySelector('.received')

   
socket.on('connect', () => {
    myId = socket.id;  // Almacena el ID del cliente actual
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

    const userConected=document.createElement('div')
    userConected.innerHTML=`${data.name}  esta conectado`
    header.appendChild(userConected)


    const item = document.createElement('li');
    item.classList.add('itemConected'); 
    const itemConected=document.querySelector('.itemConected')
    mensaje.appendChild(item);
    if(data.id !== myId){
        itemConected.innerHTML = `<strong>${data.name}</strong> se ha conectado.`;
    
    window.addEventListener('focus', () => {
        setTimeout(() => {
            document.title = 'chat';
            mensaje.removeChild(itemConected);
        }, 5000);
     }
 );
   
    }
});

socket.on('chat', (data)=>{
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
    // item.textContent=`ID: ${data.id===myId? name :data.name} - Mensaje: ${data.msg}`
    mensaje.appendChild(item)
    // window.scrollTo(0, document.body.scrollHeight)
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
    if(data.id===myId){
        item.classList.add('enviado')
        item.classList.remove('recivido')
       
    }else{
        item.classList.add('recibido')
        item.classList.remove('enviado')
        
    }
})