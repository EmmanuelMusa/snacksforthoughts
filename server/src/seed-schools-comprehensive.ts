import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Available school images from the images folder
const schoolImages = [
    '/images/a_school_in_nigeria.jpeg',
    '/images/a_school_in_nigeria (1).jpeg',
    '/images/a_school_in_nigeria (2).jpeg',
    '/images/a_school_in_nigeria (3).jpeg',
    '/images/children_in_a_classroom_in_nigeria_smiling.jpeg'
]

// Sample school data with comprehensive information
const schoolsData = [
    {
        name: 'Sunrise Primary School',
        location: 'Ikeja, Lagos',
        state: 'Lagos',
        lga: 'Ikeja',
        ward: 'Ikeja Ward',
        address: '123 Education Street, Ikeja',
        phone: '+234 800 SUNRISE',
        email: 'sunrise@school.com',
        principalName: 'Mrs. Adebayo Johnson',
        schoolType: 'Primary',
        studentCount: 150,
        targetAmount: 100000,
        raisedAmount: 45000,
        needs: ['Breakfast Programs', 'Educational Materials', 'Infrastructure'],
        description: 'A vibrant primary school committed to providing quality education to children in Ikeja community.',
        image: schoolImages[0]
    },
    {
        name: 'Unity Primary School',
        location: 'Surulere, Lagos',
        state: 'Lagos',
        lga: 'Surulere',
        ward: 'Surulere Ward',
        address: '456 Unity Road, Surulere',
        phone: '+234 800 UNITY',
        email: 'unity@school.com',
        principalName: 'Mr. Michael Okafor',
        schoolType: 'Primary',
        studentCount: 160,
        targetAmount: 120000,
        raisedAmount: 80000,
        needs: ['Breakfast Programs', 'Teacher Training', 'Digital Learning'],
        description: 'Promoting unity and excellence in education through innovative teaching methods.',
        image: schoolImages[1]
    },
    {
        name: 'Greenfield School',
        location: 'Victoria Island, Lagos',
        state: 'Lagos',
        lga: 'Victoria Island',
        ward: 'VI Ward',
        address: '789 Greenfield Avenue, VI',
        phone: '+234 800 GREENFIELD',
        email: 'greenfield@school.com',
        principalName: 'Dr. Sarah Williams',
        schoolType: 'Secondary',
        studentCount: 200,
        targetAmount: 150000,
        raisedAmount: 20000,
        needs: ['Breakfast Programs', 'Digital Learning', 'Infrastructure', 'Science Lab'],
        description: 'A modern secondary school focused on STEM education and technological advancement.',
        image: schoolImages[2]
    },
    {
        name: 'Harmony Primary School',
        location: 'Garki, Abuja',
        state: 'Abuja',
        lga: 'Garki',
        ward: 'Garki Ward',
        address: '321 Harmony Street, Garki',
        phone: '+234 800 HARMONY',
        email: 'harmony@school.com',
        principalName: 'Mrs. Fatima Ibrahim',
        schoolType: 'Primary',
        studentCount: 200,
        targetAmount: 140000,
        raisedAmount: 100000,
        needs: ['Breakfast Programs', 'Educational Materials', 'Library'],
        description: 'Creating harmony in learning through inclusive education and community engagement.',
        image: schoolImages[3]
    },
    {
        name: 'Bright Future Academy',
        location: 'Nassarawa, Kano',
        state: 'Kano',
        lga: 'Nassarawa',
        ward: 'Nassarawa Ward',
        address: '654 Future Road, Nassarawa',
        phone: '+234 800 BRIGHT',
        email: 'brightfuture@school.com',
        principalName: 'Alhaji Yusuf Mohammed',
        schoolType: 'Primary',
        studentCount: 180,
        targetAmount: 130000,
        raisedAmount: 90000,
        needs: ['Breakfast Programs', 'Teacher Training', 'Infrastructure', 'Sports Equipment'],
        description: 'Building a bright future for children through quality education and character development.',
        image: schoolImages[4]
    },
    {
        name: 'Riverside Elementary',
        location: 'Eti-Osa, Lagos',
        state: 'Lagos',
        lga: 'Eti-Osa',
        ward: 'Eti-Osa Ward',
        address: '987 Riverside Drive, Eti-Osa',
        phone: '+234 800 RIVERSIDE',
        email: 'riverside@school.com',
        principalName: 'Mrs. Grace Okonkwo',
        schoolType: 'Primary',
        studentCount: 150,
        targetAmount: 110000,
        raisedAmount: 7500,
        needs: ['Breakfast Programs', 'Educational Materials', 'Playground'],
        description: 'Nurturing young minds by the riverside with a focus on holistic child development.',
        image: schoolImages[0]
    },
    {
        name: 'Excellence Secondary School',
        location: 'Ibadan North, Oyo',
        state: 'Oyo',
        lga: 'Ibadan North',
        ward: 'Ibadan North Ward',
        address: '555 Excellence Avenue, Ibadan',
        phone: '+234 800 EXCELLENCE',
        email: 'excellence@school.com',
        principalName: 'Prof. Adebayo Ogunlesi',
        schoolType: 'Secondary',
        studentCount: 250,
        targetAmount: 180000,
        raisedAmount: 120000,
        needs: ['Breakfast Programs', 'Science Lab', 'Computer Lab', 'Library'],
        description: 'Striving for excellence in education and preparing students for future challenges.',
        image: schoolImages[1]
    },
    {
        name: 'Hope Primary School',
        location: 'Port Harcourt, Rivers',
        state: 'Rivers',
        lga: 'Port Harcourt',
        ward: 'Port Harcourt Ward',
        address: '777 Hope Street, Port Harcourt',
        phone: '+234 800 HOPE',
        email: 'hope@school.com',
        principalName: 'Mrs. Blessing Nwosu',
        schoolType: 'Primary',
        studentCount: 120,
        targetAmount: 90000,
        raisedAmount: 30000,
        needs: ['Breakfast Programs', 'Educational Materials', 'Clean Water'],
        description: 'Bringing hope to children through education and community support.',
        image: schoolImages[2]
    },
    {
        name: 'Success Academy',
        location: 'Kaduna North, Kaduna',
        state: 'Kaduna',
        lga: 'Kaduna North',
        ward: 'Kaduna North Ward',
        address: '888 Success Road, Kaduna',
        phone: '+234 800 SUCCESS',
        email: 'success@school.com',
        principalName: 'Mr. Ibrahim Abdullahi',
        schoolType: 'Primary',
        studentCount: 170,
        targetAmount: 125000,
        raisedAmount: 60000,
        needs: ['Breakfast Programs', 'Teacher Training', 'Educational Materials'],
        description: 'Building success stories through quality education and character formation.',
        image: schoolImages[3]
    },
    {
        name: 'Future Leaders School',
        location: 'Enugu East, Enugu',
        state: 'Enugu',
        lga: 'Enugu East',
        ward: 'Enugu East Ward',
        address: '999 Future Leaders Avenue, Enugu',
        phone: '+234 800 FUTURE',
        email: 'future@school.com',
        principalName: 'Mrs. Chinyere Onyeka',
        schoolType: 'Secondary',
        studentCount: 220,
        targetAmount: 160000,
        raisedAmount: 85000,
        needs: ['Breakfast Programs', 'Leadership Training', 'Computer Lab', 'Library'],
        description: 'Developing future leaders through innovative education and leadership programs.',
        image: schoolImages[4]
    }
]

