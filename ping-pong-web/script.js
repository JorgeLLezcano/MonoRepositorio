const table=document.getElementById('table')
const pad1=document.getElementById('pad1')
const pad2=document.getElementById('pad2')
const disk=document.getElementById('disk')
const point=document.getElementById('point')

const recTable=table.getBoundingClientRect()
const rectPad1=pad1.getBoundingClientRect()
const rectPad2=pad2.getBoundingClientRect()


let positionY=0;
let score=0


document.addEventListener('keydown',(e)=>{

if(e.key==='ArrowDown' && positionY < recTable.height - pad1.offsetHeight){
  positionY+=20
}else if(e.key==='ArrowUp' && positionY>0){
  positionY-=20
}
pad1.style.top=`${positionY}px`
pad2.style.top=`${positionY}px`
})

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

let x=0
let y=0

let velY=2
let velX=2

function moveDisk(){
   

   if (checkCollision(pad1, disk) || checkCollision(pad2, disk)) {
    velX = -velX;
    score+=1
     point.innerText='score: '+score
  }

 x += velX;
 y += velY;
if(x+disk.offsetWidth>recTable.width || x<0){
  velX=-velX
   score -= 1; // Resta un punto
        point.innerText = 'score: ' + score;
 }
 if(y+disk.offsetHeight>recTable.height||y <0){
  velY=-velY
  score -= 1; // Resta un punto
  point.innerText = 'score: ' + score;
 }


disk.style.top=`${y}px`
disk.style.left=`${x}px`

 requestAnimationFrame(moveDisk)


}
moveDisk()
