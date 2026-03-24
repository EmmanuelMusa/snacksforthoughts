import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const state = process.argv[2] || 'Lagos';
    console.log(`--- Listing Suppliers in ${state} ---`);
    
    const suppliers = await prisma.user.findMany({
        where: { 
            role: 'SUPPLIER',
            state: {
                equals: state,
                mode: 'insensitive'
            }
        },
        select: {
            id: true,
            name: true,
            email: true,
            state: true,
            companyName: true
        }
    });
    
    if (suppliers.length === 0) {
        console.log(`No suppliers found in ${state}.`);
    } else {
        console.table(suppliers);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