async function seedSchools() {
    console.log('🌱 Starting school seeding...')

    try {
        // Clear existing schools
        await prisma.school.deleteMany({})
        console.log('✅ Cleared existing schools')

        // Create schools with batch tracking
        const importBatch = `batch_${Date.now()}`

        for (const schoolData of schoolsData) {
            const school = await prisma.school.create({
                data: {
                    ...schoolData,
                    importBatch,
                    isActive: true
                }
            })
            console.log(`✅ Created school: ${school.name}`)
        }

        console.log(`🎉 Successfully seeded ${schoolsData.length} schools!`)

        // Display summary
        const totalSchools = await prisma.school.count()
        const schoolsByState = await prisma.school.groupBy({
            by: ['state'],
            _count: {
                state: true
            }
        })

        console.log('\n📊 School Statistics:')
        console.log(`Total Schools: ${totalSchools}`)
        console.log('\nSchools by State:')
        schoolsByState.forEach(group => {
            console.log(`  ${group.state}: ${group._count.state} schools`)
        })

    } catch (error) {
        console.error('❌ Error seeding schools:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

// Run the seeding function
if (require.main === module) {
    seedSchools()
        .then(() => {
            console.log('✅ School seeding completed successfully!')
            process.exit(0)
        })
        .catch((error) => {
            console.error('❌ School seeding failed:', error)
            process.exit(1)
        })
}

export default seedSchools
