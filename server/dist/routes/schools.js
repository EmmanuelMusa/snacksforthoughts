"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const XLSX = __importStar(require("xlsx"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Configure multer for file uploads
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-excel', // .xls
            'text/csv', // .csv
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only Excel and CSV files are allowed.'));
        }
    }
});
// School data validation schema
const SchoolDataSchema = zod_1.z.object({
    schoolName: zod_1.z.string().min(1, 'School name is required'),
    state: zod_1.z.string().min(1, 'State is required'),
    lga: zod_1.z.string().min(1, 'LGA is required'),
    ward: zod_1.z.string().optional(),
    town: zod_1.z.string().optional(),
    specificLocation: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    aggregator: zod_1.z.string().optional(),
    originalNo: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
    studentCount: zod_1.z.coerce.number().min(0).optional(),
    principalName: zod_1.z.string().optional(),
    schoolType: zod_1.z.string().optional(),
});
// Available school images
const schoolImages = [
    '/images/a_school_in_nigeria.jpeg',
    '/images/a_school_in_nigeria (1).jpeg',
    '/images/a_school_in_nigeria (2).jpeg',
    '/images/a_school_in_nigeria (3).jpeg',
    '/images/children_in_a_classroom_in_nigeria_smiling.jpeg'
];
// Helper function to get random school image
const getRandomSchoolImage = () => {
    return schoolImages[Math.floor(Math.random() * schoolImages.length)];
};
// POST /api/schools/upload-excel
router.post('/upload-excel', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        // Parse Excel file
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (!jsonData || jsonData.length < 2) {
            return res.status(400).json({ error: 'File is empty or has no data rows' });
        }
        const headers = jsonData[0];
        const rows = jsonData.slice(1);
        // Map headers to expected fields
        const headerMap = {
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
        };
        // Process and validate data
        const processedSchools = [];
        const errors = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            // Skip empty rows
            if (!row.some(cell => cell !== null && cell !== undefined && cell !== '')) {
                continue;
            }
            try {
                const schoolData = {};
                // Map each column to the corresponding field
                headers.forEach((header, index) => {
                    const mappedField = headerMap[header];
                    if (mappedField && row[index] !== undefined && row[index] !== null && row[index] !== '') {
                        schoolData[mappedField] = row[index];
                    }
                });
                // Validate the school data
                const validatedData = SchoolDataSchema.parse(schoolData);
                // Generate unique ID
                const schoolId = `s${Date.now()}_${i}`;
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
                });
            }
            catch (error) {
                errors.push({
                    row: i + 2, // +2 because we start from row 2 (after header)
                    error: error instanceof Error ? error.message : 'Validation error',
                    data: row
                });
            }
        }
        // Bulk insert schools into database
        let insertedCount = 0;
        if (processedSchools.length > 0) {
            try {
                // Use createMany for bulk insert
                const result = await prisma.school.createMany({
                    data: processedSchools,
                    skipDuplicates: true, // Skip duplicates based on unique constraints
                });
                insertedCount = result.count;
            }
            catch (dbError) {
                console.error('Database error:', dbError);
                return res.status(500).json({
                    error: 'Failed to insert schools into database',
                    details: dbError instanceof Error ? dbError.message : 'Unknown error'
                });
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
        });
    }
    catch (error) {
        console.error('Excel processing error:', error);
        res.status(500).json({
            error: 'Failed to process Excel file',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
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
        });
        res.json({
            success: true,
            data: states.map(s => s.state).filter(Boolean)
        });
    }
    catch (error) {
        console.error('Error fetching states:', error);
        res.status(500).json({
            error: 'Failed to fetch states',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// GET /api/schools/lgas - Get LGAs by state
router.get('/lgas', async (req, res) => {
    try {
        const { state } = req.query;
        if (!state) {
            return res.status(400).json({ error: 'State parameter is required' });
        }
        const lgas = await prisma.school.findMany({
            select: {
                lga: true,
            },
            where: {
                state: state,
            },
            distinct: ['lga'],
            orderBy: {
                lga: 'asc',
            },
        });
        res.json({
            success: true,
            data: lgas.map(s => s.lga).filter(Boolean)
        });
    }
    catch (error) {
        console.error('Error fetching LGAs:', error);
        res.status(500).json({
            error: 'Failed to fetch LGAs',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// GET /api/schools/wards - Get wards by state + lga
router.get('/wards', async (req, res) => {
    try {
        const { state, lga } = req.query;
        if (!state || !lga) {
            return res.status(400).json({ error: 'state and lga parameters are required' });
        }
        const wards = await prisma.school.findMany({
            select: { ward: true },
            where: { state: state, lga: lga },
            distinct: ['ward'],
            orderBy: { ward: 'asc' },
        });
        res.json({
            success: true,
            data: wards.map(w => w.ward).filter(Boolean),
        });
    }
    catch (error) {
        console.error('Error fetching wards:', error);
        res.status(500).json({
            error: 'Failed to fetch wards',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
// GET /api/schools/search - Search schools with filters
router.get('/search', async (req, res) => {
    try {
        const { search, state, lga, ward, page = '1', limit = '20' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { state: { contains: search, mode: 'insensitive' } },
                { lga: { contains: search, mode: 'insensitive' } },
                { ward: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (state) {
            where.state = state;
        }
        if (lga) {
            where.lga = lga;
        }
        if (ward) {
            where.ward = ward;
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
        ]);
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
        });
    }
    catch (error) {
        console.error('Error searching schools:', error);
        res.status(500).json({
            error: 'Failed to search schools',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// GET /api/schools/:id - School details
router.get('/:id', async (req, res) => {
    try {
        const school = await prisma.school.findUnique({ where: { id: req.params.id } });
        if (!school)
            return res.status(404).json({ error: 'Not found' });
        res.json({ success: true, data: school });
    }
    catch (error) {
        console.error('Error fetching school:', error);
        res.status(500).json({
            error: 'Failed to fetch school',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
exports.default = router;
