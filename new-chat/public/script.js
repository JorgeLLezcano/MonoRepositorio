// let name= prompt('cuale es tu nombre? :')

let socket = io({
    'https://pruebaidx-chat.onrender.com',
    transports: ['websocket']  // Fuerza el uso de polling
  });

let myId = null;
  
const main=document.querySelector('main')
const from =document.querySelector('form')
const input=document.querySelector('input')
const mensaje=document.querySelector('ul')

socket.on('connect', () => {
    myId = socket.id;  // Almacena el ID del cliente actual
})
from.addEventListener('submit',(e)=>{
    e.preventDefault()
    if(input.value){
        socket.emit('chat', input.value)
        input.value=''
    }
})
socket.on('chat', (data)=>{
    const item=document.createElement('li')
    item.textContent=`ID: ${data.id===myId? name :'El otro'} - Mensaje: ${data.msg}`
    mensaje.appendChild(item)
    window.scrollTo(0, document.body.scrollHeight)

    if(data.id===myId){
        item.classList.add('enviado')
        item.classList.remove('recivido')
       
    }else{
        item.classList.add('recibido')
        item.classList.remove('enviado')
    }
})