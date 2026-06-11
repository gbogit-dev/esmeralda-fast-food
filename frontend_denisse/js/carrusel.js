// Script para el carrusel de categorías rápidas
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // Cantidad de píxeles a desplazar en cada clic
    const scrollAmount = 220;

    // Función para desplazar a la izquierda
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            track.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
    }

    // Función para desplazar a la derecha
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            track.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
    }

    // Detectar si está al inicio o final para desactivar botones (opcional)
    function updateButtonStates() {
        if (!track) return;
        
        const isAtStart = track.scrollLeft === 0;
        const isAtEnd = track.scrollLeft >= (track.scrollWidth - track.clientWidth - 10);

        if (prevBtn) {
            prevBtn.style.opacity = isAtStart ? '0.5' : '1';
            prevBtn.style.pointerEvents = isAtStart ? 'none' : 'auto';
        }
        if (nextBtn) {
            nextBtn.style.opacity = isAtEnd ? '0.5' : '1';
            nextBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
        }
    }

    // Actualizar estado de botones al cargar
    updateButtonStates();

    // Actualizar estado al desplazarse
    track.addEventListener('scroll', updateButtonStates);
    window.addEventListener('resize', updateButtonStates);
});