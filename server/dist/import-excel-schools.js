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
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
console.log('DATABASE_URL:', process.env.DATABASE_URL);
const XLSX = __importStar(require("xlsx"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
// Helper function to clean and validate data
const cleanData = (value) => {
    if (value === null || value === undefined)
        return '';
    return String(value).trim();
};
// Helper function to generate student count if not provided
const generateStudentCount = () => {
    return Math.floor(Math.random() * 200) + 100; // Random between 100-300
};
// Helper function to generate target amount
const generateTargetAmount = () => {
    return Math.floor(Math.random() * 100000) + 50000; // Random between 50k-150k
};
async function importSchoolsFromExcel() {
    console.log('🌱 Starting import from Public primary schools .xlsx...');
    try {
        // Read the Excel file
        const workbook = XLSX.readFile('./Public primary schools .xlsx');
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (!jsonData || jsonData.length < 2) {
            throw new Error('Excel file is empty or has no data rows');
        }
        const headers = jsonData[0];
        const rows = jsonData.slice(1);
        console.log('📊 Excel file structure:');
        console.log(`Headers: ${headers.join(', ')}`);
        console.log(`Total rows: ${rows.length}`);
        // Clear existing schools
        //await prisma.school.deleteMany({})
        //console.log('✅ Cleared existing schools')
        // Process and import schools
        const importBatch = `excel_import_${Date.now()}`;
        const processedSchools = [];
        const errors = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            // Skip empty rows
            if (!row.some(cell => cell !== null && cell !== undefined && cell !== '')) {
                continue;
            }
            try {
                // Map columns to school data
                // We'll need to examine the actual structure, but let's assume common column names
                const schoolData = {};
                headers.forEach((header, index) => {
                    const cleanHeader = cleanData(header).toLowerCase();
                    const value = cleanData(row[index]);
                    // Map common column names
                    if (cleanHeader.includes('school') && cleanHeader.includes('name')) {
                        schoolData.name = value;
                    }
                    else if (cleanHeader.includes('state')) {
                        schoolData.state = value;
                    }
                    else if (cleanHeader.includes('lga') || cleanHeader.includes('local government')) {
                        schoolData.lga = value;
                    }
                    else if (cleanHeader.includes('ward')) {
                        schoolData.ward = value;
                    }
                    else if (cleanHeader.includes('address')) {
                        schoolData.address = value;
                    }
                    else if (cleanHeader.includes('phone') || cleanHeader.includes('contact')) {
                        schoolData.phone = value;
                    }
                    else if (cleanHeader.includes('email')) {
                        schoolData.email = value;
                    }
                    else if (cleanHeader.includes('student') && cleanHeader.includes('count')) {
                        schoolData.studentCount = parseInt(value) || generateStudentCount();
                    }
                    else if (cleanHeader.includes('principal')) {
                        schoolData.principalName = value;
                    }
                    else if (cleanHeader.includes('type')) {
                        schoolData.schoolType = value || 'Primary';
                    }
                });
                // Ensure required fields
                if (!schoolData.name) {
                    schoolData.name = `School ${i + 1}`;
                }
                if (!schoolData.state) {
                    schoolData.state = 'Unknown';
                }
                if (!schoolData.lga) {
                    schoolData.lga = 'Unknown';
                }
                // Create school record
                const school = await prisma.school.create({
                    data: {
                        name: schoolData.name,
                        location: `${schoolData.lga}, ${schoolData.state}`,
                        state: schoolData.state,
                        lga: schoolData.lga,
                        ward: schoolData.ward || '',
                        address: schoolData.address || '',
                        phone: schoolData.phone || '',
                        email: schoolData.email || '',
                        principalName: schoolData.principalName || '',
                        schoolType: schoolData.schoolType || 'Primary',
                        studentCount: schoolData.studentCount || generateStudentCount(),
                        targetAmount: generateTargetAmount(),
                        raisedAmount: 0,
                        needs: ['Breakfast Programs', 'Educational Materials'],
                        image: getRandomSchoolImage(),
                        description: `A ${schoolData.schoolType || 'Primary'} school in ${schoolData.lga}, ${schoolData.state} committed to providing quality education.`,
                        needType: 'General Education',
                        isActive: true,
                        importBatch,
                    }
                });
                processedSchools.push(school);
                if (processedSchools.length % 100 === 0) {
                    console.log(`✅ Processed ${processedSchools.length} schools...`);
                }
            }
            catch (error) {
                errors.push({
                    row: i + 2,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    data: row
                });
            }
        }
        console.log(`🎉 Successfully imported ${processedSchools.length} schools!`);
        if (errors.length > 0) {
            console.log(`⚠️  ${errors.length} errors occurred:`);
            errors.slice(0, 10).forEach(error => {
                console.log(`  Row ${error.row}: ${error.error}`);
            });
        }
        // Display summary
        const totalSchools = await prisma.school.count();
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
        });
        console.log('\n📊 Import Summary:');
        console.log(`Total Schools: ${totalSchools}`);
        console.log('\nTop 10 States by School Count:');
        schoolsByState.slice(0, 10).forEach((group) => {
            console.log(`  ${group.state}: ${group._count.state} schools`);
        });
    }
    catch (error) {
        console.error('❌ Error importing schools:', error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
// Run the import function
if (require.main === module) {
    importSchoolsFromExcel()
        .then(() => {
        console.log('✅ Excel import completed successfully!');
        process.exit(0);
    })
        .catch((error) => {
        console.error('❌ Excel import failed:', error);
        process.exit(1);
    });
}
exports.default = importSchoolsFromExcel;
