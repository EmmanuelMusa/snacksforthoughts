import * as XLSX from 'xlsx'

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

// Helper function to generate student count
const generateStudentCount = (): number => {
    return Math.floor(Math.random() * 200) + 100 // Random between 100-300
}

// Helper function to generate target amount
const generateTargetAmount = (): number => {
    return Math.floor(Math.random() * 100000) + 50000 // Random between 50k-150k
}

// Helper function to generate needs based on category
const generateNeeds = (category: string): string[] => {
    const baseNeeds = ['Breakfast Programs', 'Educational Materials']

    switch (category.toUpperCase()) {
        case 'MIGRANT FISHERMEN/FARMERS':
            return [...baseNeeds, 'Nutrition Support', 'Community Outreach']
        case 'CONVENTIONAL':
            return [...baseNeeds, 'Teacher Training', 'Infrastructure']
        case 'SPECIAL NEEDS':
            return [...baseNeeds, 'Special Education', 'Accessibility', 'Therapy Services']
        case 'ISLAMIC':
            return [...baseNeeds, 'Religious Education', 'Cultural Programs']
        case 'CHRISTIAN':
            return [...baseNeeds, 'Religious Education', 'Moral Education']
        default:
            return baseNeeds
    }
}

async function processAllSchoolsFromExcel() {
    console.log('🌱 Processing ALL schools from Public primary schools .xlsx...')

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

        // Process ALL schools
        const processedSchools = []
        const states = new Set()
        const lgas = new Set()
        const towns = new Set()
        const locations = new Set()
        const wards = new Set()
        const categories = new Set()
        const errors = []

        const importBatch = `full_excel_import_${Date.now()}`

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i]

            // Skip empty rows
            if (!row.some(cell => cell !== null && cell !== undefined && cell !== '')) {
                continue
            }

            try {
                // Map columns to school data
                const schoolData = {
                    no: cleanData(row[0]),
                    type: cleanData(row[1]),
                    category: cleanData(row[2]),
                    state: cleanData(row[3]),
                    lga: cleanData(row[4]),
                    name: cleanData(row[5]),
                    town: cleanData(row[6]),
                    location: cleanData(row[7]),
                    ward: cleanData(row[8]),
                    aggregator: cleanData(row[9])
                }

                // Skip if essential data is missing
                if (!schoolData.name || !schoolData.state || !schoolData.lga) {
                    continue
                }

                // Collect unique values for filtering
                if (schoolData.state) states.add(schoolData.state)
                if (schoolData.lga) lgas.add(schoolData.lga)
                if (schoolData.town) towns.add(schoolData.town)
                if (schoolData.location) locations.add(schoolData.location)
                if (schoolData.ward) wards.add(schoolData.ward)
                if (schoolData.category) categories.add(schoolData.category)

                // Create comprehensive school record
                const school = {
                    id: `school_${i + 1}`,
                    name: schoolData.name,
                    location: `${schoolData.lga}, ${schoolData.state}`,
                    state: schoolData.state,
                    lga: schoolData.lga,
                    ward: schoolData.ward || '',
                    town: schoolData.town || '',
                    specificLocation: schoolData.location || '',
                    address: schoolData.location || schoolData.town || '',
                    phone: '',
                    email: '',
                    principalName: '',
                    schoolType: schoolData.type || 'Primary',
                    category: schoolData.category || 'CONVENTIONAL',
                    studentCount: generateStudentCount(),
                    targetAmount: generateTargetAmount(),
                    raisedAmount: 0,
                    needs: generateNeeds(schoolData.category),
                    image: getRandomSchoolImage(),
                    description: `A ${schoolData.type || 'Primary'} school in ${schoolData.lga}, ${schoolData.state} committed to providing quality education.`,
                    needType: 'General Education',
                    isActive: true,
                    importBatch,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    aggregator: schoolData.aggregator || '',
                    originalNo: schoolData.no
                }

                processedSchools.push(school)

                if (processedSchools.length % 5000 === 0) {
                    console.log(`✅ Processed ${processedSchools.length} schools...`)
                }

            } catch (error) {
                errors.push({
                    row: i + 2,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    data: row
                })
            }
        }

        console.log(`🎉 Successfully processed ${processedSchools.length} schools!`)

        if (errors.length > 0) {
            console.log(`⚠️  ${errors.length} errors occurred:`)
            errors.slice(0, 10).forEach(error => {
                console.log(`  Row ${error.row}: ${error.error}`)
            })
        }

        // Generate comprehensive filter data
        const filterData = {
            states: Array.from(states).sort(),
            lgas: Array.from(lgas).sort(),
            towns: Array.from(towns).sort(),
            locations: Array.from(locations).sort(),
            wards: Array.from(wards).sort(),
            categories: Array.from(categories).sort(),
            schoolTypes: ['Primary', 'Secondary', 'PUBLIC'],
            needs: ['Breakfast Programs', 'Educational Materials', 'Teacher Training', 'Infrastructure', 'Nutrition Support', 'Community Outreach', 'Special Education', 'Accessibility', 'Therapy Services', 'Religious Education', 'Cultural Programs', 'Moral Education']
        }

        // Generate statistics
        const stats = {
            totalSchools: processedSchools.length,
            totalStates: states.size,
            totalLGAs: lgas.size,
            totalTowns: towns.size,
            totalLocations: locations.size,
            totalWards: wards.size,
            totalCategories: categories.size,
            schoolsByState: {} as Record<string, number>,
            schoolsByLGA: {} as Record<string, number>,
            schoolsByCategory: {} as Record<string, number>
        }

        // Calculate schools by state
        processedSchools.forEach(school => {
            stats.schoolsByState[school.state] = (stats.schoolsByState[school.state] || 0) + 1
            stats.schoolsByLGA[school.lga] = (stats.schoolsByLGA[school.lga] || 0) + 1
            stats.schoolsByCategory[school.category] = (stats.schoolsByCategory[school.category] || 0) + 1
        })

        // Save processed data
        const fs = require('fs')

        // Save all schools
        fs.writeFileSync('./all-schools.json', JSON.stringify(processedSchools, null, 2))
        console.log('💾 Saved all schools to all-schools.json')

        // Save filter data
        fs.writeFileSync('./filter-data.json', JSON.stringify(filterData, null, 2))
        console.log('💾 Saved filter data to filter-data.json')

        // Save statistics
        fs.writeFileSync('./school-statistics.json', JSON.stringify(stats, null, 2))
        console.log('💾 Saved statistics to school-statistics.json')

        // Display summary
        console.log('\n📊 Processing Summary:')
        console.log(`Total Schools: ${stats.totalSchools.toLocaleString()}`)
        console.log(`Total States: ${stats.totalStates}`)
        console.log(`Total LGAs: ${stats.totalLGAs}`)
        console.log(`Total Towns: ${stats.totalTowns}`)
        console.log(`Total Locations: ${stats.totalLocations}`)
        console.log(`Total Wards: ${stats.totalWards}`)
        console.log(`Total Categories: ${stats.totalCategories}`)

        console.log('\n🗺️ States Found:')
        filterData.states.forEach(state => {
            const count = stats.schoolsByState[state as string] || 0
            console.log(`  ${state}: ${count.toLocaleString()} schools`)
        })

        console.log('\n🏛️ Top 10 LGAs by School Count:')
        Object.entries(stats.schoolsByLGA)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 10)
            .forEach(([lga, count]) => {
                console.log(`  ${lga}: ${(count as number).toLocaleString()} schools`)
            })

        console.log('\n📚 Categories Found:')
        filterData.categories.forEach(category => {
            const count = stats.schoolsByCategory[category as string] || 0
            console.log(`  ${category}: ${count.toLocaleString()} schools`)
        })

        return {
            schools: processedSchools,
            filterData,
            stats
        }

    } catch (error) {
        console.error('❌ Error processing Excel file:', error)
        throw error
    }
}

// Run the processing function
if (require.main === module) {
    processAllSchoolsFromExcel()
        .then(() => {
            console.log('✅ Full Excel processing completed successfully!')
            process.exit(0)
        })
        .catch((error) => {
            console.error('❌ Full Excel processing failed:', error)
            process.exit(1)
        })
}

export default processAllSchoolsFromExcel
