/* ===================================
   EL BUEN SABOR - CONFIGURACIÓN
   Archivo central de configuración
   =================================== */

const SITE_CONFIG = {
    // ===== INFORMACIÓN DE CONTACTO =====
    contact: {
        whatsapp: '573001234567',  // ⚠️ CAMBIAR por número real (formato: 57 + número sin espacios)
        phone: '+57 (8) 662 3456',
        email: 'contacto@elbuensabor.com',
        address: 'Calle 45 #23-10, Villavicencio, Meta',
        instagram: '@elbuensaborvillo',
        facebook: 'ElBuenSaborPiqueteadero'
    },
    
    // ===== CONFIGURACIÓN DEL CARRITO =====
    cart: {
        deliveryFee: 3000,              // Costo de domicilio en COP
        freeDeliveryMinimum: 35000,     // Mínimo para envío gratis en COP
        taxRate: 0,                      // IVA (0 = sin IVA)
        maxQuantityPerItem: 99,          // Cantidad máxima por producto
        localStorageKey: 'elbuensabor_cart'
    },
    
    // ===== HORARIOS =====
    schedule: {
        weekday: 'Lunes a Viernes: 11:00 AM - 10:00 PM',
        weekend: 'Sábados y Domingos: 11:00 AM - 11:00 PM',
        holidays: 'Festivos: 12:00 PM - 10:00 PM'
    },
    
    // ===== MENSAJES DEL CHATBOT =====
    chatbot: {
        welcomeMessage: '¡Hola! 👋 Soy ChefBot, tu asistente virtual de El Buen Sabor. ¿En qué puedo ayudarte hoy?',
        unavailableMessage: 'Lo siento, en este momento estoy fuera de servicio. Por favor, contáctanos por WhatsApp.',
        errorMessage: 'Disculpa, hubo un error. Por favor, intenta nuevamente.'
    },
    
    // ===== PROMOCIONES ACTIVAS =====
    promotions: {
        tuesdayThursday: {
            active: true,
            name: '2x1 en Pollos',
            days: ['martes', 'jueves'],
            description: 'Compra 1 pollo broaster y lleva el segundo GRATIS'
        },
        happyHour: {
            active: true,
            name: 'Happy Hour',
            hours: '15:00-18:00',
            discount: 15,
            description: '15% de descuento en bebidas'
        },
        familyCombo: {
            active: true,
            name: 'Combo Familiar',
            price: 85000,
            description: 'Pollo broaster + 2 acompañantes + bebida familiar'
        }
    },
    
    // ===== CONFIGURACIÓN DE NOTIFICACIONES =====
    notifications: {
        duration: 3000,              // Duración en ms
        position: 'top-right',       // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
        enableSound: false           // Sonido en notificaciones
    },
    
    // ===== REDES SOCIALES =====
    social: {
        facebook: 'https://facebook.com/elbuensabor',
        instagram: 'https://instagram.com/elbuensaborvillo',
        tiktok: '',
        youtube: ''
    },
    
    // ===== SEO Y METADATA =====
    seo: {
        siteName: 'El Buen Sabor',
        tagline: 'Piqueteadero Original desde 1998',
        description: 'El mejor piqueteadero de Villavicencio. Pollo broaster, carnes, picadas y más.',
        keywords: 'piqueteadero, pollo broaster, villavicencio, comida, domicilio',
        foundedYear: 1998
    },
    
    // ===== CONFIGURACIÓN DE DESARROLLO =====
    dev: {
        debugMode: false,            // Activar logs en consola
        mockData: false,             // Usar datos de prueba
        testWhatsApp: false          // Usar número de prueba para WhatsApp
    }
};

// ===== FUNCIONES AUXILIARES =====

// Obtener número de WhatsApp formateado
function getWhatsAppNumber() {
    return SITE_CONFIG.contact.whatsapp.replace(/\D/g, '');
}

// Obtener enlace de WhatsApp con mensaje
function getWhatsAppLink(message = '') {
    const number = getWhatsAppNumber();
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${number}${message ? '?text=' + encodedMessage : ''}`;
}

// Verificar si está en horario de atención
function isOpenNow() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Domingo, 6 = Sábado
    
    // Horario básico: 11 AM - 10 PM entre semana
    if (day >= 1 && day <= 5) {
        return hour >= 11 && hour < 22;
    }
    
    // Fin de semana: 11 AM - 11 PM
    return hour >= 11 && hour < 23;
}

// Verificar si hay promoción activa
function hasActivePromotion(promotionKey) {
    const promo = SITE_CONFIG.promotions[promotionKey];
    return promo && promo.active;
}

// Obtener día actual en español
function getCurrentDay() {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return days[new Date().getDay()];
}

// ===== EXPORTAR =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SITE_CONFIG;
}

window.SITE_CONFIG = SITE_CONFIG;
window.getWhatsAppNumber = getWhatsAppNumber;
window.getWhatsAppLink = getWhatsAppLink;
window.isOpenNow = isOpenNow;
window.hasActivePromotion = hasActivePromotion;
window.getCurrentDay = getCurrentDay;