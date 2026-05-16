document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.endsWith('register-subjects.html')) return;

    const subjectsTable = document.querySelector('#subjectsTable tbody');
    const searchInput = document.getElementById('searchInput');
    const semesterSelect = document.getElementById('semesterSelect');
    const academicYearSelect = document.getElementById('academicYearSelect');

    let allSubjects = [];

    const loadSubjects = async (query = '') => {
        try {
            const endpoint = query ? `/subjects/search?q=${query}` : '/subjects';
            allSubjects = await api.get(endpoint);
            renderSubjects();
        } catch (error) {
            showToast('Failed to load subjects', 'error');
        }
    };

    const renderSubjects = () => {
        subjectsTable.innerHTML = '';
        allSubjects.forEach(subject => {
            const row = document.createElement('tr');
            const btnText = subject.is_registered ? 'Unregister' : 'Register';
            const btnClass = subject.is_registered ? 'btn-danger' : 'btn-primary';
            
            row.innerHTML = `
                <td>${subject.subject_code}</td>
                <td>${subject.subject_name}</td>
                <td>${subject.credits}</td>
                <td>${subject.schedule}</td>
                <td>
                    <button class="btn ${btnClass} btn-sm action-btn" 
                        data-id="${subject.id}" 
                        data-reg-id="${subject.registration_id}"
                        data-registered="${subject.is_registered}"
                        style="padding: 6px 12px; width: auto; ${subject.is_registered ? 'background: var(--danger); color: white;' : ''}">
                        ${btnText}
                    </button>
                </td>
            `;
            subjectsTable.appendChild(row);
        });

        // Add event listeners to buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', handleAction);
        });
    };

    const handleAction = async (e) => {
        const btn = e.target.closest('.action-btn');
        if (!btn) return;
        const subjectId = btn.dataset.id;
        const registrationId = btn.dataset.regId;
        const isRegistered = btn.dataset.registered === 'true';

        if (isRegistered) {
            if (!confirm('Unregister from this subject?')) return;
            try {
                await api.delete(`/subjects/${registrationId}`);
                showToast('Unregistered successfully');
                loadSubjects(searchInput.value);
            } catch (error) {
                showToast(error.message, 'error');
            }
        } else {
            const semester = semesterSelect.value;
            const academicYear = academicYearSelect.value;

            try {
                const result = await api.post('/subjects', {
                    subject_id: subjectId,
                    semester,
                    academic_year: academicYear
                });
                showToast(result.message);
                loadSubjects(searchInput.value);
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    };

    searchInput.addEventListener('input', (e) => {
        loadSubjects(e.target.value);
    });

    loadSubjects();
});
