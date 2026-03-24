import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function diagnose() {
    try {
        console.log('--- Diagnosis: Lagos Schools vs Suppliers ---')
        
        // 1. Get all unique states from Schools
        const schoolStates = await prisma.school.findMany({
            select: { state: true },
            distinct: ['state']
        })
        console.log('School States in DB:', schoolStates.map(s => `'${s.state}'`))

        // 2. Get all unique states from Suppliers
        const supplierStates = await prisma.user.findMany({
            where: { role: 'SUPPLIER' },
            select: { state: true },
            distinct: ['state']
        })
        console.log('Supplier States in DB:', supplierStates.map(s => `'${s.state}'`))

        // 3. Check for Lagos specifically
        const lagosSchools = await prisma.school.findMany({
            where: { state: { contains: 'Lagos', mode: 'insensitive' } },
            select: { name: true, state: true },
            take: 5
        })
        console.log('Sample Lagos Schools:', lagosSchools)

        const lagosSuppliers = await prisma.user.findMany({
            where: { 
                role: 'SUPPLIER',
                state: { contains: 'Lagos', mode: 'insensitive' } 
            },
            select: { name: true, state: true, isActive: true }
        })
        console.log('Lagos Suppliers:', lagosSuppliers)

        // 4. Test the exact query used in donors.ts
        const testState = lagosSchools[0]?.state
        if (testState) {
            console.log(`Testing exact match for state: '${testState}'`)
            const matchedSuppliers = await prisma.user.findMany({
                where: {
                    state: {
                        equals: testState,
                        mode: 'insensitive'
                    },
                    isActive: true,
                    role: 'SUPPLIER'
                }
            })
            console.log(`Matched Suppliers for '${testState}':`, matchedSuppliers.length)
        }

    } catch (error) {
        console.error('Diagnosis failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

diagnose()
