

let nextBtn=document.getElementById('next')
let prevBtn= document.getElementById('prev')

let  selected= document.querySelector('.selected')
let  next= document.querySelector('.next')
let  nextRightSecond=document.querySelector('.nextRightSecond')
let  hideRight=document.querySelector('.hideRight')

let prev=document.querySelector('.prev')
let prevLeftSecond=document.querySelector('.prevLeftSecond')
let hideLeft=document.querySelector('.hideLeft')


nextBtn.addEventListener('click', function(){

 if(selected.className==='selected'){
  selected.className='prev'
  prev.className='prevLeftSecond'
  prevLeftSecond.className='hideLeft'
 }else if(selected.className==='prev') {
   selected.className='prevLeftSecond'
   prev.className='hideLeft'
 }else{
  selected.className='hideLeft'
 }

 if(next.className==='next'){
  next.className='selected'
 }else if(next.className==='selected'){
  next.className='prev'
 }else{
  next.className='prevLeftSecond'
 }
 

if(nextRightSecond.className==='nextRightSecond' ){
  nextRightSecond.className='next'

}else{
  nextRightSecond.className='selected'
}
})

prevBtn.addEventListener('click',function(){

  if(selected.className==='selected'){
    selected.className='next'
    next.className='nextRightSecond'
    nextRightSecond.className='hideRight'
    prev.className='selected'
    prevLeftSecond.className='prev'
  }else if( selected.className==='next'){
    selected.className='nextRightSecond'
    next.className='hideRight'
    prev.className='next'
    prevLeftSecond.className='selected'
  }else{
    selected.className='hideRight'
    prev.className='hideRight'
  }
}
)