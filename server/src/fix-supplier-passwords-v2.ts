import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('--- Fixing Supplier Passwords (v2) ---')
        const password = 'password123'
        const hashedPassword = await bcrypt.hash(password, 10)
        
        // Verify hash immediately
        const isValid = await bcrypt.compare(password, hashedPassword)
        console.log(`Test verification for '${password}': ${isValid ? 'PASSED' : 'FAILED'}`)
        
        if (!isValid) throw new Error('Hash verification failed!')

        const result = await prisma.user.updateMany({
            where: { role: 'SUPPLIER' },
            data: { passwordHash: hashedPassword }
        })

        console.log(`Success: Updated ${result.count} supplier(s) to password "${password}"`)
        
    } catch (error) {
        console.error('Migration failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
