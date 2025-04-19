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
  let ifColision=false
  function hadlerColision(){
    if(checkColittion(masterPoke,pika )){
  
    // masterPoke.style.backgroundColor='red'
    masterPoke.classList.add('colision')
  ifColision= true
    setTimeout(()=>{
      // masterPoke.style.backgroundColor=''
      masterPoke.classList.remove('colision')
      ifColision=false
    }, 1000)
  }
  }

window.addEventListener('keydown',(e)=>{
masterPoke.classList.remove('walk-front', 'walk-up', 'walk-left', 'walk-right');

masterPoke.classList.remove('face-front', 'face-up', 'face-left', 'face-right');
  if(e.key==='ArrowDown'){
    positionY+=10
    masterPoke.classList.add('walk-front')
    masterPoke.classList.add('face-front');
  }else if(e.key==='ArrowUp'){

    positionY-=10
    masterPoke.classList.add('walk-up')
    masterPoke.classList.add('face-up');
  }else if(e.key==='ArrowLeft'){
    
    positionX-=10
    masterPoke.classList.add('walk-left')
    masterPoke.classList.add('face-left');
  }else if(e.key==='ArrowRight'){
    positionX+=10
    masterPoke.classList.add('walk-right')
    masterPoke.classList.add('face-right');
  }

  masterPoke.style.top=`${positionY}px`;
  masterPoke.style.left=`${positionX}px`;

  pokeball.style.top=`${positionY}px`;
  pokeball.style.left=`${positionX}px`;

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

function gameLoop() {
  hadlerColision();
  requestAnimationFrame(gameLoop);
}

// Iniciar el bucle de juego
gameLoop()

pika.addEventListener('click',()=>{
  pokeball.classList.add('launch')
 if(checkColittion(pokeball,pika )){
console.log('colision')
  pokeball.classList.add('open')
 }
})