document.addEventListener('DOMContentLoaded', function() {
    // Forzar el tema claro de Bootstrap 5
    document.documentElement.setAttribute('data-bs-theme', 'light');
    
    // Remover las clases de modo oscuro del body si existen (para versiones antiguas de Jazzmin/AdminLTE)
    document.body.classList.remove('dark-mode');
    
    // Sobreescribir o limpiar la preferencia guardada en localStorage
    localStorage.setItem('jazzmin-theme-mode', 'light');
    
    // Seleccionar elementos que puedan haberse quedado atascados en dark mode
    const darkElements = document.querySelectorAll('.dark-mode');
    darkElements.forEach(el => el.classList.remove('dark-mode'));
});
