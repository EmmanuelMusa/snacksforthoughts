import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

const banks = ["GTBank", "Zenith Bank", "Access Bank", "First Bank", "UBA"];
const getRand = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

async function main() {
    console.log("Starting supplier reset process...");

    // 1. Delete all existing suppliers and vendors
    console.log("Deleting old suppliers and vendors...");
    
    // First safely fetch all users (bypass enum constraints)
    const allUsers = await prisma.user.findMany({
        select: { id: true, role: true }
    });

    const oldSuppliers = allUsers.filter((u: any) => u.role === Role.SUPPLIER);
    const oldIds = oldSuppliers.map((u: any) => u.id);
    
    if (oldIds.length > 0) {
        let deleted = 0;
        let deactivated = 0;
        for (const id of oldIds) {
            try {
                await prisma.user.delete({ where: { id } });
                deleted++;
            } catch (e: any) {
                // If it fails (foreign key constraint), deactivate and change role
                await prisma.user.update({
                    where: { id },
                    data: { isActive: false, role: Role.DONOR }
                });
                deactivated++;
            }
        }
        console.log(`Deleted ${deleted} and deactivated ${deactivated} old suppliers/vendors.`);
    } else {
        console.log("No old suppliers found to remove.");
    }

    // 2. Use a static list of states instead of querying the DB to bypass network latency
    console.log("Using static list of states...");
    const states = [
        "ABIA", "ADAMAWA", "AKWA IBOM", "ANAMBRA", "BAUCHI", "BAYELSA", "BENUE", "BORNO",
        "CROSS RIVER", "DELTA", "EBONYI", "EDO", "EKITI", "ENUGU", "GOMBE", "IMO",
        "JIGAWA", "KADUNA", "KANO", "KATSINA", "KEBBI", "KOGI", "KWARA", "LAGOS",
        "NASARAWA", "NIGER", "OGUN", "ONDO", "OSUN", "OYO", "PLATEAU", "RIVERS",
        "SOKOTO", "TARABA", "YOBE", "ZAMFARA", "FCT"
    ];
    console.log(`Using ${states.length} unique states.`);

    // 3. Generate 3 to 4 dummy suppliers for each state
    console.log("Generating new dummy suppliers...");
    const newSuppliers = [];

    const companyPrefixes = ["Trust", "Global", "Naija", "Excel", "Prime", "Apex", "Nova", "Standard"];
    const companySuffixes = ["Ventures", "Foods", "Supplies", "Logistics", "Enterprises", "Nig Ltd"];
    
    for (const state of states) {
        const count = getRandInt(3, 4);
        
        for (let i = 0; i < count; i++) {
            const prefix = getRand(companyPrefixes);
            const suffix = getRand(companySuffixes);
            const companyName = `${state} ${prefix} ${suffix}`;
            const name = `Rep ${prefix}`;
            
            newSuppliers.push({
                name,
                email: `supplier_${state.replace(/\s+/g, '').toLowerCase()}_${i}@example.com`,
                role: Role.SUPPLIER,
                state,
                isActive: true,
                companyName,
                accountDetails: {
                    bankName: getRand(banks),
                    accountName: companyName,
                    accountNumber: `0${getRandInt(100000000, 999999999)}`,
                    swift: 'XXXNGLA'
                },
                contactInfo: {
                    phone: `080${getRandInt(10000000, 99999999)}`,
                    address: `No ${getRandInt(1, 100)}, Commercial Road, ${state}`,
                    specialties: ['Food Supplies', 'Educational Materials']
                }
            });
        }
    }

    // 4. Insert new suppliers
    let inserted = 0;
    for (const supplier of newSuppliers) {
        try {
            await (prisma.user as any).create({
                data: supplier
            });
            inserted++;
        } catch (e: any) {
            console.error(`Failed to insert supplier ${supplier.email}:`, e.message);
        }
    }
    
    console.log(`Successfully generated and inserted ${inserted} dummy suppliers across ${states.length} states!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
