let positionX=0;
let positionY=0;
const mario=document.getElementById('sprite')
let timeoutId=null;
let anteriorY=null
let anteriorX=null
let direccion='derecha'

window.addEventListener('mousemove',(e)=>{
positionX=e.clientX-20
positionY=e.clientY-20 




    mario.style.left=`${positionX}px`
     
    mario.style.top=`${positionY}px`

    mario.classList.add('walk')

    clearTimeout(timeoutId)
    
    timeoutId=setTimeout(()=>{
     mario.classList.remove('walk')
    }, 500)

    if(anteriorX !==null && anteriorY !==null){
        const dx= positionX-anteriorX;
        const dy= positionY-anteriorY;

        if (dy > 0) {
            mario.style.transform = 'rotateY(0deg)';
            direccion = 'derecha';  // ✅ CORREGIDO
        } else if (dx < 0) {
            mario.style.transform = 'rotateY(180deg)';
            direccion = 'izquierda'; // ✅ CORREGIDO
        }
    }
    anteriorX=positionX
    anteriorY=positionY
})

 window.addEventListener('mouseout',()=>{
   mario.classList.remove('walk')
})


window.addEventListener('keydown',(event)=>{

    switch (event.key) {
    case 'ArrowUp':
      positionY -= 10;
            
      break;
    case 'ArrowDown':
      positionY += 10;
         
      break;
    case 'ArrowLeft':
      positionX -= 10;
      mario.style.transform = 'rotateY(180deg)';
       direccion = 'izquierda';    
           
      break;
    case 'ArrowRight':
      positionX += 10;
      mario.style.transform = 'rotateY(0deg)';
             direccion = 'derecha'; 
      break;
      case ' ':
      mario.classList.remove('walk')        
      
                  // USA LA DIRECCIÓN GUARDADA 'rotateY(180deg)' 'rotateY(0deg)'
            if (direccion === 'izquierda') {
                mario.style.transform = 'scale(-1 1)';
            } else {
                mario.style.transform = 'scale(1 1)' ;
            }
         mario.classList.add('jump')
      break

  }
    
  mario.classList.add('walk')
  mario.style.left = `${positionX}px`;
  mario.style.top = `${positionY}px`;
})

window.addEventListener('keyup', ()=>{
   mario.classList.remove('jump')
   mario.classList.remove('walk')

})
let header=document.querySelector('header')
let p=document.createElement('p')

header.appendChild(p)
const maxGoombas = 5;
const goombas = []; // Almacena los Goombas
let points=0;
function crearGoomba() {
    if (goombas.length >= maxGoombas) return;

    const goomba = document.createElement("div");
    goomba.classList.add("goomba"); // Aplica el CSS
    document.body.appendChild(goomba);
    //ataque a goombas
    goomba.addEventListener('click', () => {
        points+=10
let contador= document.createElement('div')
contador.innerText=`${points}`
contador.classList.add('points')

goomba.appendChild(contador)

p.innerText=`Puntos: ${points}`
p.classList.add('points')
//let puntos=`<p>Puntos: ${points}</p>`
//header.innerHTML=puntos
       //goomba.classList.remove('goomba')
        goomba.classList.add('dead')
        //goomba.style.backgroundPosition='91px  0px ';

  
        setTimeout(() => {
            goomba.style.display = 'none';
        },1000);
        
    });
    // Posiciona al Goomba en un borde aleatorio
    let side = Math.floor(Math.random() * 4); // 0=arriba, 1=abajo, 2=izquierda, 3=derecha
    let x, y;
console.log(side)
    switch (side) {
        case 0: // Arriba
            x = Math.random() * window.innerWidth;
            y = -50;
            console.log(x)
            break;
        case 1: // Abajo
            x = Math.random() * window.innerWidth;
            y = window.innerHeight + 50;
            break;
        case 2: // Izquierda
            x = -50;
            y = Math.random() * window.innerHeight;
            break;
        case 3: // Derecha
            x = window.innerWidth + 50;
            y = Math.random() * window.innerHeight;
            break;
    }

    goomba.style.left = `${x}px`;
    goomba.style.top = `${y}px`;
      

    // Velocidad y dirección aleatoria
    let speed = 2; // Velocidad constante
    let angle = Math.random() * 2 * Math.PI; // Ángulo aleatorio (0 - 360°)
    let dx = Math.cos(angle) * speed;
    let dy = Math.sin(angle) * speed;

    function moverGoomba() {
        x += dx;
        y += dy;

        goomba.style.left = `${x}px`;
        goomba.style.top = `${y}px`;



// Verificar colisión con Mario
        if (checkCollision(mario, goomba)) {
          //mario.style.mixBlendMode='difference';
           // mario.style.background = "red";
            // mario.classList.remove('walk')
             mario.classList.add('colicion');
            //  void mario.offsetWidth;
            // mario.classList.add('colicion');
            setTimeout(() => {
              //mario.style.mixBlendMode='';
              mario.classList.remove('colicion');// Restaurar color
              // mario.classList.remove('colicion');
            }, 500);
        }
        // Si sale de la pantalla, lo reubica en un borde aleatorio
        if (x < -50 || x > window.innerWidth + 50 || y < -50 || y > window.innerHeight + 50) {
            document.body.removeChild(goomba);
            goombas.splice(goombas.indexOf(goomba), 1);
            crearGoomba(); // Crea un nuevo Goomba
            return;
        }

        requestAnimationFrame(moverGoomba);
    }

    goombas.push(goomba);
    moverGoomba();
}

// Función para detectar colisiones
function checkCollision(obj1, obj2) {
    let rect1 = obj1.getBoundingClientRect();
    let rect2 = obj2.getBoundingClientRect();

    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right ||
        rect1.right < rect2.left
    );
}

// Crear 100 Goombas
for (let i = 0; i < maxGoombas; i++) {
    setTimeout(crearGoomba, i * 500); // Se crean progresivamente
}


