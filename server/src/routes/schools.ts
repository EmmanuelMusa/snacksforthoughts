import express from 'express'
import multer from 'multer'
import * as XLSX from 'xlsx'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const router = express.Router()
const prisma = new PrismaClient()

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-excel', // .xls
            'text/csv', // .csv
        ]

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Invalid file type. Only Excel and CSV files are allowed.'))
        }
    }
})

// School data validation schema
const SchoolDataSchema = z.object({
    schoolName: z.string().min(1, 'School name is required'),
    state: z.string().min(1, 'State is required'),
    lga: z.string().min(1, 'LGA is required'),
    ward: z.string().optional(),
    town: z.string().optional(),
    specificLocation: z.string().optional(),
    category: z.string().optional(),
    aggregator: z.string().optional(),
    originalNo: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    studentCount: z.coerce.number().min(0).optional(),
    principalName: z.string().optional(),
    schoolType: z.string().optional(),
})

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

// POST /api/schools/upload-excel
router.post('/upload-excel', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' })
        }

        // Parse Excel file
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        if (!jsonData || jsonData.length < 2) {
            return res.status(400).json({ error: 'File is empty or has no data rows' })
        }

        const headers = jsonData[0] as string[]
        const rows = jsonData.slice(1) as any[][]

        // Map headers to expected fields
        const headerMap: Record<string, string> = {
            'School Name': 'schoolName',
            'school_name': 'schoolName',
            'schoolname': 'schoolName',
            'Name': 'schoolName',
            'name': 'schoolName',
            'State': 'state',
            'state': 'state',
            'LGA': 'lga',
            'lga': 'lga',
            'Ward': 'ward',
            'ward': 'ward',
            'Town': 'town',
            'town': 'town',
            'Location': 'specificLocation',
            'location': 'specificLocation',
            'Address': 'address',
            'address': 'address',
            'Phone': 'phone',
            'phone': 'phone',
            'Email': 'email',
            'email': 'email',
            'Student Count': 'studentCount',
            'student_count': 'studentCount',
            'studentcount': 'studentCount',
            'Principal Name': 'principalName',
            'principal_name': 'principalName',
            'principalname': 'principalName',
            'School Type': 'schoolType',
            'school_type': 'schoolType',
            'schooltype': 'schoolType',
            'Type': 'schoolType',
            'type': 'schoolType',
            'Category': 'category',
            'category': 'category',
            'Aggregator': 'aggregator',
            'aggregator': 'aggregator',
            'No': 'originalNo',
            'no': 'originalNo',
        }

        // Process and validate data
        const processedSchools = []
        const errors = []

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i]

            // Skip empty rows
            if (!row.some(cell => cell !== null && cell !== undefined && cell !== '')) {
                continue
            }

            try {
                const schoolData: any = {}

                // Map each column to the corresponding field
                headers.forEach((header, index) => {
                    const mappedField = headerMap[header]
                    if (mappedField && row[index] !== undefined && row[index] !== null && row[index] !== '') {
                        schoolData[mappedField] = row[index]
                    }
                })

                // Validate the school data
                const validatedData = SchoolDataSchema.parse(schoolData)

                // Generate unique ID
                const schoolId = `s${Date.now()}_${i}`

                processedSchools.push({
                    id: schoolId,
                    name: validatedData.schoolName,
                    location: `${validatedData.lga}, ${validatedData.state}`,
                    state: validatedData.state,
                    lga: validatedData.lga,
                    ward: validatedData.ward || '',
                    town: validatedData.town || '',
                    specificLocation: validatedData.specificLocation || '',
                    category: validatedData.category || '',
                    aggregator: validatedData.aggregator || '',
                    originalNo: validatedData.originalNo || '',
                    address: validatedData.address || validatedData.specificLocation || validatedData.town || '',
                    phone: validatedData.phone || '',
                    email: validatedData.email || '',
                    principalName: validatedData.principalName || '',
                    schoolType: validatedData.schoolType || 'Primary',
                    studentCount: validatedData.studentCount || Math.floor(Math.random() * 200) + 100,
                    targetAmount: Math.floor(Math.random() * 100000) + 50000,
                    raisedAmount: 0,
                    needs: ['Breakfast Programs', 'Educational Materials'],
                    image: getRandomSchoolImage(),
                    description: `A ${validatedData.schoolType || 'Primary'} school in ${validatedData.lga}, ${validatedData.state} committed to providing quality education.`,
                    needType: 'General Education',
                    isActive: true,
                    importBatch: `batch_${Date.now()}`,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
            } catch (error) {
                errors.push({
                    row: i + 2, // +2 because we start from row 2 (after header)
                    error: error instanceof Error ? error.message : 'Validation error',
                    data: row
                })
            }
        }

        // Bulk insert schools into database
        let insertedCount = 0
        if (processedSchools.length > 0) {
            try {
                // Use createMany for bulk insert
                const result = await prisma.school.createMany({
                    data: processedSchools,
                    skipDuplicates: true, // Skip duplicates based on unique constraints
                })
                insertedCount = result.count
            } catch (dbError) {
                console.error('Database error:', dbError)
                return res.status(500).json({
                    error: 'Failed to insert schools into database',
                    details: dbError instanceof Error ? dbError.message : 'Unknown error'
                })
            }
        }

        res.json({
            success: true,
            message: `Successfully processed ${processedSchools.length} schools`,
            data: {
                totalRows: rows.length,
                validRows: processedSchools.length,
                insertedCount,
                errors: errors.slice(0, 10), // Limit errors to first 10
                totalErrors: errors.length,
                schools: processedSchools.slice(0, 5), // Return first 5 schools as preview
            }
        })

    } catch (error) {
        console.error('Excel processing error:', error)
        res.status(500).json({
            error: 'Failed to process Excel file',
            details: error instanceof Error ? error.message : 'Unknown error'
        })
    }
})

