const { Client } = require('pg');

const connectionString = 'postgresql://admin:Nr8qRhxOph2KpblfHByccluv6ExubBng@dpg-d6iplijh46gs73f2ng80-a.frankfurt-postgres.render.com/snacksforthoughts_db?sslmode=require';

const client = new Client({
    connectionString,
});

async function test() {
    console.log('Testing connection with pg driver...');
    try {
        await client.connect();
        console.log('Connection successful!');
        const res = await client.query('SELECT NOW()');
        console.log('Query result:', res.rows[0]);
    } catch (err) {
        console.error('Connection error:', err.message);
        console.error('Stack:', err.stack);
    } finally {
        await client.end();
    }
}

test();
