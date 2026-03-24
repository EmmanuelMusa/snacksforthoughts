import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Fixing admin account on live DB...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Force-update the admin password
    const admin = await prisma.user.upsert({
        where: { email: 'admin@pbatfeeds.ng' },
        update: {
            passwordHash: hashedPassword,
            isActive: true
        },
        create: {
            name: 'National Admin',
            email: 'admin@pbatfeeds.ng',
            passwordHash: hashedPassword,
            role: 'ADMIN' as any,
            isActive: true,
            contactInfo: { phone: '08000000000' }
        } as any
    });

    console.log(`Admin updated: ${admin.email} (role: ${admin.role})`);

    // Also ensure the donor test account exists
    await prisma.user.upsert({
        where: { email: 'donor.one@gmail.com' },
        update: { passwordHash: hashedPassword },
        create: {
            name: 'Test Donor',
            email: 'donor.one@gmail.com',
            passwordHash: hashedPassword,
            role: 'DONOR' as any
        } as any
    });
    console.log('Donor account ensured.');

    // Print supplier count per state to verify seeding
    const suppliers = await (prisma.user as any).groupBy({
        by: ['state'],
        where: { role: 'SUPPLIER' as any },
        _count: { id: true }
    });
    console.log(`\nSuppliers by state (sample):`);
    suppliers.slice(0, 5).forEach((s: any) => console.log(`  ${s.state}: ${s._count.id}`));
    console.log(`Total states with suppliers: ${suppliers.length}`);
}

main()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect());
