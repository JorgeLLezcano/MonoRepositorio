const personaje = document.getElementById('personaje');
const gameArea = document.getElementById('game-area');

let personajeX = 0; // Posición X del personaje en el mundo del juego
let personajeY = 0; // Posición Y del personaje en el mundo del juego
const velocidad = 10; // Velocidad de movimiento

document.addEventListener('keydown', (e) => {
 

    if (e.key === 'ArrowDown') {
        personajeY += velocidad;
        personaje.classList.add('walk-front')
    } else if (e.key === 'ArrowUp') {
        personajeY -= velocidad;
        personaje.classList.add('walk-up')
    } else if (e.key === 'ArrowLeft') {
        personajeX -= velocidad;
        personaje.classList.add('walk-left')
    } else if (e.key === 'ArrowRight') {
        personajeX += velocidad;
         personaje.classList.add('walk-right')
    }
// document.addEventListener('keyup',()=>{
//   personaje.classList.remove('walk-up','walk-down', 'walk-left', 'walk-right')
// })
document.addEventListener('keyup', () => {
personaje.classList.remove('walk-front', 'walk-up', 'walk-left', 'walk-right');


});
    // Aquí no actualizamos la posición del personaje directamente.  El personaje *SIEMPRE* está en el centro.
    // En cambio, movemos el "mundo" del juego (gameArea) alrededor de él.

    const centroX = window.innerWidth / 2;
    const centroY = window.innerHeight / 2;

    gameArea.style.transform = `translate(${-personajeX + centroX - 25}px, ${-personajeY + centroY - 25}px)`;
    //25 es la mitad del ancho y alto del personaje
});