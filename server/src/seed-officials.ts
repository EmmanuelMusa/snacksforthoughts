import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log("Seeding dashboard officials...")

    const roles = [
        { role: Role.ADMIN, name: 'National Commander', nin: '11111111111' },
        { role: Role.ADMIN, name: 'State Controller (Lagos)', nin: '22222222222', state: 'Lagos' },
        { role: Role.VERIFIER, name: 'LGA Monitor (Ikeja)', nin: '33333333333', state: 'Lagos', lga: 'Ikeja' },
        { role: Role.VERIFIER, name: 'School Reporter', nin: '44444444444' }
    ]

    const passwordHash = await bcrypt.hash('password123', 10)

    for (const data of roles) {
        // use upsert to create or update
        await prisma.user.upsert({
            where: { nin: data.nin },
            update: {
                role: data.role,
                state: data.state,
                lga: data.lga,
                passwordHash
            },
            create: {
                name: data.name,
                nin: data.nin,
                passwordHash,
                role: data.role,
                state: data.state,
                lga: data.lga
            }
        })
        console.log(`Created user: ${data.name} | NIN: ${data.nin} | Password: password123 | Role: ${data.role}`)
    }

    console.log("Seeding complete.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
