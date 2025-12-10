/* ===================================
   EL BUEN SABOR - GESTIÓN DE MENÚ
   Sistema de filtros, búsqueda y productos
   =================================== */

// ===== DATOS DE PRODUCTOS =====
const PRODUCTS_DATABASE = {
    porciones: [
        {
            id: 'pollo-broaster',
            name: 'Pollo Broaster Crujiente',
            category: 'porciones',
            price: 38000,
            description: 'Nuestro clásico desde 1998. Pollo marinado 24 horas con receta secreta de 11 especias.',
            image: 'assets/images/pollo-broaster.jpg',
            badges: ['hot', 'popular'],
            rating: 4.9,
            reviews: 856,
            preparationTime: 25,
            calories: 450,
            ingredients: ['Pollo', 'Especias secretas', 'Papas criollas', 'Ensalada'],
            allergens: ['Gluten'],
            available: true,
            featured: true
        },
        {
            id: 'pechuga-apanada',
            name: 'Pechuga Apanada',
            category: 'porciones',
            price: 32000,
            description: 'Pechuga de pollo empanizada al estilo casero con papas francesas y ensalada.',
            image: 'assets/images/pechuga-apanada.jpg',
            badges: [],
            rating: 4.7,
            reviews: 623,
            preparationTime: 20,
            calories: 380,
            ingredients: ['Pechuga de pollo', 'Pan rallado', 'Papas', 'Ensalada'],
            allergens: ['Gluten', 'Huevo'],
            available: true,
            featured: false
        },
        {
            id: 'picada-mixta',
            name: 'Picada Mixta',
            category: 'porciones',
            price: 45000,
            description: 'Para compartir (2-3 personas). Pollo, carne de res, chorizo, papa criolla y plátano.',
            image: 'assets/images/picada-mixta.jpg',
            badges: ['new'],
            rating: 4.8,
            reviews: 412,
            preparationTime: 30,
            calories: 850,
            ingredients: ['Pollo', 'Carne de res', 'Chorizo', 'Papa criolla', 'Plátano'],
            allergens: [],
            available: true,
            featured: true
        },
        {
            id: 'costillas-bbq',
            name: 'Costillas BBQ',
            category: 'porciones',
            price: 42000,
            description: 'Costillas de cerdo bañadas en salsa BBQ casera, acompañadas de yuca frita.',
            image: 'assets/images/costillas-bbq.jpg',
            badges: ['hot'],
            rating: 4.9,
            reviews: 721,
            preparationTime: 35,
            calories: 620,
            ingredients: ['Costillas de cerdo', 'Salsa BBQ', 'Yuca', 'Ensalada'],
            allergens: [],
            available: true,
            featured: true
        },
        {
            id: 'alitas-picantes',
            name: 'Alitas Picantes',
            category: 'porciones',
            price: 28000,
            description: '12 alitas de pollo con salsa picante, acompañadas de papas criollas.',
            image: 'assets/images/alitas-picantes.jpg',
            badges: ['hot'],
            rating: 4.6,
            reviews: 534,
            preparationTime: 20,
            calories: 420,
            ingredients: ['Alitas de pollo', 'Salsa picante', 'Papas criollas'],
            allergens: [],
            available: true,
            featured: false
        },
        {
            id: 'hamburguesa-artesanal',
            name: 'Hamburguesa Artesanal',
            category: 'porciones',
            price: 24000,
            description: 'Carne 100% res, queso cheddar, tocineta, lechuga, tomate y salsas especiales.',
            image: 'assets/images/hamburguesa.jpg',
            badges: [],
            rating: 4.5,
            reviews: 389,
            preparationTime: 15,
            calories: 580,
            ingredients: ['Carne de res', 'Pan artesanal', 'Queso', 'Tocineta', 'Vegetales'],
            allergens: ['Gluten', 'Lácteos'],
            available: true,
            featured: false
        }
    ],
    bebidas: [
        {
            id: 'limonada-natural',
            name: 'Limonada Natural',
            category: 'bebidas',
            price: 5000,
            description: 'Limonada fresca hecha al momento con limones naturales.',
            image: 'assets/images/limonada.jpg',
            badges: [],
            rating: 4.8,
            reviews: 234,
            preparationTime: 5,
            calories: 80,
            available: true,
            featured: false
        },
        {
            id: 'jugo-naranja',
            name: 'Jugo de Naranja',
            category: 'bebidas',
            price: 5000,
            description: 'Jugo de naranja 100% natural recién exprimido.',
            image: 'assets/images/jugo-naranja.jpg',
            badges: [],
            rating: 4.7,
            reviews: 189,
            preparationTime: 5,
            calories: 110,
            available: true,
            featured: false
        }
    ]
};

