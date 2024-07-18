const wrapper= document.querySelector('.cards')

const API= 'https://hp-api.onrender.com/api/characters'

fetch(API)
  .then(response => response.json())
  .then(data => {
    data.forEach(character => {
      tarjetas=`
      <li class="card">
                <div class="view front-view">
                    <img src="${character.image}"    alt="icon">
                </div>
                <div class="view back-view">
                    <img src="${character.image}" alt="card-img">
                </div>
            </li>
      `
      wrapper.innerHTML+=tarjetas
    });
  });

  const cards=document.querySelectorAll(".card");

let matched=0;
let cardOne, cardTwo;
let disableDeck=false;

function flipCard({target: clickedCard}){
    if(cardOne !== clickedCard && !disableDeck){
        clickedCard.classList.add("flip");
        if(!cardOne){
            return cardOne=clickedCard;
        }
        cardTwo =clickedCard;
        disableDeck=true;
        let cardOneimg= cardOne.querySelector(".back-view img").src,
        cardTwoimg=cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneimg, cardTwoimg);
        
    }
        
}

function matchCards(img1, img2){
    if(img1===img2){
        matched++;
        if(matched==8){
            setTimeout(()=> {
                return shuffleCard();
            }, 1000)
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }
    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);
    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1200);
}
function shuffleCard() {
    matched = 0;
    disableDeck = false;
    cardOne = cardTwo = "";
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);
    cards.forEach((card, i) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".back-view img");
        imgTag.src = `asets/images-${arr[i]}.png`;
        card.addEventListener("click", flipCard);
    });
}
shuffleCard();
    
cards.forEach(card => {
    card.addEventListener("click", flipCard);
});