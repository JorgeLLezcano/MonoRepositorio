let name= prompt('cuale es tu nombre? :')
if(!name){
     prompt('cuale es tu nombre? :')
  
}
let socket = io({
    // 'https://pruebaidx-chat.onrender.com',
    transports: ['polling']  // Fuerza el uso de polling
  });

let myId = null;
  
const main=document.querySelector('main')
const from =document.querySelector('form')
const input=document.querySelector('input')
const mensaje=document.querySelector('ul')
const messagesContainer = document.getElementById('messages');
   
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


socket.on('chat', (data)=>{
    const item=document.createElement('li')
    const chat=`
<strong>${data.id===myId? 'Tu' :data.name}</strong>: <p>${data.msg}</p>`

item.innerHTML+=chat
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