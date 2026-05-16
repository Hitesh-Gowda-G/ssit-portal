document.addEventListener('DOMContentLoaded', () => {
    // Check if logged in
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token && !window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('register.html')) {
        window.location.href = 'index.html';
    }

    if (user) {
        const userNameEl = document.getElementById('userName');
        const userAvatarEl = document.getElementById('userAvatar');
        if (userNameEl) userNameEl.textContent = user.name;
        if (userAvatarEl) userAvatarEl.textContent = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    // Sidebar Toggle
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    if (hamburger && sidebar) {
        hamburger.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    }

    // Mark active link
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
