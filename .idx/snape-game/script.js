const cubo = document.getElementById('cubo');
let positionY = 0;
let positionX = 0;
let histoyPosition=[]
const historySize = 5;
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    positionY += 10;
    cubo.classList.add('spin');
  } else if (e.key === 'ArrowUp') {
    positionY -= 10;
    cubo.classList.add('spin-rigth');
  } else if (e.key === 'ArrowLeft') {
    positionX -= 10;
    cubo.classList.add('spin');
  } else if (e.key === 'ArrowRight') {
    positionX += 10;
    cubo.classList.add('spin-rigth');
  }

  cubo.style.top = `${positionY}px`;
  cubo.style.left = `${positionX}px`;

 histoyPosition.push({ x: positionX, y: positionY })

colission();
  follwerCube()
  //createCuboRandom();

//maintainRandomCubeCount() 
});
document.addEventListener('keyup',()=>{
    cubo.classList.remove('spin', 'spin-rigth')
})
const max = 5;
const cubos = [];

function createCuboRandom() {
  //if (cubos.length >= max) return;

  const cuboRandom = document.createElement('div');
  cuboRandom.classList.add('cubo-random');
  cuboRandom.style.top = `${Math.random() * (innerHeight - 50)}px`;
  cuboRandom.style.left = `${Math.random()* (innerWidth - 50)}px`;

  document.body.appendChild(cuboRandom);
  cubos.push(cuboRandom);
}
for (let i = 0; i < max; i++) {
    createCuboRandom();
}

function checkCollision(obj1, obj2) {
    const rect1 = obj1.getBoundingClientRect();
    const rect2 = obj2.getBoundingClientRect();

    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right ||
        rect1.right < rect2.left
    );
}
const followerRdm
=[]
function colission() {

  cubos.forEach((cube) => {

    if (checkCollision(cubo, cube) && !cube. 
      classList.contains('follower')) {
      console.log('colision');
      cube.classList.remove('cubo-random');
      cube.classList.add('follower');
      followerRdm.push(cube)
      createCuboRandom()
    }
  });

  
}


function colissionFollow(){
  followerRdm.forEach((follow)=>{
if(checkCollision(cubo, follow)){
  
}

  })
}


function follwerCube(){
followerRdm.forEach((follow, index)=>{
let indexHistory= histoyPosition.length -1-(index+1)*historySize
if (indexHistory >= 0) {
   follow.style.top=`${histoyPosition[indexHistory].y}px`
   follow.style.left=`${histoyPosition[indexHistory].x}px`
   colissionFollow()
}
})

}


