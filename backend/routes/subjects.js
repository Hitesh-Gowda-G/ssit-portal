const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Get all subjects
router.get('/', auth, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT s.*, CASE WHEN r.id IS NOT NULL THEN TRUE ELSE FALSE END as is_registered, r.id as registration_id FROM subjects s LEFT JOIN registrations r ON s.id = r.subject_id AND r.student_id = $1',
            [req.student.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Search subjects
router.get('/search', auth, async (req, res) => {
    const { q } = req.query;
    try {
        const result = await db.query(
            'SELECT s.*, CASE WHEN r.id IS NOT NULL THEN TRUE ELSE FALSE END as is_registered, r.id as registration_id FROM subjects s LEFT JOIN registrations r ON s.id = r.subject_id AND r.student_id = $2 WHERE s.subject_code ILIKE $1 OR s.subject_name ILIKE $1',
            [`%${q}%`, req.student.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Register for a subject (POST /subjects)
router.post('/', auth, async (req, res) => {
    const { subject_id, semester, academic_year } = req.body;
    const student_id = req.student.id;

    try {
        // Check if already registered
        const check = await db.query(
            'SELECT * FROM registrations WHERE student_id = $1 AND subject_id = $2',
            [student_id, subject_id]
        );
        if (check.rows.length > 0) {
            return res.status(400).json({ message: 'Already registered for this subject' });
        }

        // Get subject info for history
        const subResult = await db.query('SELECT * FROM subjects WHERE id = $1', [subject_id]);
        const subject = subResult.rows[0];

        // Start transaction
        await db.query('BEGIN');
        
        await db.query(
            'INSERT INTO registrations (student_id, subject_id, semester, academic_year) VALUES ($1, $2, $3, $4)',
            [student_id, subject_id, semester, academic_year]
        );

        // Add to history
        await db.query(
            'INSERT INTO history (student_id, subject_id, subject_code, subject_name, action_type, old_value, new_value) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [student_id, subject_id, subject.subject_code, subject.subject_name, 'Added', 'NULL', 'Registered']
        );

        await db.query('COMMIT');
        res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get student's registered subjects
router.get('/registered', auth, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT r.id as registration_id, s.*, r.semester, r.academic_year FROM registrations r JOIN subjects s ON r.subject_id = s.id WHERE r.student_id = $1',
            [req.student.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update registration (Modify)
router.put('/:id', auth, async (req, res) => {
    const { semester, academic_year } = req.body;
    const registration_id = req.params.id;
    const student_id = req.student.id;

    try {
        // Get old values for history
        const oldRes = await db.query(
            'SELECT r.*, s.subject_code, s.subject_name FROM registrations r JOIN subjects s ON r.subject_id = s.id WHERE r.id = $1 AND r.student_id = $2',
            [registration_id, student_id]
        );
        if (oldRes.rows.length === 0) return res.status(404).json({ message: 'Registration not found' });
        
        const oldData = oldRes.rows[0];
        const oldValue = `Sem: ${oldData.semester}, Year: ${oldData.academic_year}`;
        const newValue = `Sem: ${semester}, Year: ${academic_year}`;

        await db.query('BEGIN');

        await db.query(
            'UPDATE registrations SET semester = $1, academic_year = $2 WHERE id = $3 AND student_id = $4',
            [semester, academic_year, registration_id, student_id]
        );

        // Add to history
        await db.query(
            'INSERT INTO history (student_id, subject_id, subject_code, subject_name, action_type, old_value, new_value) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [student_id, oldData.subject_id, oldData.subject_code, oldData.subject_name, 'Modified', oldValue, newValue]
        );

        await db.query('COMMIT');
        res.json({ message: 'Registration updated' });
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Delete registration (Remove)
router.delete('/:id', auth, async (req, res) => {
    const registration_id = req.params.id;
    const student_id = req.student.id;

    try {
        // Get info for history
        const regRes = await db.query(
            'SELECT r.*, s.subject_code, s.subject_name FROM registrations r JOIN subjects s ON r.subject_id = s.id WHERE r.id = $1 AND r.student_id = $2',
            [registration_id, student_id]
        );
        if (regRes.rows.length === 0) return res.status(404).json({ message: 'Registration not found' });
        
        const data = regRes.rows[0];

        await db.query('BEGIN');

        await db.query('DELETE FROM registrations WHERE id = $1 AND student_id = $2', [registration_id, student_id]);

        // Add to history
        await db.query(
            'INSERT INTO history (student_id, subject_id, subject_code, subject_name, action_type, old_value, new_value) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [student_id, data.subject_id, data.subject_code, data.subject_name, 'Deleted', 'Registered', 'Removed']
        );

        await db.query('COMMIT');
        res.json({ message: 'Registration removed' });
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
