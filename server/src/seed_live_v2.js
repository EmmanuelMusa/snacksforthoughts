const { Client } = require('pg');

// Standard connection parameters for the Render database
const config = {
    user: 'admin',
    host: '3.65.142.85', // Using direct IP to bypass DNS EAI_AGAIN errors
    database: 'snacksforthoughts_db',
    password: 'Nr8qRhxOph2KpblfHByccluv6ExubBng',
    port: 5432,
    ssl: {
        rejectUnauthorized: false, // Critical for Render Postgres
        checkServerIdentity: () => {
            // Simply return undefined to skip hostname verification against the cert altnames
            return undefined;
        }
    }
};

async function main() {
    console.log('--- Starting Live Seeding Phase 2 (Robust PG) ---');
    const client = new Client(config);

    try {
        await client.connect();
        console.log('Connected to database successfully.');

        // 1. Create Officials
        console.log('Populating System Officials...');
        const officials = [
            { name: 'National Director', email: 'national@pbatfeeds.ng', nin: '90001112223', role: 'NATIONAL_CMD', passwordHash: 'hashed_pass' },
            { name: 'Lagos State Coordinator', email: 'lagos@pbatfeeds.ng', nin: '90001112224', role: 'STATE_CONTROL', state: 'Lagos', passwordHash: 'hashed_pass' },
            { name: 'Ikeja LGA Monitor', email: 'ikeja@pbatfeeds.ng', nin: '90001112225', role: 'LGA_MONITOR', state: 'Lagos', lga: 'Ikeja', passwordHash: 'hashed_pass' },
            { name: 'Abuja FCT Coordinator', email: 'fct@pbatfeeds.ng', nin: '90001112226', role: 'STATE_CONTROL', state: 'FCT', passwordHash: 'hashed_pass' }
        ];

        for (const off of officials) {
            await client.query(
                `INSERT INTO "User" (id, name, email, nin, role, "passwordHash", state, lga, "updatedAt") 
                 VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, NOW())
                 ON CONFLICT (nin) DO NOTHING`,
                [off.name, off.email, off.nin, off.role, off.passwordHash, off.state || null, off.lga || null]
            );
        }

        // 2. Create Farmers
        console.log('Populating Farmers...');
        const farmers = [
            { name: 'Mallam Yusuf', email: 'yusuf@farm.ng', nin: '80001112221', role: 'FARMER', passwordHash: 'hashed_pass', state: 'Kano' },
            { name: 'Emeka Okafor', email: 'emeka@farm.ng', nin: '80001112222', role: 'FARMER', passwordHash: 'hashed_pass', state: 'Enugu' },
            { name: 'Segun Ade', email: 'segun@farm.ng', nin: '80001112223', role: 'FARMER', passwordHash: 'hashed_pass', state: 'Ogun' }
        ];
        for (const f of farmers) {
            await client.query(
                `INSERT INTO "User" (id, name, email, nin, role, "passwordHash", state, "updatedAt") 
                 VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, NOW())
                 ON CONFLICT (nin) DO NOTHING`,
                [f.name, f.email, f.nin, f.role, f.passwordHash, f.state]
            );
        }

        // 3. Create Vendors
        console.log('Populating Vendors...');
        const vendors = [
            { name: 'Mama Cassie Catering', nin: '70001112221', contact: '08012345678', category: 'Catering' },
            { name: 'Northern Delights', nin: '70001112222', contact: '08087654321', category: 'Aggregator' }
        ];
        for (const v of vendors) {
            await client.query(
                `INSERT INTO "Vendor" (id, name, nin, contact, category, verified, "hygieneCertified", "updatedAt") 
                 VALUES (gen_random_uuid()::text, $1, $2, $3, $4, true, true, NOW())
                 ON CONFLICT (nin) DO NOTHING`,
                [v.name, v.nin, v.contact, v.category]
            );
        }

        // 4. Create School Reports
        console.log('Generating Feeding Reports...');
        const schoolsRes = await client.query('SELECT id FROM "School" LIMIT 50');
        const targetSchools = schoolsRes.rows;
        
        if (targetSchools.length > 0) {
            const today = new Date();
            for (let i = 0; i < 7; i++) {
                const date = new Date();
                date.setDate(today.getDate() - i);
                
                for (const school of targetSchools) {
                    await client.query(
                        `INSERT INTO "SchoolReport" (id, "schoolId", "pupilsFedToday", "menuServed", "vendorName", "qualityScore", "createdAt", "updatedAt") 
                         VALUES (gen_random_uuid()::text, $1, $2, $3, $4, 5, $5, NOW())`,
                        [school.id, Math.floor(Math.random() * 200) + 150, i % 2 === 0 ? 'Rice & Beans' : 'Yam & Egg', vendors[Math.floor(Math.random() * vendors.length)].name, date]
                    );
                }
            }
        }

        // 5. Create Financial Records
        console.log('Populating Financial Audit Log...');
        const financialRecords = [
            { amount: 500000000, category: 'Vendor payments', description: 'Q1 Batch A Vendor Settlements' },
            { amount: 150000000, category: 'Logistics', description: 'Monthly Distribution Costs' },
            { amount: 1000000000, category: 'Monitoring', description: 'State-Level Monitoring Grant' }
        ];
        for (const rev of financialRecords) {
            await client.query(
                `INSERT INTO "FinancialRecord" (id, amount, category, description, "updatedAt") 
                 VALUES (gen_random_uuid()::text, $1, $2, $3, NOW())`,
                [rev.amount, rev.category, rev.description]
            );
        }

        // 6. Create Safety Reports
        console.log('Populating Safety & Quality Inspections...');
        for (const school of targetSchools.slice(0, 10)) {
            await client.query(
                `INSERT INTO "SafetyReport" (id, type, description, status, "targetId", "updatedAt") 
                 VALUES (gen_random_uuid()::text, 'inspection', 'Kitchen hygiene and food quality standards met.', 'pass', $1, NOW())`,
                [school.id]
            );
        }

        console.log('--- Live Seeding Complete Successfully ---');
    } catch (error) {
        console.error('Seeding Error:', error);
    } finally {
        await client.end();
    }
}

main();
