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
    console.log('--- Seeding Comprehensive Officials on Live DB ---');
    const client = new Client(config);

    try {
        await client.connect();
        
        const passwordHash = await bcrypt.hash('password123', 10);
        
        const officials = [
            { name: 'National Director', email: 'national@pbatfeeds.ng', nin: '90001112223', role: 'NATIONAL_CMD' },
            { name: 'Lagos Coordinator', email: 'lagos@pbatfeeds.ng', nin: '90001112224', role: 'STATE_CONTROL', state: 'Lagos' },
            { name: 'Ikeja Monitor', email: 'ikeja@pbatfeeds.ng', nin: '90001112225', role: 'LGA_MONITOR', state: 'Lagos', lga: 'Ikeja' },
            { name: 'Abuja Coordinator', email: 'fct@pbatfeeds.ng', nin: '90001112226', role: 'STATE_CONTROL', state: 'FCT' },
            { name: 'Primary School Reporter', email: 'report@pbatfeeds.ng', nin: '90001112227', role: 'SCHOOL_REPORTER', state: 'Lagos', lga: 'Ikeja', schoolId: 'clw1z2x3y4z5a6' } 
        ];

        // Get a real school ID if possible
        const schoolRes = await client.query('SELECT id FROM "School" LIMIT 1');
        const realSchoolId = schoolRes.rows[0]?.id;
        if (realSchoolId) {
            officials[4].schoolId = realSchoolId;
        }

        for (const off of officials) {
            await client.query(
                `INSERT INTO "User" (id, name, email, nin, role, "passwordHash", state, lga, "schoolId", "updatedAt") 
                 VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, NOW())
                 ON CONFLICT (nin) DO UPDATE SET 
                    role = EXCLUDED.role, 
                    "passwordHash" = EXCLUDED."passwordHash",
                    state = EXCLUDED.state,
                    lga = EXCLUDED.lga,
                    "schoolId" = EXCLUDED."schoolId",
                    "updatedAt" = NOW()`,
                [off.name, off.email, off.nin, off.role, passwordHash, off.state || null, off.lga || null, off.schoolId || null]
            );
            console.log(`Synced Global Official: ${off.name} | NIN: ${off.nin}`);
        }

        console.log('--- Sync complete ---');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

main();
