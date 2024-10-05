let socket=io()

const from =document.querySelector('form')
const input=document.querySelector('input')
const mensaje=document.querySelector('ul')
from.addEventListener('submit',(e)=>{
    e.preventDefault()
    if(input.value){
        socket.emit('chat', input.value)
        input.value=''
    }
})

socket.on('chat', (data)=>{
    const item=document.createElement('li')
    item.textContent=`ID: ${data.id} - Mensaje: ${data.msg}`
    mensaje.appendChild(item)
    window.scrollTo(0, document.body.scrollHeight)
})