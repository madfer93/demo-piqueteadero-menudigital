# 🍗 Demo Piqueteadero - Menú Digital Interactivo

Demo funcional de sistema completo para restaurante/piqueteadero con IA integrada.

## 🚀 Características

✅ **Menú Digital Interactivo**
- Categorías organizadas (Pollos, Carnes, Bebidas, Extras)
- Búsqueda en tiempo real
- Filtros por categoría

✅ **ChefBot IA**
- Asistente virtual 24/7
- Recomendaciones personalizadas
- Respuestas sobre menú, precios, ingredientes

✅ **Sistema de Pedidos**
- Carrito de compras inteligente
- Envío directo a WhatsApp
- Confirmación automática

✅ **Panel de Administración**
- **Admin**: Modificar contenido del menú y configuración
- **Superadmin**: Eliminar/revertir modificaciones del admin
- Vista de pedidos
- Control de inventario simple
- Métricas básicas

## 📁 Estructura del Proyecto

```
demo-piqueteadero-menudigital/
├── .gitignore                    # Archivos ignorados por git
├── package.json                  # Configuración del proyecto
├── README.md                     # Este archivo
│
├── /public/                      # Frontend público (clientes)
│   ├── index.html               # Página principal
│   ├── menu.html                # Menú digital completo
│   └── /assets/
│       ├── /css/                # Estilos del frontend
│       │   ├── styles.css
│       │   ├── menu.css
│       │   └── animations.css
│       ├── /js/                 # Scripts del frontend
│       │   ├── main.js
│       │   ├── menu.js
│       │   ├── cart.js
│       │   ├── chatbot.js
│       │   ├── config.js
│       │   └── integracion.js
│       └── /images/             # Imágenes y recursos
│           ├── ChefBot IA.jpg
│           └── /productos/
│
├── /admin/                       # Panel de administración
│   ├── index.html               # Dashboard admin
│   ├── login.html               # Login admin
│   ├── /pages/                  # Páginas del panel
│   │   ├── pedidos.html
│   │   ├── estadisticas.html
│   │   └── menu-editor.html
│   ├── /assets/
│   │   ├── /css/
│   │   │   └── admin.css
│   │   └── /js/
│   │       ├── admin.js
│   │       └── auth.js
│   └── /api/
│       └── config.php
│
├── /superadmin/                  # Panel superadministrador
│   ├── index.html               # Dashboard superadmin
│   └── /assets/
│       └── /js/
│           └── superadmin.js
│
└── /docs/                        # Documentación (futuro)
    ├── SETUP.md
    └── ARCHITECTURE.md
```

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **IA**: Botpress Cloud (ChefBot)
- **Mensajería**: WhatsApp Business API
- **Gestión**: Google Sheets
- **Automatización**: Make.com

## 🚀 Inicio Rápido

### Desarrollo Local

```bash
# Clonar el repositorio
git clone https://github.com/madfer93/demo-piqueteadero-menudigital.git
cd demo-piqueteadero-menudigital

# Opción 1: Usar live-server (recomendado)
npm run dev

# Opción 2: Usar http-server
npm start

# Opción 3: Usar cualquier servidor HTTP
# Los archivos públicos están en /public/
```

### Deployment

El proyecto está optimizado para ser desplegado en:
- GitHub Pages
- Netlify
- Vercel
- Cualquier hosting estático

**Importante**: Configurar el directorio raíz en `/public/`

## 👥 Roles de Usuario

### Admin
- Modificar menú y precios
- Gestionar pedidos
- Actualizar configuración
- Ver estadísticas

### Superadmin
- Todas las funciones de Admin
- Eliminar/revertir modificaciones del admin
- Gestión de usuarios admin
- Acceso completo al sistema

## 🌐 Demo en Vivo

**URL Demo**: [Por definir]
**WhatsApp ChefBot**: [Por configurar]

## 📞 Contacto

**Manuel Madrid** - Consultor en Automatización & IA
📱 WhatsApp: +57 304 578 8873
📧 Email: madfer1993@gmail.com
🌐 Portfolio: [madfer93.github.io/Perfil-comercial-Manuel](https://madfer93.github.io/Perfil-comercial-Manuel/)

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles

---

© 2025 Variedades JyM - Demo para fines comerciales
