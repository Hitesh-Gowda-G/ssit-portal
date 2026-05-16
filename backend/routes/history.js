const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Get history
router.get('/', auth, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM history WHERE student_id = $1 ORDER BY created_at DESC',
            [req.student.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
