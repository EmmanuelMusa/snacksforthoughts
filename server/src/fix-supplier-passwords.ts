import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Updating Supplier Passwords ---');
    const hash = await bcrypt.hash('password123', 10);
    
    const result = await prisma.user.updateMany({
        where: { role: 'SUPPLIER' },
        data: { passwordHash: hash }
    });
    
    console.log(`Success: Updated ${result.count} supplier(s) to password "password123"`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
