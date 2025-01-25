const tiltEls = document.querySelectorAll('.tilt');

const tiltMove = (x, y) => `perspective(500px) scale(1.1) rotateX(${x}deg) rotateY(${y}deg)`;

tiltEls.forEach(tilt => {
    const height = tilt.clientHeight;
    const width = tilt.clientWidth;

    tilt.addEventListener('mousemove', (e) => {
        const x = e.layerX;
        const y = e.layerY;
        const multiplier = 50;

        const xRotate = multiplier * ((x - width / 2) / width);
        const yRotate = -multiplier * ((y - height / 2) / height);

        tilt.style.transform = tiltMove(xRotate, yRotate);
    });

    tilt.addEventListener('mouseout', () => {
        tilt.style.transform = tiltMove(0, 0);
    });
});


// const tiltEls = document.querySelectorAll('.tilt');

// const tiltMove = (x, y) => `perspective(500px) scale(1.1) rotateX(${x}deg) rotateY(${y}deg)`;

// tiltEls.forEach(tilt => {
//     const height = tilt.clientHeight;
//     const width = tilt.clientWidth;

//     tilt.addEventListener('mousemove', (e) => {
//         const x = e.layerX;
//         const y = e.layerY;
//         const multiplier = 50;

//         const xRotate = multiplier * ((x - width / 2) / width);
//         const yRotate = -multiplier * ((y - height / 2) / height);

//         tilt.style.transform = tiltMove(xRotate, yRotate);
//     });

//     tilt.addEventListener('mouseout', () => {
//         tilt.style.transform = tiltMove(0, 0);
//     });
// });









// const tiltEls = document.querySelectorAll('.tilt');

// const tiltMove = (x, y) => `perspective(500px) scale(1.1) rotateX(${x}deg) rotateY(${y}deg)`;

// const multiplier = 20; // ajusta este valor según sea necesario

// tiltEls.forEach(tilt => {
//   const height = tilt.clientHeight;
//   const width = tilt.clientWidth;

//   tilt.addEventListener('mousemove', e => {
//     const x = e.clientX - tilt.offsetLeft - width / 2;
//     const y = e.clientY - tilt.offsetTop - height / 2;

//     const xRotate = multiplier * (x / width);
//     const yRotate = -multiplier * (y / height);

//     tilt.style.transform = tiltMove(xRotate, yRotate);
//   });

//   tilt.addEventListener('mouseout', () => {
//     tilt.style.transform = tiltMove(0, 0);
//   });
// });