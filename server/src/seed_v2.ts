import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NIGERIAN_STATES } from './constants';

const prisma = new PrismaClient();

const firstNames = ["Emeka", "Amina", "Tunde", "Fatimah", "Chidi", "Ngozi", "Abubakar", "Ifeanyi", "Zainab", "Olumide", "Kalu", "Boma", "Yusuf", "Chioma", "Dayo", "Halima", "Uche", "Funke", "Musa", "Ada"];
const lastNames = ["Okoro", "Bello", "Adeyemi", "Ibrahim", "Nwosu", "Danjuma", "Balogun", "Obi", "Usman", "Sowore", "Gbadamosi", "Nnaji", "Abdullahi", "Oni", "Ojo", "Idris"];
const companySuffixes = ["Global", "Ventures", "Nig Ltd", "Enterprises", "Solutions", "Integrated Services", "Agro-Allied"];

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const generateName = () => `${getRandom(firstNames)} ${getRandom(lastNames)}`;
const generateCompany = (state: string) => `${state} ${getRandom(lastNames)} ${getRandom(companySuffixes)}`;

const supplierSpecialties = [
    ["Rice", "Beans", "Garri", "Yam"],
    ["Milk", "Eggs", "Cereals", "Beverages"],
    ["Fruits", "Vegetables", "Plantains"],
    ["Biscuits", "Juices", "Snacks"],
    ["Fish", "Meat", "Poultry"],
    ["Local Grains", "Sorghum", "Millet"]
];

const bankNames = ["Access Bank", "GTBank", "Zenith Bank", "UBA", "First Bank", "Fidelity Bank", "Stanbic IBTC"];

