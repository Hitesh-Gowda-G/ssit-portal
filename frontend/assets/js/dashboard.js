document.addEventListener('DOMContentLoaded', async () => {
    if (!window.location.pathname.endsWith('dashboard.html')) return;

    try {
        const [registered, history] = await Promise.all([
            api.get('/subjects/registered'),
            api.get('/history')
        ]);

        // Update Stats
        document.getElementById('totalSubjects').textContent = registered.length;
        const totalCredits = registered.reduce((sum, sub) => sum + sub.credits, 0);
        document.getElementById('totalCredits').textContent = totalCredits;

        // Update Recent Activity
        const tbody = document.querySelector('#recentActivityTable tbody');
        tbody.innerHTML = '';

        history.slice(0, 5).forEach(item => {
            const row = document.createElement('tr');
            const date = new Date(item.created_at).toLocaleDateString();
            row.innerHTML = `
                <td>${date}</td>
                <td>${item.subject_name}</td>
                <td>${item.action_type}</td>
                <td><span class="badge badge-${item.action_type.toLowerCase()}">${item.action_type}</span></td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error(error);
        showToast('Failed to load dashboard data', 'error');
    }
});
