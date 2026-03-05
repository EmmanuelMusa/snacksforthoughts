"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
];
async function seedSuppliers() {
    try {
        console.log('Seeding suppliers...');
        for (const supplier of suppliers) {
            const existing = await prisma.supplier.findFirst({ where: { name: supplier.name } });
            if (existing) {
                await prisma.supplier.update({ where: { id: existing.id }, data: supplier });
            }
            else {
                await prisma.supplier.create({ data: supplier });
            }
        }
        console.log('Suppliers seeded successfully!');
    }
    catch (error) {
        console.error('Error seeding suppliers:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
seedSuppliers();
