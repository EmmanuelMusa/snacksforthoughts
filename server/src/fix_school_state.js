const { Client } = require('pg');

const connectionString = 'postgresql://admin:Nr8qRhxOph2KpblfHByccluv6ExubBng@3.65.142.85/snacksforthoughts_db?ssl=true&sslmode=require';

async function main() {
    console.log('--- Updating AJOGAL School State ---');
    const client = new Client({ 
        connectionString,
        ssl: { rejectUnauthorized: false, checkServerIdentity: () => undefined }
    });

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
