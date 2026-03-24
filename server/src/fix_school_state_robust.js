const { Client } = require('pg');

const config = {
    user: 'admin',
    host: '3.65.142.85', // Direct IP
    database: 'snacksforthoughts_db',
    password: 'Nr8qRhxOph2KpblfHByccluv6ExubBng',
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
        checkServerIdentity: () => undefined
    }
};

async function main() {
    console.log('--- Updating AJOGAL School State (Robust) ---');
    const client = new Client(config);

    try {
        await client.connect();
        const res = await client.query(
            `UPDATE "School" SET "state" = 'Sokoto' WHERE "name" ILIKE '%AJOGAL PRIMARY SCHOOL%'`
        );
        console.log(`Updated ${res.rowCount} school(s).`);
    } catch (error) {
        console.error('Update Error:', error);
    } finally {
        await client.end();
    }
}

main();
