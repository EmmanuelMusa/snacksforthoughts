import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('--- Bulk Consolidating State Names ---')

        // Using executeRaw for performance and reliability on potentially large datasets/intermittent connections
        
        console.log('Standardizing School states...')
        await prisma.$executeRawUnsafe(`UPDATE "School" SET state = UPPER(TRIM(state))`)
        await prisma.$executeRawUnsafe(`UPDATE "School" SET state = 'AKWA IBOM' WHERE state = 'AKWA-IBOM'`)
        await prisma.$executeRawUnsafe(`UPDATE "School" SET state = 'CROSS RIVER' WHERE state = 'CROSS-RIVER'`)
        await prisma.$executeRawUnsafe(`UPDATE "School" SET state = 'FCT' WHERE state = 'FCT-ABUJA'`)

        console.log('Standardizing User states...')
        await prisma.$executeRawUnsafe(`UPDATE "User" SET state = UPPER(TRIM(state))`)
        await prisma.$executeRawUnsafe(`UPDATE "User" SET state = 'AKWA IBOM' WHERE state = 'AKWA-IBOM'`)
        await prisma.$executeRawUnsafe(`UPDATE "User" SET state = 'CROSS RIVER' WHERE state = 'CROSS-RIVER'`)
        await prisma.$executeRawUnsafe(`UPDATE "User" SET state = 'FCT' WHERE state = 'FCT-ABUJA'`)

        console.log('--- Bulk Consolidation Complete ---')

    } catch (error) {
        console.error('Bulk consolidation failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
