// Credenciales
const ADMIN_CREDENTIALS = { username: 'admin', password: 'demo2025' };
const SUPERADMIN_CREDENTIALS = { username: 'madfer93', password: 'Madfer1993' }; // Cambia esta contraseña por una segura

function login() {
    const username = document.getElementById('username')?.value.trim();
    const password = document.getElementById('password')?.value;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('admin_logged', 'true');
        localStorage.setItem('user_role', 'admin');
        localStorage.setItem('admin_name', 'Cliente Demo');
        window.location.href = 'index.html';
    } else if (username === SUPERADMIN_CREDENTIALS.username && password === SUPERADMIN_CREDENTIALS.password) {
        localStorage.setItem('admin_logged', 'true');
        localStorage.setItem('user_role', 'superadmin');
        localStorage.setItem('admin_name', 'SuperAdmin');
        window.location.href = 'index.html';
    } else {
        alert('Credenciales incorrectas');
    }
}

function logout() {
    localStorage.removeItem('admin_logged');
    localStorage.removeItem('user_role');
    localStorage.removeItem('admin_name');
    window.location.href = 'login.html';
}

function getUserRole() {
    return localStorage.getItem('user_role') || 'guest';
}

function isSuperAdmin() {
    return getUserRole() === 'superadmin';
}

// Proteger todas las páginas del admin
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('admin_logged') && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }

    // Mostrar nombre y rol en el sidebar (si existe)
    const nameEl = document.getElementById('adminName');
    const roleEl = document.getElementById('adminRole');
    if (nameEl) nameEl.textContent = localStorage.getItem('admin_name') || 'Usuario';
    if (roleEl) roleEl.textContent = isSuperAdmin() ? 'Super Admin' : 'Administrador';
});