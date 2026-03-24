import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('--- Consolidating State Names ---')

        // 1. Helper to clean state names
        const cleanState = (state: string | null): string | null => {
            if (!state) return state
            // Trim, Uppercase, and replace common variations
            let s = state.trim().toUpperCase()
            // Fix Akwa Ibom/Akwa-Ibom
            if (s === 'AKWA-IBOM') s = 'AKWA IBOM'
            if (s === 'CROSS-RIVER') s = 'CROSS RIVER'
            if (s === 'FCT-ABUJA') s = 'FCT'
            return s
        }

        // 2. Process Schools
        const schools = await prisma.school.findMany({
            select: { id: true, state: true }
        })

        console.log(`Processing ${schools.length} schools...`)
        let schoolUpdates = 0
        for (const school of schools) {
            const cleaned = cleanState(school.state)
            if (cleaned !== school.state) {
                await prisma.school.update({
                    where: { id: school.id },
                    data: { state: cleaned }
                })
                schoolUpdates++
            }
        }
        console.log(`Updated ${schoolUpdates} schools.`)

        // 3. Process Users (Suppliers, etc.)
        const users = await prisma.user.findMany({
            select: { id: true, state: true }
        })

        console.log(`Processing ${users.length} users...`)
        let userUpdates = 0
        for (const user of users) {
            const cleaned = cleanState(user.state)
            if (cleaned !== user.state) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { state: cleaned }
                })
                userUpdates++
            }
        }
        console.log(`Updated ${userUpdates} users.`)

        console.log('--- Consolidation Complete ---')

    } catch (error) {
        console.error('Consolidation failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
