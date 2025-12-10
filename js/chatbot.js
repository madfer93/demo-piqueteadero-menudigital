/* ===================================
   EL BUEN SABOR - CHATBOT IA
   ChefBot - Asistente Virtual Inteligente
   =================================== */

// ===== BASE DE CONOCIMIENTO =====
const KNOWLEDGE_BASE = {
    menu: {
        keywords: ['menu', 'menú', 'carta', 'platos', 'comida', 'que tienen', 'qué tienen'],
        response: `🍗 **NUESTRO MENÚ ESPECIALIZADO:**

**🔥 LO MÁS PEDIDO:**
- Pollo Broaster Crujiente - $38,000
- Pechuga Apanada - $32,000
- Picada Mixta (2-3 personas) - $45,000
- Costillas BBQ - $42,000

**🥤 BEBIDAS:**
- Gaseosas - $3,500
- Jugos naturales - $5,000
- Cerveza - $4,500

¿Quieres hacer un pedido? 🛒`
    },
    
    horarios: {
        keywords: ['horario', 'hora', 'abren', 'cierran', 'abierto', 'cerrado', 'cuando'],
        response: `🕐 **HORARIOS DE ATENCIÓN:**

📅 **Lunes a Jueves:**
11:00 AM - 10:00 PM

📅 **Viernes y Sábado:**
11:00 AM - 11:00 PM

📅 **Domingo:**
12:00 PM - 9:00 PM

🎉 **Festivos:**
Horario de domingo

¡Estamos abiertos para atenderte! 😊`
    },
    
    domicilio: {
        keywords: ['domicilio', 'delivery', 'envío', 'envio', 'llevan', 'entregan', 'entrega'],
        response: `🚚 **SERVICIO A DOMICILIO:**

✅ **Tiempo de entrega:** 30-45 minutos
💰 **Costo:** $3,000 COP
🎁 **GRATIS en compras +$35,000**

📍 **Cobertura:** Todo Villavicencio

**¿Cómo pedir?**
1. Agrega productos al carrito 🛒
2. Completa tu dirección
3. Confirma por WhatsApp

¿Quieres ordenar ahora? 📱`
    },
    
    ubicacion: {
        keywords: ['ubicación', 'ubicacion', 'dirección', 'direccion', 'donde', 'dónde', 'quedan', 'están'],
        response: `📍 **ENCUÉNTRANOS AQUÍ:**

**Dirección:**
Calle 15 #22-45, Barrio La Esperanza
Villavicencio, Meta

**Referencias:**
- Frente al parque principal
- A 2 cuadras del centro comercial

📞 **Teléfono:** 320 123 4567
📱 **WhatsApp:** 300 123 4567

¿Te gustaría ver el mapa? 🗺️`
    },
    
    precios: {
        keywords: ['precio', 'precios', 'costo', 'costos', 'cuanto', 'cuánto', 'vale', 'valor'],
        response: `💰 **NUESTROS PRECIOS:**

**PLATOS PRINCIPALES:**
- Pollo Broaster: $38,000
- Pechuga Apanada: $32,000
- Costillas BBQ: $42,000
- Picada Mixta: $45,000

**PORCIONES PERSONALES:**
Desde $28,000

**COMBOS FAMILIARES:**
Desde $55,000

💳 **Formas de pago:**
Efectivo, Nequi, Bancolombia, Daviplata

¿Necesitas más detalles? 🤔`
    },
    
    promociones: {
        keywords: ['promoción', 'promocion', 'promo', 'oferta', 'descuento', 'especial', 'combo'],
        response: `🎉 **PROMOCIONES ACTIVAS:**

**🔥 PROMO HOY:**
2x1 en Pollo Broaster
Lunes a Miércoles

**👨‍👩‍👧 COMBO FAMILIAR:**
- Pollo completo
- Papas grandes
- Ensalada
- Gaseosa 1.5L
**Solo $55,000** (ahorra $12,000)

**🍺 HAPPY HOUR:**
Cerveza a mitad de precio
4PM - 7PM (L-V)

¿Te interesa alguna? 🤩`
    },
    
    pago: {
        keywords: ['pago', 'pagar', 'forma de pago', 'efectivo', 'tarjeta', 'nequi', 'daviplata'],
        response: `💳 **FORMAS DE PAGO:**

✅ **Aceptamos:**
- 💵 Efectivo
- 📱 Nequi
- 🏦 Bancolombia
- 💳 Daviplata
- 💰 Transferencia bancaria

**Para domicilios:**
Puedes pagar al recibir tu pedido o anticipadamente.

**Importante:** No manejamos datáfono en domicilios.

¿Listo para ordenar? 🛍️`
    },
    
    pedido: {
        keywords: ['pedir', 'ordenar', 'hacer pedido', 'quiero', 'deseo', 'solicitar'],
        response: `🛒 **¿LISTO PARA ORDENAR?**

**Opciones:**

1️⃣ **En nuestro sitio:**
   • Navega el menú
   • Agrega al carrito
   • Envía por WhatsApp

2️⃣ **Por WhatsApp directo:**
   • Dime qué deseas
   • Te confirmo disponibilidad
   • Procesamos tu pedido

3️⃣ **Llamada telefónica:**
   📞 320 123 4567

¿Cómo prefieres ordenar? 😊`
    },
    
    especialidad: {
        keywords: ['especialidad', 'recomendación', 'recomienda', 'mejor', 'famoso'],
        response: `⭐ **NUESTRA ESPECIALIDAD:**

🔥 **POLLO BROASTER ORIGINAL**
Desde 1998, nuestro clásico:
- Crujiente por fuera
- Jugoso por dentro
- Receta secreta de 11 especias
- Marinado 24 horas

**Acompañamientos:**
- Papas criollas fritas
- Ensalada fresca
- Salsas de la casa

**Precio:** $38,000
⭐ 4.9/5 (1,200+ reseñas)

¿Te animas a probarlo? 😋`
    }
};

