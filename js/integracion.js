/* ===================================
   EL BUEN SABOR - INTEGRACIÓN
   Conecta el menú HTML con el carrito
   =================================== */

// ===== FUNCIÓN PARA AGREGAR AL CARRITO =====
function addToCart(name, price, image) {
    // Verificar que cartManager exista
    if (typeof cartManager === 'undefined') {
        console.error('cartManager no está inicializado');
        showNotification('❌ Error al agregar producto', 'error');
        return;
    }

    // FORZAR RUTA COMPLETA DE LA IMAGEN (esto soluciona el bug de imágenes en index.html)
    const fullImage = image && image.startsWith('assets/') 
        ? image 
        : `assets/images/productos/${image || 'placeholder.jpg'}`;

    // Crear objeto producto
    const product = {
        id: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        name: name.trim(),
        price: Number(price),
        image: fullImage
    };
    
    // Agregar al carrito
    cartManager.addItem(product);
}

// ===== SISTEMA DE FILTROS =====
document.addEventListener('DOMContentLoaded', function() {
    initFilters();
    initSearch(); // Asegura que la búsqueda funcione
});

function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');
    
    if (filterButtons.length === 0 || menuCards.length === 0) {
        console.log('Esperando elementos del menú...');
        return;
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            filterCards(category, menuCards);
        });
    });
    
    console.log('✅ Filtros inicializados');
}

function filterCards(category, cards) {
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            card.classList.add('fade-in-up');
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== BÚSQUEDA EN TIEMPO REAL =====
function initSearch() {
    const searchInput = document.getElementById('menuSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        const term = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.menu-card');
        
        cards.forEach(card => {
            const title = card.querySelector('.menu-card__title')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('.menu-card__description')?.textContent.toLowerCase() || '';
            
            if (title.includes(term) || desc.includes(term)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// ===== NOTIFICACIONES =====
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()">×</button>`;

    notification.style.cssText = `
        position: fixed; top: 100px; right: 20px; background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#f59e0b'};
        color: white; padding: 1rem 1.5rem; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 9999; display: flex; align-items: center; gap: 1rem; min-width: 300px; animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== OBSERVADOR DEL CARRITO =====
function setupCartObserver() {
    const interval = setInterval(() => {
        if (typeof cartManager !== 'undefined') {
            clearInterval(interval);
            updateCartBadge();
            window.addEventListener('storage', (e) => {
                if (e.key === 'elbuensabor_cart') updateCartBadge();
            });
            console.log('✅ Observador del carrito activado');
        }
    }, 100);
}

function updateCartBadge() {
    if (typeof cartManager === 'undefined') return;
    
    const counters = document.querySelectorAll('.cart-count, #cartCount');
    const total = cartManager.getTotalItems();
    
    counters.forEach(el => {
        if (el) {
            el.textContent = total;
            el.style.display = total > 0 ? 'flex' : 'none';
            if (total > 0) {
                el.classList.add('bounce-in');
                setTimeout(() => el.classList.remove('bounce-in'), 500);
            }
        }
    });
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Integración del menú iniciada');
    setTimeout(initFilters, 100);
    setupCartObserver();

    window.addToCart = addToCart;
    window.showNotification = showNotification;
    window.updateCartBadge = updateCartBadge;

    console.log('✅ Integración completada');
});