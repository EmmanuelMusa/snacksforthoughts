const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('password123', 10);
    
    // 1. Get a specific school in Ikeja, Lagos
    const ikejaSchool = await prisma.school.findFirst({
        where: { lga: 'IKEJA', state: 'LAGOS' }
    });
    
    if (!ikejaSchool) {
        console.error("Could not find a school in Ikeja, Lagos. Please run seeds first.");
        return;
    }

    console.log(`Using School: ${ikejaSchool.name} (${ikejaSchool.id})`);

    // 2. Define our standard test users
    const testUsers = [
        {
            email: 'national@pbatfeeds.ng',
            name: 'National Director',
            role: 'NATIONAL_CMD',
            nin: '90001112223',
            state: null,
            lga: null,
            schoolId: null
        },
        {
            email: 'lagos@pbatfeeds.ng',
            name: 'Lagos State Coordinator',
            role: 'STATE_CONTROL',
            nin: '90001112224',
            state: 'LAGOS',
            lga: null,
            schoolId: null
        },
        {
            email: 'ikeja@pbatfeeds.ng',
            name: 'Ikeja LGA Monitor',
            role: 'LGA_MONITOR',
            nin: '90001112225',
            state: 'LAGOS',
            lga: 'IKEJA',
            schoolId: null
        },
        {
            email: 'report@pbatfeeds.ng',
            name: 'Ikeja School Reporter',
            role: 'SCHOOL_REPORTER',
            nin: '90001112227',
            state: 'LAGOS',
            lga: 'IKEJA',
            schoolId: ikejaSchool.id
        }
    ];

    for (const u of testUsers) {
        await prisma.user.upsert({
            where: { nin: u.nin },
            update: {
                email: u.email,
                name: u.name,
                role: u.role,
                state: u.state,
                lga: u.lga,
                schoolId: u.schoolId,
                passwordHash: passwordHash,
                isActive: true
            },
            create: {
                nin: u.nin,
                email: u.email,
                name: u.name,
                role: u.role,
                state: u.state,
                lga: u.lga,
                schoolId: u.schoolId,
                passwordHash: passwordHash,
                isActive: true
            }
        });
        console.log(`Updated/Created user: ${u.email} (${u.role})`);
    }

    console.log("Test environment setup complete.");
}

main()
    .catch(console.error)
    .finally(async () => { await prisma.$disconnect(); });
