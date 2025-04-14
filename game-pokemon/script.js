const masterPoke=document.getElementById('master-poke')
let positionY=0;
let positionX=0
window.addEventListener('keydown',(e)=>{
masterPoke.classList.remove('walk-front', 'walk-up', 'walk-left', 'walk-right');
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
})

window.addEventListener('keyup', () => {
  masterPoke.classList.remove('walk-front', 'walk-up', 'walk-left', 'walk-right');

  if (e.key === 'ArrowDown') {
    masterPoke.classList.add('face-front');
  } else if (e.key === 'ArrowUp') {
    masterPoke.classList.add('face-up');
  } else if (e.key === 'ArrowLeft') {
    masterPoke.classList.add('face-left');
  } else if (e.key === 'ArrowRight') {
    masterPoke.classList.add('face-right');
  }
});