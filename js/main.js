document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.onerror = function() {
            if (img.src.includes('hero.jpg')) {
                img.src = '/';
            } else if (img.src.includes('category')) {
                img.src = '/';
            } else if (img.src.includes('product')) {
                img.src = '/';
            } else if (img.src.includes('cart.svg')) {
                this.outerHTML = '<span style="font-size: 1.2rem;">🛒</span>';
            }
        };
    });
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent && heroContent.querySelector('h2')) {
            heroContent.querySelector('h2').textContent = `¡Bienvenido de nuevo, ${currentUser.name}!`;
        }
    }
});