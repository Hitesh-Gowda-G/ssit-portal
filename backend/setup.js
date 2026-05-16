const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const schemaPath = path.join(__dirname, 'models', 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function setup() {
    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('Executing schema...');
        await client.query(schema);
        console.log('Database setup complete!');
    } catch (err) {
        console.error('Error during setup:', err);
    } finally {
        await client.end();
    }
}

setup();
