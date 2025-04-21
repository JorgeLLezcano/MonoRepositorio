const masterPoke=document.getElementById('master-poke')
const pika=document.getElementById('pika')
const pokeball=document.getElementById('pokeball')

let position= getComputedStyle(masterPoke)
let positionY= parseInt(position.top);
let positionX= parseInt(position.left);


function checkColittion(element1, element2){
  let rect1=element1.getBoundingClientRect();
  let rect2=element2.getBoundingClientRect();
  
   return !(
          rect1.top > rect2.bottom ||
          rect1.bottom < rect2.top ||
          rect1.left > rect2.right ||
          rect1.right < rect2.left
      );
  
  }
  //let ifColision=false
  function hadlerColision(){
    if(checkColittion(masterPoke,pika )){
  
    // masterPoke.style.backgroundColor='red'
    masterPoke.classList.add('colision')
  //ifColision= true
    setTimeout(()=>{
      // masterPoke.style.backgroundColor=''
      masterPoke.classList.remove('colision')
      //ifColision=false
    }, 1000)
  }
  }

window.addEventListener('keydown',(e)=>{
masterPoke.classList.remove('walk-front', 'walk-up', 'walk-left', 'walk-right');

masterPoke.classList.remove('face-front', 'face-up', 'face-left', 'face-right');
let rotation = '0deg';
  if(e.key==='ArrowDown'){
    positionY+=10
    masterPoke.classList.add('walk-front')
    masterPoke.classList.add('face-front');
  }else if(e.key==='ArrowUp'){

    positionY-=10
    masterPoke.classList.add('walk-up')
    rotation = '-90deg';
    masterPoke.classList.add('face-up');
  }else if(e.key==='ArrowLeft'){
    
    positionX-=10
    masterPoke.classList.add('walk-left')
    rotation = '-180deg';
    masterPoke.classList.add('face-left');
  }else if(e.key==='ArrowRight'){
    positionX+=10
    masterPoke.classList.add('walk-right')
    rotation = '90deg';
    masterPoke.classList.add('face-right');
  }

  masterPoke.style.top=`${positionY}px`;
  masterPoke.style.left=`${positionX}px`;

  pokeball.style.top=`${positionY}px`;
  pokeball.style.left=`${positionX}px`;

  pokeball.style.setProperty('--pokeball-rotation', rotation);
})

window.addEventListener('keyup', () => {
  masterPoke.classList.remove('walk-front', 'walk-up', 'walk-left', 'walk-right');

  // if (e.key === 'ArrowDown') {
  //   masterPoke.classList.add('face-front');
  // } else if (e.key === 'ArrowUp') {
  //   masterPoke.classList.add('face-up');
  // } else if (e.key === 'ArrowLeft') {
  //   masterPoke.classList.add('face-left');
  // } else if (e.key === 'ArrowRight') {
  //   masterPoke.classList.add('face-right');
  // }
});

let ballLaunched = false; // Nueva variable para controlar si la pokeball fue lanzada

function gameLoop() {
    hadlerColision();

    if (ballLaunched && checkColittion(pokeball, pika)) {
        console.log('¡Pokeball atrapó a Pika!');
        const finalTransform = getComputedStyle(pokeball).transform;
        pokeball.style.transform = finalTransform;
        pokeball.classList.add('open');
        ballLaunched = false; // Evita que se abra múltiples veces
    }

    requestAnimationFrame(gameLoop);
}

// Iniciar el bucle de juego
gameLoop();

pika.addEventListener('click', () => {
  pokeball.classList.remove('open')
  if (masterPoke.classList.contains('face-front')){
    pokeball.classList.add('launch');
  }else if(masterPoke.classList.contains('face-up')){
    pokeball.classList.add('launch-up');
  }else if(masterPoke.classList.contains('face-left')){
    pokeball.classList.add('launch-left');
  }else if(masterPoke.classList.contains('face-right')){
    pokeball.classList.add('launch-right');
  }
  
  
    
  
    ballLaunched = true; // Indica que la pokeball ha sido lanzada
   
    if(!ballLaunched){
     
      pokeball.classList.remove('open')
      pokeball.classList.add('launch');
     ;

    }
});

pokeball.addEventListener('click',()=>{
pokeball.classList.remove('launch', 'launch-up', 'launch-left', 'launch-right')
pokeball.classList.remove('open')
pokeball.style.transform = 'translate(0px, 0px)'
})