// GET /api/schools/states - Get all unique states
router.get('/states', async (req, res) => {
    try {
        const states = await prisma.school.findMany({
            select: {
                state: true,
            },
            distinct: ['state'],
            orderBy: {
                state: 'asc',
            },
        })

        res.json({
            success: true,
            data: states.map(s => s.state).filter(Boolean)
        })
    } catch (error) {
        console.error('Error fetching states:', error)
        res.status(500).json({
            error: 'Failed to fetch states',
            details: error instanceof Error ? error.message : 'Unknown error'
        })
    }
})

// GET /api/schools/lgas - Get LGAs by state
router.get('/lgas', async (req, res) => {
    try {
        const { state } = req.query

        if (!state) {
            return res.status(400).json({ error: 'State parameter is required' })
        }

        const lgas = await prisma.school.findMany({
            select: {
                lga: true,
            },
            where: {
                state: state as string,
            },
            distinct: ['lga'],
            orderBy: {
                lga: 'asc',
            },
        })

        res.json({
            success: true,
            data: lgas.map(s => s.lga).filter(Boolean)
        })
    } catch (error) {
        console.error('Error fetching LGAs:', error)
        res.status(500).json({
            error: 'Failed to fetch LGAs',
            details: error instanceof Error ? error.message : 'Unknown error'
        })
    }
})

// GET /api/schools/wards - Get wards by state + lga
router.get('/wards', async (req, res) => {
    try {
        const { state, lga } = req.query

        if (!state || !lga) {
            return res.status(400).json({ error: 'state and lga parameters are required' })
        }

        const wards = await prisma.school.findMany({
            select: { ward: true },
            where: { state: state as string, lga: lga as string },
            distinct: ['ward'],
            orderBy: { ward: 'asc' },
        })

        res.json({
            success: true,
            data: wards.map(w => w.ward).filter(Boolean),
        })
    } catch (error) {
        console.error('Error fetching wards:', error)
        res.status(500).json({
            error: 'Failed to fetch wards',
            details: error instanceof Error ? error.message : 'Unknown error',
        })
    }
})

// GET /api/schools/search - Search schools with filters
router.get('/search', async (req, res) => {
    try {
        const {
            search,
            state,
            lga,
            ward,
            page = '1',
            limit = '20'
        } = req.query

        const pageNum = parseInt(page as string)
        const limitNum = parseInt(limit as string)
        const skip = (pageNum - 1) * limitNum

        const where: any = {}

        if (search) {
            where.OR = [
                { name: { contains: search as string, mode: 'insensitive' } },
                { state: { contains: search as string, mode: 'insensitive' } },
                { lga: { contains: search as string, mode: 'insensitive' } },
                { ward: { contains: search as string, mode: 'insensitive' } },
            ]
        }

        if (state) {
            where.state = state as string
        }

        if (lga) {
            where.lga = lga as string
        }

        if (ward) {
            where.ward = ward as string
        }

        const [schools, total] = await Promise.all([
            prisma.school.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: {
                    name: 'asc',
                },
            }),
            prisma.school.count({ where })
        ])

        res.json({
            success: true,
            data: {
                schools,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    pages: Math.ceil(total / limitNum),
                }
            }
        })
    } catch (error) {
        console.error('Error searching schools:', error)
        res.status(500).json({
            error: 'Failed to search schools',
            details: error instanceof Error ? error.message : 'Unknown error'
        })
    }
})

// GET /api/schools/:id - School details
router.get('/:id', async (req, res) => {
    try {
        const school = await prisma.school.findUnique({ where: { id: req.params.id } })
        if (!school) return res.status(404).json({ error: 'Not found' })
        res.json({ success: true, data: school })
    } catch (error) {
        console.error('Error fetching school:', error)
        res.status(500).json({
            error: 'Failed to fetch school',
            details: error instanceof Error ? error.message : 'Unknown error',
        })
    }
})

// PATCH /api/schools/:id - Update school
router.patch('/:id', async (req, res) => {
    try {
        const updated = await prisma.school.update({
            where: { id: req.params.id },
            data: req.body
        })
        res.json({ success: true, data: updated })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update school' })
    }
})

// DELETE /api/schools/:id - Delete school
router.delete('/:id', async (req, res) => {
    try {
        await prisma.school.delete({ where: { id: req.params.id } })
        res.json({ success: true, message: 'School deleted' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete school' })
    }
})

export default router
