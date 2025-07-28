const magnifier = document.querySelector('.magnifier');
let isDragging = false;
let offsetX = 0, offsetY = 0;

magnifier.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.offsetX;
  offsetY = e.offsetY;
  magnifier.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  magnifier.style.left = (e.clientX - offsetX) + 'px';
  magnifier.style.top = (e.clientY - offsetY) + 'px';
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  magnifier.style.cursor = 'grab';
});