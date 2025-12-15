/* ===================================
   EL BUEN SABOR - CARRITO AVANZADO
   Gestión completa del carrito
   =================================== */

// ===== CLASE CARRITO =====
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.deliveryFee = 3000;
        this.freeDeliveryMinimum = 35000;
        this.taxRate = 0; // Colombia no aplica IVA en restaurantes, ajustar si necesario
    }
    
    // Cargar carrito desde localStorage
    loadCart() {
        try {
            const saved = localStorage.getItem('elbuensabor_cart');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error cargando carrito:', error);
            return [];
        }
    }
    
    // Guardar carrito en localStorage
    saveCart() {
        try {
            localStorage.setItem('elbuensabor_cart', JSON.stringify(this.items));
            this.updateUI();
        } catch (error) {
            console.error('Error guardando carrito:', error);
        }
    }
    
    // Agregar producto
    addItem(product) {
        const existingIndex = this.items.findIndex(item => item.id === product.id);
        
        if (existingIndex > -1) {
            this.items[existingIndex].quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image || 'assets/images/placeholder.jpg',
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCart();
        this.showNotification(`✅ ${product.name} agregado`, 'success');
        this.animateCartButton();
        
        return true;
    }
    
    // Remover producto
    removeItem(index) {
        if (this.items[index]) {
            const item = this.items[index];
            this.items.splice(index, 1);
            this.saveCart();
            this.showNotification(`❌ ${item.name} eliminado`, 'info');
            return true;
        }
        return false;
    }
    
    // Actualizar cantidad
    updateQuantity(index, change) {
        if (this.items[index]) {
            this.items[index].quantity += change;
            
            if (this.items[index].quantity <= 0) {
                return this.removeItem(index);
            }
            
            this.saveCart();
            return true;
        }
        return false;
    }
    
    // Establecer cantidad directa
    setQuantity(index, quantity) {
        if (this.items[index] && quantity > 0) {
            this.items[index].quantity = quantity;
            this.saveCart();
            return true;
        }
        return false;
    }
    
    // Vaciar carrito
    clear() {
        this.items = [];
        this.saveCart();
        this.showNotification('🗑️ Carrito vaciado', 'info');
    }
    
    // Obtener total de items
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }
    
    // Calcular subtotal
    getSubtotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    
    // Calcular costo de envío
    getDeliveryFee() {
        const subtotal = this.getSubtotal();
        return subtotal >= this.freeDeliveryMinimum ? 0 : this.deliveryFee;
    }
    
    // Calcular impuestos (si aplica)
    getTax() {
        return Math.round(this.getSubtotal() * this.taxRate);
    }
    
    // Calcular total
    getTotal() {
        return this.getSubtotal() + this.getDeliveryFee() + this.getTax();
    }
    
    // Verificar si hay envío gratis
    hasFreeDelivery() {
        return this.getSubtotal() >= this.freeDeliveryMinimum;
    }
    
    // Calcular cuánto falta para envío gratis
    getAmountForFreeDelivery() {
        const subtotal = this.getSubtotal();
        if (subtotal >= this.freeDeliveryMinimum) return 0;
        return this.freeDeliveryMinimum - subtotal;
    }
    
    // Obtener porcentaje para envío gratis
    getFreeDeliveryProgress() {
        const subtotal = this.getSubtotal();
        const percentage = (subtotal / this.freeDeliveryMinimum) * 100;
        return Math.min(percentage, 100);
    }
    
    // Actualizar UI
    updateUI() {
        this.updateCartCount();
        this.renderCartItems();
        this.updateCartSummary();
        this.updateFreeDeliveryProgress();
    }
    
    // Actualizar contador del carrito
    updateCartCount() {
        // Buscar por clase (carrito sidebar)
        const cartCount = document.querySelector('.cart-count');
        // Buscar por ID (header)
        const cartCountById = document.getElementById('cartCount');
        
        const totalItems = this.getTotalItems();
        
        // Actualizar ambos contadores si existen
        [cartCount, cartCountById].forEach(element => {
            if (element) {
                element.textContent = totalItems;
                element.style.display = totalItems > 0 ? 'flex' : 'none';
                
                // Animación
                element.classList.add('bounce-in');
                setTimeout(() => element.classList.remove('bounce-in'), 500);
            }
        });
    }
    
    // Renderizar items del carrito
    renderCartItems() {
        const container = document.getElementById('cartItems');
        const emptyState = document.getElementById('cartEmpty');
        
        if (!container) return;
        
        if (this.items.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }
        
        if (emptyState) emptyState.classList.add('hidden');
        
        container.innerHTML = this.items.map((item, index) => `
            <div class="cart-item slide-in-down" data-index="${index}">
                <div class="cart-item-image">
                    <img src="${item.image.startsWith('http') ? item.image : './' + item.image}" 
                    alt="${item.name}" 
                    onerror="this.src='assets/images/placeholder.jpg'; this.onerror=null;">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">$${this.formatPrice(item.price)}</p>
                    <p class="cart-item-subtotal">Subtotal: $${this.formatPrice(item.price * item.quantity)}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="qty-btn qty-minus" onclick="cartManager.updateQuantity(${index}, -1)" title="Disminuir cantidad">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="qty-input" value="${item.quantity}" 
                               min="1" max="99" 
                               onchange="cartManager.setQuantity(${index}, parseInt(this.value))"
                               onclick="this.select()">
                        <button class="qty-btn qty-plus" onclick="cartManager.updateQuantity(${index}, 1)" title="Aumentar cantidad">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="btn-remove" onclick="cartManager.removeItem(${index})" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Actualizar resumen
    updateCartSummary() {
        const subtotal = this.getSubtotal();
        const deliveryFee = this.getDeliveryFee();
        const tax = this.getTax();
        const total = this.getTotal();
        
        // Actualizar elementos
        this.updateElement('cartSubtotal', `$${this.formatPrice(subtotal)}`);
        
        const deliveryElement = document.getElementById('cartDelivery');
        if (deliveryElement) {
            if (deliveryFee === 0) {
                deliveryElement.innerHTML = '<span style="color: var(--accent); font-weight: 700;">GRATIS ✅</span>';
            } else {
                deliveryElement.textContent = `$${this.formatPrice(deliveryFee)}`;
            }
        }
        
        if (tax > 0) {
            this.updateElement('cartTax', `$${this.formatPrice(tax)}`);
        }
        
        this.updateElement('cartTotal', `$${this.formatPrice(total)}`);
    }
    
    // Actualizar progreso de envío gratis
    updateFreeDeliveryProgress() {
        const progressBar = document.getElementById('freeDeliveryProgress');
        const progressText = document.getElementById('freeDeliveryText');
        
        if (!progressBar || !progressText) return;
        
        const amountNeeded = this.getAmountForFreeDelivery();
        const progress = this.getFreeDeliveryProgress();
        
        progressBar.style.width = `${progress}%`;
        
        if (amountNeeded > 0) {
            progressText.textContent = `¡Agrega $${this.formatPrice(amountNeeded)} más para envío GRATIS! 🚚`;
            progressText.style.color = 'var(--secondary)';
        } else {
            progressText.textContent = '¡Tienes envío GRATIS! 🎉';
            progressText.style.color = 'var(--accent)';
            progressBar.classList.add('pulse');
        }
    }
    
    // Generar mensaje para WhatsApp
    generateWhatsAppMessage() {
        const subtotal = this.getSubtotal();
        const deliveryFee = this.getDeliveryFee();
        const total = this.getTotal();
        const timestamp = new Date().toLocaleString('es-CO', {
            dateStyle: 'full',
            timeStyle: 'short'
        });
        
        let message = `🍗 *PEDIDO - EL BUEN SABOR*\n`;
        message += `━━━━━━━━━━━━━━━━━━━\n\n`;
        message += `📋 *DETALLES DEL PEDIDO:*\n\n`;
        
        this.items.forEach((item, index) => {
            message += `${index + 1}. *${item.name}*\n`;
            message += `   • Cantidad: ${item.quantity}\n`;
            message += `   • Precio unitario: $${this.formatPrice(item.price)}\n`;
            message += `   • Subtotal: $${this.formatPrice(item.price * item.quantity)}\n\n`;
        });
        
        message += `━━━━━━━━━━━━━━━━━━━\n\n`;
        message += `💰 *RESUMEN DE COMPRA:*\n\n`;
        message += `Subtotal: $${this.formatPrice(subtotal)}\n`;
        message += `Domicilio: ${deliveryFee === 0 ? '✅ GRATIS' : '$' + this.formatPrice(deliveryFee)}\n`;
        message += `*TOTAL: $${this.formatPrice(total)}*\n\n`;
        message += `━━━━━━━━━━━━━━━━━━━\n\n`;
        message += `📍 *INFORMACIÓN DE ENTREGA:*\n`;
        message += `_Por favor indica tu dirección completa y datos de contacto_\n\n`;
        message += `⏰ Pedido generado: ${timestamp}\n\n`;
        message += `¡Gracias por tu preferencia! 😊`;
        
        return message;
    }
    
    // Enviar pedido por WhatsApp
    sendToWhatsApp() {
        if (this.items.length === 0) {
            this.showNotification('⚠️ Tu carrito está vacío', 'warning');
            return false;
        }
        
        const message = this.generateWhatsAppMessage();
        const whatsappNumber = '573001234567'; // CAMBIAR por número real
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(url, '_blank');
        
        // Opcional: vaciar carrito después de enviar
        // this.clear();
        
        this.showNotification('📱 Redirigiendo a WhatsApp...', 'success');
        return true;
    }
    
    // Helpers
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) element.textContent = content;
    }
    
    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    
    animateCartButton() {
        const cartBtn = document.getElementById('btnCart');
        if (cartBtn) {
            cartBtn.classList.add('pulse');
            setTimeout(() => cartBtn.classList.remove('pulse'), 500);
        }
    }
    
    showNotification(message, type = 'info') {
        // Usar la función global de notificaciones
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }
    
    // Exportar carrito a JSON (para debugging)
    export() {
        return JSON.stringify({
            items: this.items,
            summary: {
                totalItems: this.getTotalItems(),
                subtotal: this.getSubtotal(),
                deliveryFee: this.getDeliveryFee(),
                total: this.getTotal()
            },
            timestamp: new Date().toISOString()
        }, null, 2);
    }
    
    // Importar carrito desde JSON
    import(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            this.items = data.items || [];
            this.saveCart();
            return true;
        } catch (error) {
            console.error('Error importando carrito:', error);
            return false;
        }
    }
}

// ===== INICIALIZAR CARRITO =====
let cartManager;

document.addEventListener('DOMContentLoaded', function() {
    cartManager = new ShoppingCart();
    cartManager.updateUI();
    
    console.log('🛒 Carrito inicializado:', cartManager.getTotalItems(), 'items');
});

// ===== EXPORTAR GLOBALMENTE =====
window.cartManager = cartManager;        // ← ESTA LÍNEA ES CRUCIAL
window.ShoppingCart = ShoppingCart;