// ===== CLASE CHATBOT =====
class ChefBot {
    constructor() {
        this.isOpen = false;
        this.messageHistory = [];
        this.isTyping = false;
        this.userFirstName = '';
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadHistory();
        this.addWelcomeMessage();
    }
    
    setupEventListeners() {
        // Toggle chatbot
        const toggleBtn = document.getElementById('chatbotToggle');
        const closeBtn = document.getElementById('chatbotClose');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        // Enviar mensaje
        const sendBtn = document.getElementById('chatbotSend');
        const input = document.getElementById('chatbotInput');
        
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }
        
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }
        
        // Quick replies
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply')) {
                const message = e.target.getAttribute('data-message');
                this.handleQuickReply(message);
            }
        });
    }
    
    toggle() {
        this.isOpen ? this.close() : this.open();
    }
    
    open() {
        const container = document.getElementById('chatbotContainer');
        if (container) {
            container.classList.remove('hidden');
            container.classList.add('slide-in-up');
            this.isOpen = true;
            
            // Focus en input
            setTimeout(() => {
                document.getElementById('chatbotInput')?.focus();
            }, 300);
        }
    }
    
    close() {
        const container = document.getElementById('chatbotContainer');
        if (container) {
            container.classList.add('hidden');
            this.isOpen = false;
        }
    }
    
    addWelcomeMessage() {
        const welcomeMsg = {
            type: 'bot',
            text: `¡Hola! 👋 Soy ChefBot, tu asistente virtual de El Buen Sabor.

¿En qué puedo ayudarte hoy?`,
            timestamp: new Date(),
            quickReplies: [
                { text: '📋 Ver Menú', message: 'quiero ver el menu' },
                { text: '🚚 Domicilio', message: 'información sobre domicilio' },
                { text: '🕐 Horarios', message: 'horarios de atención' },
                { text: '🎉 Promociones', message: 'promociones activas' }
            ]
        };
        
        this.messageHistory.push(welcomeMsg);
        this.renderMessage(welcomeMsg);
    }
    
    sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Agregar mensaje del usuario
        this.addUserMessage(message);
        input.value = '';
        
        // Mostrar "escribiendo..."
        this.showTypingIndicator();
        
        // Simular delay de respuesta (1-2 segundos)
        const delay = 1000 + Math.random() * 1000;
        
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addBotMessage(response);
        }, delay);
    }
    
    handleQuickReply(message) {
        this.addUserMessage(message);
        
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addBotMessage(response);
        }, 1000);
    }
    
    addUserMessage(text) {
        const message = {
            type: 'user',
            text: text,
            timestamp: new Date()
        };
        
        this.messageHistory.push(message);
        this.renderMessage(message);
        this.scrollToBottom();
        this.saveHistory();
    }
    
    addBotMessage(text, quickReplies = null) {
        const message = {
            type: 'bot',
            text: text,
            timestamp: new Date(),
            quickReplies: quickReplies
        };
        
        this.messageHistory.push(message);
        this.renderMessage(message);
        this.scrollToBottom();
        this.saveHistory();
    }
    
    renderMessage(message) {
        const container = document.getElementById('chatbotMessages');
        if (!container) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${message.type}-message fade-in-up`;
        
        if (message.type === 'bot') {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-bubble">
                    <div class="message-text">${this.formatMessage(message.text)}</div>
                    <div class="message-time">${this.formatTime(message.timestamp)}</div>
                    ${message.quickReplies ? this.renderQuickReplies(message.quickReplies) : ''}
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-bubble">
                    <div class="message-text">${this.escapeHtml(message.text)}</div>
                    <div class="message-time">${this.formatTime(message.timestamp)}</div>
                </div>
            `;
        }
        
        container.appendChild(messageDiv);
    }
    
    renderQuickReplies(replies) {
        if (!replies || replies.length === 0) return '';
        
        return `
            <div class="quick-replies">
                ${replies.map(reply => `
                    <button class="quick-reply" data-message="${reply.message}">
                        ${reply.text}
                    </button>
                `).join('')}
            </div>
        `;
    }
    
    showTypingIndicator() {
        const container = document.getElementById('chatbotMessages');
        if (!container) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-bubble">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        container.appendChild(typingDiv);
        this.scrollToBottom();
        this.isTyping = true;
    }
    
    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
        this.isTyping = false;
    }
    
    generateResponse(userMessage) {
        const messageLower = userMessage.toLowerCase();
        
        // Buscar en la base de conocimiento
        for (const [key, data] of Object.entries(KNOWLEDGE_BASE)) {
            if (data.keywords.some(keyword => messageLower.includes(keyword))) {
                return data.response;
            }
        }
        
        // Saludos
        if (/hola|buenos|buenas|hey|hi/i.test(messageLower)) {
            return `¡Hola! 😊 Bienvenido a El Buen Sabor.

Soy ChefBot y estoy aquí para ayudarte.

¿Qué te gustaría saber?`;
        }
        
        // Despedidas
        if (/adiós|adios|chao|bye|gracias/i.test(messageLower)) {
            return `¡Gracias por contactarnos! 😊

Ha sido un placer ayudarte.

¡Esperamos tu pedido pronto! 🍗

📱 WhatsApp: 300 123 4567`;
        }
        
        // Respuesta genérica
        return `Entiendo que preguntas sobre "${userMessage}".

Para ayudarte mejor, puedes:

- 📋 Consultar nuestro **menú**
- 📞 Llamarnos: 320 123 4567
- 📱 WhatsApp: 300 123 4567
- 🕐 Ver **horarios**
- 📍 Ver **ubicación**

¿Sobre qué más te gustaría saber? 🤔`;
    }
    
    formatMessage(text) {
        // Convertir **texto** a <strong>
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Convertir saltos de línea
        text = text.replace(/\n/g, '<br>');
        
        return text;
    }
    
    formatTime(date) {
        return date.toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    scrollToBottom() {
        const container = document.getElementById('chatbotMessages');
        if (container) {
            setTimeout(() => {
                container.scrollTop = container.scrollHeight;
            }, 100);
        }
    }
    
    saveHistory() {
        try {
            // Solo guardar últimos 20 mensajes
            const recentHistory = this.messageHistory.slice(-20);
            localStorage.setItem('chefbot_history', JSON.stringify(recentHistory));
        } catch (error) {
            console.error('Error guardando historial:', error);
        }
    }
    
    loadHistory() {
        try {
            const saved = localStorage.getItem('chefbot_history');
            if (saved) {
                this.messageHistory = JSON.parse(saved);
                // No renderizar mensajes viejos al cargar
            }
        } catch (error) {
            console.error('Error cargando historial:', error);
        }
    }
    
    clearHistory() {
        this.messageHistory = [];
        localStorage.removeItem('chefbot_history');
        
        const container = document.getElementById('chatbotMessages');
        if (container) {
            container.innerHTML = '';
        }
        
        this.addWelcomeMessage();
    }
    
    exportChat() {
        return JSON.stringify(this.messageHistory, null, 2);
    }
}

// ===== INICIALIZAR =====
let chefBot;

document.addEventListener('DOMContentLoaded', function() {
    chefBot = new ChefBot();
    console.log('🤖 ChefBot inicializado');
});

// ===== EXPORTAR GLOBALMENTE =====
window.chefBot = chefBot;
window.ChefBot = ChefBot;