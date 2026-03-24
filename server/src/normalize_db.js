const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Normalizing User states and LGAs to UPPERCASE...');
    
    const users = await prisma.user.findMany({
        select: { id: true, state: true, lga: true }
    });
    
    let count = 0;
    for (const user of users) {
        const newState = user.state?.toUpperCase();
        const newLga = user.lga?.toUpperCase();
        
        if (newState !== user.state || newLga !== user.lga) {
            await prisma.user.update({
                where: { id: user.id },
                data: { 
                    state: newState,
                    lga: newLga
                }
            });
            count++;
        }
    }
    
    console.log(`Updated ${count} users.`);

    // Also normalize Schools just in case
    console.log('Normalizing School states and LGAs to UPPERCASE...');
    const schools = await prisma.school.findMany({
        select: { id: true, state: true, lga: true }
    });
    
    let sCount = 0;
    for (const school of schools) {
        const newState = school.state?.toUpperCase();
        const newLga = school.lga?.toUpperCase();
        
        if (newState !== school.state || newLga !== school.lga) {
            await prisma.school.update({
                where: { id: school.id },
                data: { 
                    state: newState,
                    lga: newLga
                }
            });
            sCount++;
        }
    }
    console.log(`Updated ${sCount} schools.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
