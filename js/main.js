/* ===================================
   EL BUEN SABOR - PIQUETEADERO
   JavaScript Principal
   =================================== */

// ===== CONFIGURACIÓN GLOBAL =====
const CONFIG = {
    whatsappNumber: '573001234567', // CAMBIAR por el número real
    restaurantName: 'El Buen Sabor',
    deliveryFee: 3000,
    freeDeliveryMinimum: 35000,
    currency: 'COP'
};

// ===== ESTADO GLOBAL =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let isMenuOpen = false;
let isCartOpen = false;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🍗 El Buen Sabor - Iniciando...');
    
    initNavigation();
    initScrollEffects();
    initScrollReveal();
    initCart();
    initAddToCartButtons();
    initSmoothScroll();
    initLazyLoading();
    updateCartCount();
    
    console.log('✅ Sitio cargado correctamente');
});

// ===== NAVEGACIÓN MÓVIL =====
function initNavigation() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    const navLinks = document.querySelectorAll('.nav__menu a');
    const header = document.querySelector('.header');
    
    // Toggle menú móvil
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.style.overflow = isMenuOpen ? 'hidden' : '';
            
            // Animar hamburguesa
            const spans = navToggle.querySelectorAll('span');
            if (isMenuOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                isMenuOpen = false;
                document.body.style.overflow = '';
                
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });
    
    // Header con scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Agregar sombra al hacer scroll
        if (currentScroll > 10) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
        
        // Auto-hide en móviles al hacer scroll down
        if (window.innerWidth <= 768) {
            if (currentScroll > lastScroll && currentScroll > 500) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScroll = currentScroll;
    });
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    if (!revealElements.length) return;
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Opcional: dejar de observar después de revelar
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
}

// ===== EFECTOS DE SCROLL =====
function initScrollEffects() {
    // Parallax suave en hero
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }
    
    // Contador animado
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// Animar contador
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== LAZY LOADING DE IMÁGENES =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (!images.length) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('fade-in');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== CARRITO DE COMPRAS =====
function initCart() {
    const cartModal = document.getElementById('cartModal');
    const cartBtn = document.getElementById('cartBtn');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.querySelector('.cart-overlay');
    
    if (!cartModal) return;
    
    // Abrir carrito
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }
    
    // Cerrar carrito
    if (cartClose) {
        cartClose.addEventListener('click', closeCart);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }
    
    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isCartOpen) {
            closeCart();
        }
    });
}

function openCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.remove('hidden');
        isCartOpen = true;
        document.body.style.overflow = 'hidden';
        renderCart();
    }
}

function closeCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.add('hidden');
        isCartOpen = false;
        document.body.style.overflow = '';
    }
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartSummary = document.querySelector('.cart-summary');
    
    if (!cartItemsContainer) return;
    
    // Si el carrito está vacío
    if (cart.length === 0) {
        cartEmpty.classList.remove('hidden');
        cartSummary.classList.add('hidden');
        cartItemsContainer.innerHTML = '';
        return;
    }
    
    cartEmpty.classList.add('hidden');
    cartSummary.classList.remove('hidden');
    
    // Renderizar items
    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item" data-index="${index}">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">$${formatPrice(item.price)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    // Actualizar resumen
    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = subtotal >= CONFIG.freeDeliveryMinimum ? 0 : CONFIG.deliveryFee;
    const total = subtotal + deliveryFee;
    
    document.getElementById('cartSubtotal').textContent = `$${formatPrice(subtotal)}`;
    document.getElementById('cartDelivery').textContent = deliveryFee === 0 ? 'GRATIS' : `$${formatPrice(deliveryFee)}`;
    document.getElementById('cartTotal').textContent = `$${formatPrice(total)}`;
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// ===== AGREGAR AL CARRITO =====
function initAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('[data-add-to-cart]');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productData = {
                id: this.dataset.id,
                name: this.dataset.name,
                price: parseInt(this.dataset.price),
                image: this.dataset.image || 'assets/images/placeholder.jpg'
            };
            
            addToCart(productData);
        });
    });
}

function addToCart(product) {
    // Verificar si el producto ya existe
    const existingIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Guardar en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Actualizar UI
    updateCartCount();
    
    // Mostrar notificación
    showNotification(`✅ ${product.name} agregado al carrito`, 'success');
    
    // Animar botón
    const button = document.querySelector(`[data-id="${product.id}"]`);
    if (button) {
        button.classList.add('emphasis-pulse');
        setTimeout(() => button.classList.remove('emphasis-pulse'), 1000);
    }
}

function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        
        if (cart[index].quantity <= 0) {
            removeFromCart(index);
            return;
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }
}

function removeFromCart(index) {
    const item = cart[index];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    renderCart();
    updateCartCount();
    
    showNotification(`❌ ${item.name} eliminado del carrito`, 'info');
}

function clearCart() {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
        showNotification('🗑️ Carrito vaciado', 'info');
    }
}

// ===== ENVIAR PEDIDO POR WHATSAPP =====
function sendOrderWhatsApp() {
    if (cart.length === 0) {
        showNotification('⚠️ Tu carrito está vacío', 'warning');
        return;
    }
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = subtotal >= CONFIG.freeDeliveryMinimum ? 0 : CONFIG.deliveryFee;
    const total = subtotal + deliveryFee;
    
    // Construir mensaje
    let message = `🍗 *PEDIDO - ${CONFIG.restaurantName}*\n\n`;
    message += `📋 *Detalles del pedido:*\n`;
    
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   Cantidad: ${item.quantity}\n`;
        message += `   Precio: $${formatPrice(item.price * item.quantity)}\n\n`;
    });
    
    message += `💰 *Resumen:*\n`;
    message += `Subtotal: $${formatPrice(subtotal)}\n`;
    message += `Domicilio: ${deliveryFee === 0 ? 'GRATIS ✅' : '$' + formatPrice(deliveryFee)}\n`;
    message += `*Total: $${formatPrice(total)}*\n\n`;
    message += `📍 *Dirección de entrega:*\n_Por favor indica tu dirección_\n\n`;
    message += `⏰ Pedido realizado: ${new Date().toLocaleString('es-CO')}`;
    
    // Enviar a WhatsApp
    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Opcional: limpiar carrito después de enviar
    // clearCart();
    closeCart();
}

// ===== NOTIFICACIONES =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Estilos inline (agregar al CSS después)
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        max-width: 350px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== UTILIDADES =====
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== FORMULARIO NEWSLETTER =====
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                showNotification('✅ ¡Gracias por suscribirte!', 'success');
                this.reset();
            }
        });
    }
}

// Inicializar newsletter
document.addEventListener('DOMContentLoaded', initNewsletterForm);

// ===== EXPORTAR FUNCIONES GLOBALES =====
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.sendOrderWhatsApp = sendOrderWhatsApp;
window.showNotification = showNotification;

// ===== LOG DE DESARROLLO =====
console.log('📊 Estado inicial del carrito:', cart);
console.log('⚙️ Configuración:', CONFIG);