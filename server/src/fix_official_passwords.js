const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const config = {
    user: 'admin',
    host: '3.65.142.85',
    database: 'snacksforthoughts_db',
    password: 'Nr8qRhxOph2KpblfHByccluv6ExubBng',
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
        checkServerIdentity: () => undefined
    }
};

async function main() {
    console.log('--- Fixing Official Passwords on Live DB ---');
    const client = new Client(config);

    try {
        await client.connect();
        
        const passwordHash = await bcrypt.hash('password123', 10);
        console.log('Generated new hash for "password123"');

        const nins = ['90001112223', '90001112224', '90001112225', '90001112226'];
        
        for (const nin of nins) {
            const result = await client.query(
                'UPDATE "User" SET "passwordHash" = $1 WHERE nin = $2',
                [passwordHash, nin]
            );
            console.log(`Updated NIN ${nin}: ${result.rowCount} rows affected`);
        }

        console.log('--- Password fix complete ---');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

main();
