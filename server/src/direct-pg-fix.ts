import { Client } from 'pg'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
    console.log('--- Direct Password Reset (using pg) ---')
    const connectionString = process.env.DATABASE_URL
    const client = new Client({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    })

    try {
        await client.connect()
        console.log('Connected to DB successfully.')

        const password = 'password123'
        const hashedPassword = await bcrypt.hash(password, 10)
        
        console.log(`Updating passwords for suppliers...`)
        const res = await client.query('UPDATE "User" SET "passwordHash" = $1 WHERE role = $2', [hashedPassword, 'SUPPLIER'])
        console.log(`Successfully updated ${res.rowCount} suppliers.`)

    } catch (err) {
        console.error('Connection/Update failed:', err)
    } finally {
        await client.end()
    }
}

main()
