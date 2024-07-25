
//buttons
let nextBtn=document.getElementById('next')
let prevBtn= document.getElementById('prev')

//cards Right
let  selected= document.querySelector('.selected')

let  next= document.querySelector('.next')
let  nextRightSecond=document.querySelector('.nextRightSecond')
let  hideRight=document.querySelector('.hideRight')

// cards Left
let prev=document.querySelector('.prev')
let prevLeftSecond=document.querySelector('.prevLeftSecond')
let hideLeft=document.querySelector('.hideLeft')


nextBtn.addEventListener('click', function(){

 if(selected.className==='selected'){
  selected.className='prev'
  prev.className='prevLeftSecond'
  prevLeftSecond.className='hideLeft'
  next.className='selected'
  nextRightSecond.className='next'
 }else if(selected.className==='prev') {
   selected.className='prevLeftSecond'
   prev.className='hideLeft'
   next.className='prev'
   nextRightSecond.className='selected'
 }
//prev
if(prevLeftSecond.className==='selected'){
  prevLeftSecond.className='prev'
  prev.className='selected'
  selected.className='next'
  next.className='nextRightSecond'
  
}else if(prevLeftSecond.className==='prev'){
  prevLeftSecond.className='prevLeftSecond'
  prev.className='prev'
  selected.className='selected'
  next.className='next'
  nextRightSecond.className='nextRightSecond'
  
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
  }

  //next
  if(nextRightSecond.className==='selected'){
      nextRightSecond.className='next'
      next.className='selected'
      selected.className='prev'
      prev.className='prevLeftSecond'
      hideLeft.className='hideLeft'
  }else if(nextRightSecond.className==='next'){
    nextRightSecond.className='nextRightSecond'
    next.className='next'
    selected.className='selected'
    prev.className='prev'
    prevLeftSecond.className='prevLeftSecond'
  }
}
)
 
//touch card
selected.addEventListener('click', function(){
  nextRightSecond.className='nextRightSecond'
  next.className='next'
  selected.className='selected'
  prev.className='prev'
  prevLeftSecond.className='prevLeftSecond'
})

next.addEventListener('click',function(){
   nextRightSecond.className='next'
    next.className='selected'
    selected.className='prev'
    prev.className='prevLeftSecond'
    hideLeft.className='hideLeft'
    prevLeftSecond.className='hideLeft'
})

nextRightSecond.addEventListener('click', function(){
selected.className='prevLeftSecond'
 prev.className='hideLeft'
 next.className='prev'
 nextRightSecond.className='selected'
 prevLeftSecond.className='hideLeft'
})

prev.addEventListener('click',function(){
 prevLeftSecond.className='prev'
 prev.className='selected'
 selected.className='next'
 next.className='nextRightSecond'
 nextRightSecond.className='hideRight'
})

prevLeftSecond.addEventListener('click', function(){
prevLeftSecond.className='selected'
 selected.className='nextRightSecond'
 next.className='hideRight'
 prev.className='next'
 nextRightSecond.className='hideRight'
  
})