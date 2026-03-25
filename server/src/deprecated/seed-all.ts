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

const suppliers = [
    {
        name: 'Nasco Foods',
        description: 'Leading food and beverage company specializing in nutritious snacks for children',
        specialties: ['Biscuits', 'Cereals', 'Juices', 'Healthy Snacks'],
        rating: 4.8,
        deliveryAreas: ['Lagos', 'Ogun', 'Rivers', 'Abuja'],
        accountDetails: {
            bankName: 'First Bank of Nigeria',
            accountNumber: '1234567890',
            accountName: 'Nasco Foods Limited'
        },
        contactInfo: {
            phone: '+234 800 NASCO',
            email: 'orders@nasco.com.ng'
        },
        verified: true
    },
    {
        name: 'Chivita Company',
        description: 'Premium juice and beverage manufacturer with focus on child nutrition',
        specialties: ['Fruit Juices', 'Healthy Drinks', 'Vitamin-Enriched Beverages'],
        rating: 4.6,
        deliveryAreas: ['Lagos', 'Ogun', 'Rivers', 'Kano', 'Abuja'],
        accountDetails: {
            bankName: 'Guaranty Trust Bank',
            accountNumber: '0987654321',
            accountName: 'Chivita Company Limited'
        },
        contactInfo: {
            phone: '+234 800 CHIVITA',
            email: 'schools@chivita.com.ng'
        },
        verified: true
    },
    {
        name: 'Cadbury Nigeria',
        description: 'Confectionery and beverage company with nutritious snack options for schools',
        specialties: ['Biscuits', 'Chocolate Drinks', 'Cereals', 'Energy Bars'],
        rating: 4.7,
        deliveryAreas: ['Lagos', 'Ogun', 'Rivers', 'Abuja', 'Kaduna'],
        accountDetails: {
            bankName: 'Access Bank',
            accountNumber: '1122334455',
            accountName: 'Cadbury Nigeria Plc'
        },
        contactInfo: {
            phone: '+234 800 CADBURY',
            email: 'csr@cadbury.com.ng'
        },
        verified: true
    },
    {
        name: 'NutriKids Supplies',
        description: 'Local supplier specializing in fresh, nutritious snacks for school children',
        specialties: ['Fresh Fruits', 'Local Snacks', 'Traditional Foods', 'Custom Meals'],
        rating: 4.5,
        deliveryAreas: ['Lagos', 'Ogun'],
        accountDetails: {
            bankName: 'Zenith Bank',
            accountNumber: '5566778899',
            accountName: 'NutriKids Supplies Limited'
        },
        contactInfo: {
            phone: '+234 803 123 4567',
            email: 'info@nutrikids.ng'
        },
        verified: true
    }
]

async function seedAll() {
    try {
        console.log('🌱 Starting database seeding...')

        // Seed Schools
        console.log('📚 Seeding schools...')
        for (const school of schools) {
            const existing = await prisma.school.findFirst({ where: { name: school.name } })
            if (existing) {
                await prisma.school.update({ where: { id: existing.id }, data: school })
            } else {
                await prisma.school.create({ data: school })
            }
        }
        console.log(`✅ Seeded ${schools.length} schools`)

        // Seed Suppliers
        console.log('🏪 Seeding suppliers...')
        for (const supplier of suppliers) {
            const existing = await prisma.supplier.findFirst({ where: { name: supplier.name } })
            if (existing) {
                await prisma.supplier.update({ where: { id: existing.id }, data: supplier })
            } else {
                await prisma.supplier.create({ data: supplier })
            }
        }
        console.log(`✅ Seeded ${suppliers.length} suppliers`)

        console.log('🎉 Database seeding completed successfully!')
    } catch (error) {
        console.error('❌ Error seeding database:', error)
    } finally {
        await prisma.$disconnect()
    }
}

seedAll()
