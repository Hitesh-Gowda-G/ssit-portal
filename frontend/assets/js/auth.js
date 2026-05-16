document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const data = await api.post('/auth/login', { email, password });
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.student));
                showToast('Login successful!');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const usn = document.getElementById('usn').value;
            const password = document.getElementById('password').value;

            try {
                await api.post('/auth/register', { name, email, usn, password });
                showToast('Registration successful! Please login.');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    }
});
