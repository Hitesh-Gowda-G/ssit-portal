const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        await client.connect();
        // Rename department to usn
        await client.query('ALTER TABLE students RENAME COLUMN department TO usn;');
        // Add new subjects
        await client.query(`
            INSERT INTO subjects (subject_code, subject_name, credits, schedule) VALUES
            ('OS301', 'Operating Systems', 4, 'Mon/Wed 10:00 AM'),
            ('CN302', 'Computer Networks', 4, 'Tue/Thu 09:00 AM'),
            ('SE303', 'Software Engineering', 3, 'Fri 02:00 PM')
            ON CONFLICT (subject_code) DO NOTHING;
        `);
        console.log('Migration successful');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

migrate();
