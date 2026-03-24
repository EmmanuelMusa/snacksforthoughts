import * as dotenv from 'dotenv'
dotenv.config()
console.log('DATABASE_URL:', process.env.DATABASE_URL)
import * as XLSX from 'xlsx'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Available school images
const schoolImages = [
    '/images/a_school_in_nigeria.jpeg',
    '/images/a_school_in_nigeria (1).jpeg',
    '/images/a_school_in_nigeria (2).jpeg',
    '/images/a_school_in_nigeria (3).jpeg',
    '/images/children_in_a_classroom_in_nigeria_smiling.jpeg'
]

// Helper function to get random school image
const getRandomSchoolImage = () => {
    return schoolImages[Math.floor(Math.random() * schoolImages.length)]
}

// Helper function to clean and validate data
const cleanData = (value: any): string => {
    if (value === null || value === undefined) return ''
    return String(value).trim()
}

// Helper function to generate student count if not provided
const generateStudentCount = (): number => {
    return Math.floor(Math.random() * 200) + 100 // Random between 100-300
}

// Helper function to generate target amount
const generateTargetAmount = (): number => {
    return Math.floor(Math.random() * 100000) + 50000 // Random between 50k-150k
}

async function importSchoolsFromExcel() {
    console.log('🌱 Starting import from Public primary schools .xlsx...')

    try {
        // Read the Excel file
        const workbook = XLSX.readFile('./Public primary schools .xlsx')
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        if (!jsonData || jsonData.length < 2) {
            throw new Error('Excel file is empty or has no data rows')
        }

        const headers = jsonData[0] as string[]
        const rows = jsonData.slice(1) as any[][]

        console.log('📊 Excel file structure:')
        console.log(`Headers: ${headers.join(', ')}`)
        console.log(`Total rows: ${rows.length}`)

        // Clear existing schools
        //await prisma.school.deleteMany({})
        //console.log('✅ Cleared existing schools')

        // Process and import schools
        const importBatch = `excel_import_${Date.now()}`
        const schoolDataList: any[] = []
        const errors = []

        console.log('🔄 Preparing data for batch import...')

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i]
            if (!row.some(cell => cell !== null && cell !== undefined && cell !== '')) continue

            try {
                const schoolEntry: any = {
                    importBatch,
                    isActive: true,
                    needs: ['Breakfast Programs', 'Educational Materials'],
                    image: getRandomSchoolImage(),
                    raisedAmount: 0,
                    targetAmount: generateTargetAmount(),
                    studentCount: generateStudentCount(),
                    needType: 'General Education',
                }

                headers.forEach((header, index) => {
                    const cleanHeader = cleanData(header).toUpperCase()
                    const value = cleanData(row[index])

                    if (cleanHeader === 'NAMES OF PRIMARY SCHOOLS') schoolEntry.name = value
                    else if (cleanHeader === 'STATE') schoolEntry.state = value
                    else if (cleanHeader === 'LGA') schoolEntry.lga = value
                    else if (cleanHeader === 'WARDS') schoolEntry.ward = value
                    else if (cleanHeader === 'TOWN') schoolEntry.town = value
                    else if (cleanHeader === 'LOCATION') schoolEntry.specificLocation = value
                    else if (cleanHeader === 'CATEGORY OF SCHOOL') schoolEntry.category = value
                    else if (cleanHeader === 'TYPE OF SCHOOL') schoolEntry.schoolType = value
                    else if (cleanHeader === 'AGGREGATORS') schoolEntry.aggregator = value
                    else if (cleanHeader === 'NO') schoolEntry.originalNo = value
                })

                if (!schoolEntry.name) continue

                schoolEntry.location = `${schoolEntry.lga || 'Unknown'}, ${schoolEntry.state || 'Unknown'}`
                schoolEntry.description = `A ${schoolEntry.schoolType || 'Primary'} school in ${schoolEntry.lga || 'Unknown'}, ${schoolEntry.state || 'Unknown'} committed to providing quality education.`
                
                schoolDataList.push(schoolEntry)
            } catch (error) {
                errors.push({ row: i + 2, error: error instanceof Error ? error.message : 'Unknown' })
            }
        }

        console.log(`📦 Ready to import ${schoolDataList.length} schools in batches...`)

        const BATCH_SIZE = 200
        let importedCount = 0

        for (let i = 0; i < schoolDataList.length; i += BATCH_SIZE) {
            const batch = schoolDataList.slice(i, i + BATCH_SIZE)
            try {
                await (prisma as any).school.createMany({
                    data: batch,
                    skipDuplicates: true
                })
                importedCount += batch.length
                console.log(`✅ Progress: ${i + batch.length}/${schoolDataList.length} schools processed...`)
                
                // Add a small delay to prevent overwhelming the DB/connection
                await new Promise(resolve => setTimeout(resolve, 500))
            } catch (err) {
                console.error(`❌ Error in batch starting at index ${i}:`, err)
                // Continue to next batch
            }
        }

        console.log(`🎉 Finished processing ${schoolDataList.length} schools!`)

        if (errors.length > 0) {
            console.log(`⚠️  ${errors.length} errors occurred:`)
            errors.slice(0, 10).forEach(error => {
                console.log(`  Row ${error.row}: ${error.error}`)
            })
        }

        // Display summary
        const totalSchools = await prisma.school.count()
        const schoolsByState = await prisma.school.groupBy({
            by: ['state'],
            _count: {
                state: true
            },
            orderBy: {
                _count: {
                    state: 'desc'
                }
            }
        })

        console.log('\n📊 Import Summary:')
        console.log(`Total Schools: ${totalSchools}`)
        console.log('\nTop 10 States by School Count:')
        schoolsByState.slice(0, 10).forEach((group: any) => {
            console.log(`  ${group.state}: ${group._count.state} schools`)
        })

    } catch (error) {
        console.error('❌ Error importing schools:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

// Run the import function
if (require.main === module) {
    importSchoolsFromExcel()
        .then(() => {
            console.log('✅ Excel import completed successfully!')
            process.exit(0)
        })
        .catch((error) => {
            console.error('❌ Excel import failed:', error)
            process.exit(1)
        })
}

export default importSchoolsFromExcel
