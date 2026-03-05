import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const schools = [
    {
        name: 'Sunrise Primary School',
        location: 'Alausa, Ikeja, Lagos',
        needType: 'Breakfast Program',
        description: 'A primary school in Lagos that needs support for its breakfast program to ensure students have nutritious meals.',
        targetAmount: 200000,
        raisedAmount: 45000,
        studentCount: 150,
        state: 'Lagos',
        lga: 'Ikeja',
        ward: 'Alausa',
        email: 'info@sunriseprimary.edu.ng',
        phone: '+234 800 123 4567',
        address: '123 Education Street, Alausa, Lagos'
    },
    {
        name: 'Unity Primary School',
        location: 'Opebi, Ikeja, Lagos',
        needType: 'Breakfast Program',
        description: 'A community school that provides quality education and needs support for student nutrition.',
        targetAmount: 150000,
        raisedAmount: 60000,
        studentCount: 120,
        state: 'Lagos',
        lga: 'Ikeja',
        ward: 'Opebi',
        email: 'contact@unityprimary.edu.ng',
        phone: '+234 800 234 5678',
        address: '456 Unity Road, Opebi, Lagos'
    },
    {
        name: 'Greenfield School',
        location: 'Sabo, Yaba, Lagos',
        needType: 'Breakfast Program',
        description: 'An innovative school focused on holistic education and student well-being.',
        targetAmount: 100000,
        raisedAmount: 25000,
        studentCount: 80,
        state: 'Lagos',
        lga: 'Yaba',
        ward: 'Sabo',
        email: 'admin@greenfield.edu.ng',
        phone: '+234 800 345 6789',
        address: '789 Greenfield Avenue, Sabo, Lagos'
    },
    {
        name: 'Harmony Primary School',
        location: 'Ijeun, Abeokuta South, Ogun',
        needType: 'Breakfast Program',
        description: 'A rural school that serves the local community and needs support for student nutrition.',
        targetAmount: 120000,
        raisedAmount: 10000,
        studentCount: 90,
        state: 'Ogun',
        lga: 'Abeokuta South',
        ward: 'Ijeun',
        email: 'harmony@school.edu.ng',
        phone: '+234 800 456 7890',
        address: '321 Harmony Street, Ijeun, Abeokuta'
    },
    {
        name: 'Bright Future Academy',
        location: 'Oke-Ona, Abeokuta North, Ogun',
        needType: 'Breakfast Program',
        description: 'A forward-thinking school preparing students for the future with modern facilities.',
        targetAmount: 300000,
        raisedAmount: 75000,
        studentCount: 200,
        state: 'Ogun',
        lga: 'Abeokuta North',
        ward: 'Oke-Ona',
        email: 'info@brightfuture.edu.ng',
        phone: '+234 800 567 8901',
        address: '654 Future Road, Oke-Ona, Abeokuta'
    },
    {
        name: 'Riverside Elementary',
        location: 'D-Line, Port Harcourt, Rivers',
        needType: 'Breakfast Program',
        description: 'A coastal school that provides education to children in the Port Harcourt area.',
        targetAmount: 250000,
        raisedAmount: 50000,
        studentCount: 180,
        state: 'Rivers',
        lga: 'Port Harcourt',
        ward: 'D-Line',
        email: 'riverside@school.edu.ng',
        phone: '+234 800 678 9012',
        address: '987 Riverside Drive, D-Line, Port Harcourt'
    }
]

async function seedSchools() {
    try {
        console.log('Seeding schools...')

        for (const school of schools) {
            const existing = await prisma.school.findFirst({ where: { name: school.name } })
            if (existing) {
                await prisma.school.update({ where: { id: existing.id }, data: school })
            } else {
                await prisma.school.create({ data: school })
            }
        }

        console.log('Schools seeded successfully!')
    } catch (error) {
        console.error('Error seeding schools:', error)
    } finally {
        await prisma.$disconnect()
    }
}

seedSchools()
