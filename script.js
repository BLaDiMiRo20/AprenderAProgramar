// script.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('Plataforma Interactiva lista');
    cargarSoluciones();
});

function guardarSolucion() {
    const problema = document.getElementById('problema').value;
    const solucion = document.getElementById('solucion').value;

    if (solucion.trim() === "") {
        alert("Por favor, describe tu solución.");
        return;
    }

    let soluciones = JSON.parse(localStorage.getItem('soluciones')) || [];
    soluciones.push({ problema, solucion });
    localStorage.setItem('soluciones', JSON.stringify(soluciones));

    alert("Solución guardada correctamente.");
    document.getElementById('solucionesForm').reset();
    cargarSoluciones();
}

function cargarSoluciones() {
    const retroalimentacionDiv = document.getElementById('retroalimentacion');
    retroalimentacionDiv.innerHTML = '<h3>Retroalimentación de Soluciones</h3><p>Aquí recibirás comentarios sobre las soluciones propuestas.</p>';

    let soluciones = JSON.parse(localStorage.getItem('soluciones')) || [];

    soluciones.forEach(sol => {
        const solDiv = document.createElement('div');
        solDiv.classList.add('solucion');

        const problemaP = document.createElement('p');
        problemaP.textContent = `Problema: ${sol.problema.replace('_', ' ')}`;

        const solucionP = document.createElement('p');
        solucionP.textContent = `Solución: ${sol.solucion}`;

        solDiv.appendChild(problemaP);
        solDiv.appendChild(solucionP);

        retroalimentacionDiv.appendChild(solDiv);
    });
}

function mostrarEjercicio() {
    const ejercicioDiv = document.getElementById('ejercicioInteractivo');
    if (ejercicioDiv.style.display === 'none') {
        ejercicioDiv.style.display = 'block';
    } else {
        ejercicioDiv.style.display = 'none';
    }
}
