const miRango = document.getElementById('miRango');
const valorRango = document.getElementById('valorRango');

miRango.addEventListener('input', () => {
    valorRango.textContent = miRango.value;
});