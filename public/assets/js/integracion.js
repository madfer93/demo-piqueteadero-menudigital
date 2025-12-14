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
    
    // Crear objeto producto
    const product = {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        price: price,
        image: image || 'assets/images/placeholder.jpg'
    };
    
    // Agregar al carrito
    cartManager.addItem(product);
}

// ===== SISTEMA DE FILTROS =====
document.addEventListener('DOMContentLoaded', function() {
    initFilters();
});

function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');
    
    if (filterButtons.length === 0 || menuCards.length === 0) {
        console.log('Esperando que se carguen los elementos del menú...');
        return;
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Actualizar botón activo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar tarjetas
            filterCards(category, menuCards);
        });
    });
    
    console.log('✅ Sistema de filtros inicializado');
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
    
    // Scroll suave a la sección del menú
    const menuSection = document.querySelector('.menu-section');
    if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===== SISTEMA DE NOTIFICACIONES =====
function showNotification(message, type = 'info') {
    // Remover notificación existente
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Agregar estilos si no existen
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: #fff;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 1rem;
                animation: slideInRight 0.3s ease;
                border-left: 4px solid #10b981;
                min-width: 300px;
                max-width: 400px;
            }
            
            .notification--success {
                border-left-color: #10b981;
            }
            
            .notification--error {
                border-left-color: #ef4444;
            }
            
            .notification--warning {
                border-left-color: #f59e0b;
            }
            
            .notification--info {
                border-left-color: #3b82f6;
            }
            
            .notification span {
                flex: 1;
                color: #2d3748;
                font-weight: 500;
            }
            
            .notification button {
                background: none;
                border: none;
                font-size: 1.5rem;
                color: #94a3b8;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s;
            }
            
            .notification button:hover {
                background: #f1f5f9;
                color: #475569;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 768px) {
                .notification {
                    top: 80px;
                    right: 10px;
                    left: 10px;
                    min-width: auto;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Auto-remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== ACTUALIZAR CONTADOR DEL CARRITO =====
// Observar cambios en el carrito
function setupCartObserver() {
    // Esperar a que cartManager esté disponible
    const checkInterval = setInterval(() => {
        if (typeof cartManager !== 'undefined') {
            clearInterval(checkInterval);
            
            // Actualizar contador inicial
            updateCartBadge();
            
            // Observar cambios en localStorage
            window.addEventListener('storage', function(e) {
                if (e.key === 'elbuensabor_cart') {
                    updateCartBadge();
                }
            });
            
            console.log('✅ Observador del carrito inicializado');
        }
    }, 100);
    
    // Timeout de seguridad (10 segundos)
    setTimeout(() => clearInterval(checkInterval), 10000);
}

function updateCartBadge() {
    if (typeof cartManager === 'undefined') return;
    
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cartManager.getTotalItems();
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        
        // Animación
        if (totalItems > 0) {
            cartCount.classList.add('bounce-in');
            setTimeout(() => cartCount.classList.remove('bounce-in'), 500);
        }
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando integración del menú...');
    
    // Inicializar filtros
    setTimeout(initFilters, 100);
    
    // Configurar observador del carrito
    setupCartObserver();
    
    // Exponer funciones globalmente
    window.addToCart = addToCart;
    window.showNotification = showNotification;
    window.updateCartBadge = updateCartBadge;
    
    console.log('✅ Integración del menú completada');
});

// ===== BÚSQUEDA EN TIEMPO REAL (Opcional) =====
function initSearch() {
    const searchInput = document.getElementById('menuSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const menuCards = document.querySelectorAll('.menu-card');
        
        menuCards.forEach(card => {
            const title = card.querySelector('.menu-card__title').textContent.toLowerCase();
            const description = card.querySelector('.menu-card__description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Inicializar búsqueda si existe el input
document.addEventListener('DOMContentLoaded', initSearch);