// ===== CLASE GESTIÓN DE MENÚ =====
class MenuManager {
    constructor() {
        this.products = this.loadProducts();
        this.currentFilter = 'all';
        this.currentSort = 'featured';
        this.searchQuery = '';
        
        this.init();
    }
    
    init() {
        this.setupFilters();
        this.setupSearch();
        this.setupSort();
        this.render();
    }
    
    loadProducts() {
        // Combinar todas las categorías
        return [
            ...PRODUCTS_DATABASE.porciones,
            ...PRODUCTS_DATABASE.bebidas
        ];
    }
    
    setupFilters() {
        const filterBtns = document.querySelectorAll('[data-filter]');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                this.setFilter(filter);
                
                // Actualizar UI de botones activos
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }
    
    setupSearch() {
        const searchInput = document.getElementById('menuSearch');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.render();
            });
        }
    }
    
    setupSort() {
        const sortSelect = document.getElementById('menuSort');
        
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.render();
            });
        }
    }
    
    setFilter(filter) {
        this.currentFilter = filter;
        this.render();
    }
    
    getFilteredProducts() {
        let filtered = [...this.products];
        
        // Filtrar por categoría
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(p => p.category === this.currentFilter);
        }
        
        // Filtrar por búsqueda
        if (this.searchQuery) {
            filtered = filtered.filter(p => {
                return p.name.toLowerCase().includes(this.searchQuery) ||
                       p.description.toLowerCase().includes(this.searchQuery) ||
                       p.ingredients?.some(i => i.toLowerCase().includes(this.searchQuery));
            });
        }
        
        // Filtrar solo disponibles
        filtered = filtered.filter(p => p.available);
        
        return filtered;
    }
    
    getSortedProducts(products) {
        const sorted = [...products];
        
        switch (this.currentSort) {
            case 'price-asc':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return sorted.sort((a, b) => b.price - a.price);
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'popular':
                return sorted.sort((a, b) => b.reviews - a.reviews);
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'featured':
            default:
                return sorted.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return b.rating - a.rating;
                });
        }
    }
    
    render() {
        const container = document.getElementById('menuGrid');
        if (!container) return;
        
        const filtered = this.getFilteredProducts();
        const sorted = this.getSortedProducts(filtered);
        
        if (sorted.length === 0) {
            container.innerHTML = this.renderEmptyState();
            return;
        }
        
        container.innerHTML = sorted.map(product => this.renderProductCard(product)).join('');
        
        // Actualizar contador
        this.updateResultsCount(sorted.length);
    }
    
    renderProductCard(product) {
        const badges = this.renderBadges(product.badges);
        const rating = this.renderRating(product.rating, product.reviews);
        
        return `
            <div class="porcion-card fade-in-up" data-id="${product.id}">
                <div class="card-image">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         loading="lazy"
                         onerror="this.src='assets/images/placeholder.jpg'">
                    ${badges}
                    <button class="btn-favorite" 
                            onclick="menuManager.toggleFavorite('${product.id}')"
                            title="Agregar a favoritos">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
                <div class="card-content">
                    <h3>${product.name}</h3>
                    <p class="card-description">${product.description}</p>
                    ${rating}
                    <div class="card-info">
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <span>${product.preparationTime} min</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-fire"></i>
                            <span>${product.calories} kcal</span>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="card-price">
                            <span class="price-label">Precio</span>
                            <span class="price-value">$${this.formatPrice(product.price)}</span>
                        </div>
                        <button class="btn btn--primary btn--small" 
                                onclick="menuManager.addToCart('${product.id}')">
                            <i class="fas fa-shopping-cart"></i>
                            Agregar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderBadges(badges) {
        if (!badges || badges.length === 0) return '';
        
        return badges.map(badge => {
            const badgeClass = badge === 'hot' ? 'badge-hot' : 
                             badge === 'new' ? 'badge-new' : 
                             'badge-popular';
            const badgeText = badge === 'hot' ? '🔥 Hot' : 
                            badge === 'new' ? '✨ Nuevo' : 
                            '⭐ Popular';
            
            return `<span class="card-badge ${badgeClass}">${badgeText}</span>`;
        }).join('');
    }
    
    renderRating(rating, reviews) {
        const stars = this.renderStars(rating);
        
        return `
            <div class="card-rating">
                <div class="stars">${stars}</div>
                <span class="reviews">(${reviews} reseñas)</span>
            </div>
        `;
    }
    
    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }
    
    renderEmptyState() {
        return `
            <div class="empty-state">
                <i class="fas fa-search" style="font-size: 4rem; color: var(--gray-300); margin-bottom: 1rem;"></i>
                <h3>No se encontraron productos</h3>
                <p>Intenta con otros términos de búsqueda o filtros</p>
                <button class="btn btn--primary" onclick="menuManager.clearFilters()">
                    Limpiar filtros
                </button>
            </div>
        `;
    }
    
    updateResultsCount(count) {
        const counter = document.getElementById('resultsCount');
        if (counter) {
            counter.textContent = `${count} producto${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
        }
    }
    
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        
        if (!product) {
            console.error('Producto no encontrado:', productId);
            return;
        }
        
        if (typeof cartManager !== 'undefined') {
            cartManager.addItem(product);
        } else {
            console.error('CartManager no está disponible');
            window.showNotification?.('⚠️ Error al agregar al carrito', 'warning');
        }
    }
    
    toggleFavorite(productId) {
        const favorites = this.getFavorites();
        const index = favorites.indexOf(productId);
        
        if (index > -1) {
            favorites.splice(index, 1);
            window.showNotification?.('💔 Eliminado de favoritos', 'info');
        } else {
            favorites.push(productId);
            window.showNotification?.('❤️ Agregado a favoritos', 'success');
        }
        
        this.saveFavorites(favorites);
        this.updateFavoriteButtons();
    }
    
    getFavorites() {
        try {
            const saved = localStorage.getItem('elbuensabor_favorites');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            return [];
        }
    }
    
    saveFavorites(favorites) {
        localStorage.setItem('elbuensabor_favorites', JSON.stringify(favorites));
    }
    
    updateFavoriteButtons() {
        const favorites = this.getFavorites();
        
        document.querySelectorAll('.btn-favorite').forEach(btn => {
            const card = btn.closest('[data-id]');
            if (!card) return;
            
            const productId = card.getAttribute('data-id');
            const icon = btn.querySelector('i');
            
            if (favorites.includes(productId)) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                btn.style.color = 'var(--primary)';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                btn.style.color = 'var(--gray-400)';
            }
        });
    }
    
    clearFilters() {
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.currentSort = 'featured';
        
        // Limpiar UI
        const searchInput = document.getElementById('menuSearch');
        if (searchInput) searchInput.value = '';
        
        const sortSelect = document.getElementById('menuSort');
        if (sortSelect) sortSelect.value = 'featured';
        
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === 'all') {
                btn.classList.add('active');
            }
        });
        
        this.render();
    }
    
    getProductById(productId) {
        return this.products.find(p => p.id === productId);
    }
    
    getProductsByCategory(category) {
        return this.products.filter(p => p.category === category && p.available);
    }
    
    getFeaturedProducts() {
        return this.products.filter(p => p.featured && p.available);
    }
    
    getPopularProducts(limit = 4) {
        return [...this.products]
            .filter(p => p.available)
            .sort((a, b) => b.reviews - a.reviews)
            .slice(0, limit);
    }
    
    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    
    // Exportar datos
    exportProducts() {
        return JSON.stringify(this.products, null, 2);
    }
    
    // Estadísticas
    getStats() {
        return {
            total: this.products.length,
            available: this.products.filter(p => p.available).length,
            categories: [...new Set(this.products.map(p => p.category))],
            avgPrice: Math.round(
                this.products.reduce((sum, p) => sum + p.price, 0) / this.products.length
            ),
            avgRating: (
                this.products.reduce((sum, p) => sum + p.rating, 0) / this.products.length
            ).toFixed(2)
        };
    }
}

// ===== INICIALIZAR =====
let menuManager;

document.addEventListener('DOMContentLoaded', function() {
    menuManager = new MenuManager();
    console.log('📋 MenuManager inicializado');
    console.log('📊 Estadísticas:', menuManager.getStats());
});

// ===== EXPORTAR GLOBALMENTE =====
window.menuManager = menuManager;
window.MenuManager = MenuManager;
window.PRODUCTS_DATABASE = PRODUCTS_DATABASE;