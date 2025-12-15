// Datos del dashboard (se pueden guardar en localStorage para persistir)
let dashboardData = JSON.parse(localStorage.getItem('dashboard_data')) || {
    salesToday: 2450000,
    ordersToday: 47,
    activeOrders: 3,
    rating: 4.9,
    salesLast7Days: [1800000, 2100000, 1950000, 2200000, 2400000, 2350000, 2450000],
    recentOrders: [
        { id: '#1234', client: 'Juan Pérez', products: 'Pollo Broaster + Papas', total: 42000, status: 'pending', time: '15:30' },
        { id: '#1233', client: 'María García', products: 'Picada Mixta', total: 45000, status: 'delivery', time: '15:15' },
        { id: '#1232', client: 'Carlos López', products: 'Pechuga Apanada', total: 32000, status: 'completed', time: '14:45' },
        { id: '#1231', client: 'Ana Rodríguez', products: 'Costillas BBQ', total: 42000, status: 'pending', time: '14:20' }
    ],
    topProducts: [
        { name: 'Pollo Broaster Completo', sales: 87, price: 38000, image: '../assets/images/productos/pollo-broster-completo.jpg' },
        { name: 'Picada Mixta Especial', sales: 52, price: 45000, image: '../assets/images/productos/picada-mixta.jpg' },
        { name: 'Pechuga Apanada Gigante', sales: 41, price: 32000, image: '../assets/images/productos/pechuga-apanada-xxl.jpg' },
        { name: 'Costillas BBQ Premium', sales: 35, price: 42000, image: '../assets/images/productos/costillas-bbq.jpg' }
    ]
};

function saveDashboardData() {
    localStorage.setItem('dashboard_data', JSON.stringify(dashboardData));
}

function loadDashboard() {
    // Fecha actual
    document.getElementById('welcomeDate').textContent = new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Rol de usuario
    const role = getUserRole();
    document.getElementById('adminRole').textContent = role === 'superadmin' ? 'Super Admin' : 'Administrador';
    document.getElementById('adminName').textContent = role === 'superadmin' ? 'SuperAdmin' : 'Admin';

    // Stats
    document.getElementById('salesToday').textContent = '$' + dashboardData.salesToday.toLocaleString();
    document.getElementById('ordersToday').textContent = dashboardData.ordersToday;
    document.getElementById('activeOrders').textContent = dashboardData.activeOrders;
    document.getElementById('rating').textContent = dashboardData.rating;

    // Badge pedidos pendientes
    const pending = dashboardData.recentOrders.filter(o => o.status !== 'completed').length;
    document.getElementById('pendingOrdersBadge').textContent = pending;

    // Tabla pedidos recientes
    const tbody = document.getElementById('recentOrdersTable');
    tbody.innerHTML = '';
    dashboardData.recentOrders.slice(0, 4).forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.id}</td>
            <td>${order.client}</td>
            <td>$${order.total.toLocaleString()}</td>
            <td><span class="status status-${order.status}">${getStatusText(order.status)}</span></td>
            <td>
                <button class="btn-icon" title="Ver"><i class="fas fa-eye"></i></button>
                ${order.status !== 'completed' ? `<button class="btn-icon" title="Marcar entregado" onclick="markDelivered('${order.id}')"><i class="fas fa-check"></i></button>` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Top productos
    const grid = document.getElementById('topProductsGrid');
    grid.innerHTML = '';
    dashboardData.topProducts.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}" onerror="this.src='../assets/images/placeholder.jpg'">
            <h4>${p.name}</h4>
            <p><strong>${p.sales}</strong> ventas hoy</p>
            <span class="product-price">$${p.price.toLocaleString()}</span>
        `;
        grid.appendChild(card);
    });

    // Gráfico de ventas
    const ctx = document.getElementById('salesChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Ventas Diarias',
                data: dashboardData.salesLast7Days,
                borderColor: '#e67e22',
                backgroundColor: 'rgba(230, 126, 34, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { callback: value => '$' + value.toLocaleString() } }
            }
        }
    });
}

function getStatusText(status) {
    return status === 'pending' ? 'En preparación' : status === 'delivery' ? 'En camino' : 'Entregado';
}

function markDelivered(orderId) {
    const order = dashboardData.recentOrders.find(o => o.id === orderId);
    if (order) {
        order.status = 'completed';
        dashboardData.activeOrders = Math.max(0, dashboardData.activeOrders - 1);
        saveDashboardData();
        loadDashboard();
    }
}

function exportReport() {
    alert('Reporte exportado (simulado). En producción se descargaría un PDF/Excel.');
}

// Cargar al iniciar
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('admin_logged')) {
        window.location.href = 'login.html';
    }
    loadDashboard();
});