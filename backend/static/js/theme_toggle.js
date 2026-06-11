document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.nav-sidebar .nav-link');
    
    links.forEach(link => {
        const p = link.querySelector('p');
        if (!p) return;
        
        const text = p.textContent.trim();
        
        if (text === 'Tema Claro' || text === 'Tema Oscuro') {
            link.addEventListener('click', function(e) {
                // Prevenir el comportamiento por defecto del link
                e.preventDefault(); 
                e.stopPropagation();
                
                if (text === 'Tema Claro') {
                    // Nuevo Jazzmin con Bootstrap 5
                    document.documentElement.setAttribute('data-bs-theme', 'light');
                    localStorage.setItem('jazzmin-theme-mode', 'light');
                    
                    // Antiguo Jazzmin
                    document.body.classList.remove('dark-mode');
                } 
                else if (text === 'Tema Oscuro') {
                    // Nuevo Jazzmin con Bootstrap 5
                    document.documentElement.setAttribute('data-bs-theme', 'dark');
                    localStorage.setItem('jazzmin-theme-mode', 'dark');
                    
                    // Antiguo Jazzmin
                    document.body.classList.add('dark-mode');
                }
            });
        }
    });
});
