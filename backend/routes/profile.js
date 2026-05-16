const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Get profile
router.get('/', auth, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, name, email, usn, created_at FROM students WHERE id = $1',
            [req.student.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