async function main() {
    console.log('🌱 Starting V2 Database Seed: Donor-to-School Platform...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 0. Cleanup existing mock data (Keep schools and admins)
    console.log('🧹 Cleaning up previous mock data...');
    await (prisma as any).supplyRequest.deleteMany({});
    await prisma.user.deleteMany({
        where: {
            role: { in: ['SUPPLIER', 'VERIFIER', 'DONOR'] as any }
        }
    });

    // 1. Create Super Admin
    console.log('👤 Creating Super Admin...');
    const adminData: any = {
        name: 'National Admin',
        email: 'admin@pbatfeeds.ng',
        passwordHash: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        contactInfo: { phone: '08000000000' }
    };

    await prisma.user.upsert({
        where: { email: 'admin@pbatfeeds.ng' },
        update: {},
        create: adminData
    });

    // 2. Fetch schools
    console.log('🏫 Fetching schools for Verifier assignment...');
    const allSchools = await prisma.school.findMany();
    if (allSchools.length === 0) {
        console.warn('⚠️ No schools found in database!');
    }

    const schoolsByState: Record<string, any[]> = {};
    for (const school of allSchools) {
        const state = school.state?.toUpperCase() || 'LAGOS';
        if (!schoolsByState[state]) schoolsByState[state] = [];
        schoolsByState[state].push(school);
    }

    // 3. Create Suppliers & Verifiers per State
    let totalSuppliers = 0;
    let totalVerifiers = 0;
    const suppliersByState: Record<string, string[]> = {};

    for (const stateName of NIGERIAN_STATES) {
        const sNameUpper = stateName.toUpperCase();
        suppliersByState[sNameUpper] = [];
        const stateSchools = schoolsByState[sNameUpper] || [];

        // Create 4-6 Suppliers per state
        const supplierCount = 4 + Math.floor(Math.random() * 3);
        for (let i = 1; i <= supplierCount; i++) {
            const specialties = getRandom(supplierSpecialties);
            const bankName = getRandom(bankNames);
            const accNum = Math.floor(1000000000 + Math.random() * 9000000000).toString();
            
            const supplierCompanyName = generateCompany(stateName);
            const managerName = generateName();

            const supplierData: any = {
                name: managerName,
                email: `supplier.${sNameUpper.toLowerCase()}.${i}@pbatfeeds.ng`,
                passwordHash: hashedPassword,
                role: 'SUPPLIER',
                state: sNameUpper,
                companyName: supplierCompanyName,
                accountDetails: {
                    bankName,
                    accountNumber: accNum,
                    accountName: supplierCompanyName,
                    swift: "XXXNGLA"
                },
                contactInfo: {
                    phone: '080' + Math.floor(10000000 + Math.random() * 90000000).toString(),
                    address: `No ${Math.floor(Math.random() * 50) + 1}, Commercial Road, ${stateName}`,
                    specialties
                }
            };

            const supplier = await prisma.user.create({ data: supplierData });
            suppliersByState[sNameUpper].push(supplier.id);
            totalSuppliers++;
        }

        // Create 3-4 Verifiers per state
        const verifierCount = 3 + Math.floor(Math.random() * 2);
        for (let j = 1; j <= verifierCount; j++) {
            let schoolId = null;
            if (stateSchools.length > 0) {
                const randSchool = getRandom(stateSchools);
                schoolId = randSchool.id;
            }

            const verifierData: any = {
                name: generateName(),
                email: `verifier.${sNameUpper.toLowerCase()}.${j}@pbatfeeds.ng`,
                passwordHash: hashedPassword,
                role: 'VERIFIER',
                state: sNameUpper,
                schoolId: schoolId,
                contactInfo: { phone: '080' + Math.floor(10000000 + Math.random() * 90000000).toString() }
            };

            await prisma.user.create({ data: verifierData });
            totalVerifiers++;
        }
    }

    console.log(`✅ Created ${totalSuppliers} Suppliers and ${totalVerifiers} Verifiers globally.`);

    // 4. Create Mock Donors and Supply Requests
    if (allSchools.length > 0) {
        console.log('🎁 Creating Mock Donors and Supply Requests...');
        
        const donor1 = await prisma.user.create({
            data: {
                name: generateName(),
                email: 'donor.one@gmail.com',
                passwordHash: hashedPassword,
                role: 'DONOR' as any
            } as any
        });
        const donor2 = await prisma.user.create({
            data: {
                name: `${getRandom(lastNames)} Holdings Ltd`,
                email: 'donor.corporate@gmail.com',
                passwordHash: hashedPassword,
                role: 'DONOR' as any
            } as any
        });
        
        const donors = [donor1.id, donor2.id];
        const periods = ["Term 3, 2026", "Term 1, 2026", "Term 2, 2027"];
        const statuses = ["PENDING_PAYMENT", "PAYMENT_CONFIRMED", "DELIVERED", "VERIFIED"];

        let mockCount = 0;
        for (let k = 0; k < 150; k++) {
            const school = getRandom(allSchools);
            const state = school.state?.toUpperCase() || 'LAGOS';
            const stateSuppliers = suppliersByState[state];
            if (!stateSuppliers || stateSuppliers.length === 0) continue;
            
            const supplierId = getRandom(stateSuppliers);
            const donorId = getRandom(donors);
            const status = getRandom(statuses);

            const items = [
                { name: "Biscuit", price: 300, totalCost: 300 * (school.studentCount || 200) * 5 },
                { name: "Juice", price: 500, totalCost: 500 * (school.studentCount || 200) * 5 }
            ];

            await (prisma as any).supplyRequest.create({
                data: {
                    donorId,
                    schoolId: school.id,
                    supplierId,
                    academicPeriod: getRandom(periods),
                    items: items,
                    status: status as any,
                    proofImageUrl: status === 'VERIFIED' ? '/images/children_in_a_classroom_in_nigeria_smiling.jpeg' : null
                }
            });
            mockCount++;
        }
        console.log(`✅ Created ${mockCount} mock Supply Requests.`);
    }

    console.log('🎉 Seed V2 completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error during V2 seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
