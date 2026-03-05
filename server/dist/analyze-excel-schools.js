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
const XLSX = __importStar(require("xlsx"));
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
// Helper function to generate student count
const generateStudentCount = () => {
    return Math.floor(Math.random() * 200) + 100; // Random between 100-300
};
// Helper function to generate target amount
const generateTargetAmount = () => {
    return Math.floor(Math.random() * 100000) + 50000; // Random between 50k-150k
};
async function analyzeExcelFile() {
    console.log('📊 Analyzing Public primary schools .xlsx...');
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
        console.log('📋 Excel file structure:');
        console.log(`Headers: ${headers.join(', ')}`);
        console.log(`Total rows: ${rows.length}`);
        // Analyze the data
        const states = new Set();
        const lgas = new Set();
        const schoolTypes = new Set();
        const categories = new Set();
        const sampleSchools = [];
        for (let i = 0; i < Math.min(1000, rows.length); i++) {
            const row = rows[i];
            // Skip empty rows
            if (!row.some(cell => cell !== null && cell !== undefined && cell !== '')) {
                continue;
            }
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
            };
            if (schoolData.state)
                states.add(schoolData.state);
            if (schoolData.lga)
                lgas.add(schoolData.lga);
            if (schoolData.type)
                schoolTypes.add(schoolData.type);
            if (schoolData.category)
                categories.add(schoolData.category);
            if (sampleSchools.length < 10 && schoolData.name) {
                sampleSchools.push(schoolData);
            }
        }
        console.log('\n📈 Data Analysis:');
        console.log(`Unique States: ${states.size}`);
        console.log(`Unique LGAs: ${lgas.size}`);
        console.log(`Unique School Types: ${schoolTypes.size}`);
        console.log(`Unique Categories: ${categories.size}`);
        console.log('\n🏫 Sample Schools:');
        sampleSchools.forEach((school, index) => {
            console.log(`${index + 1}. ${school.name}`);
            console.log(`   State: ${school.state}, LGA: ${school.lga}`);
            console.log(`   Type: ${school.type}, Category: ${school.category}`);
            console.log(`   Location: ${school.location}, Ward: ${school.ward}`);
            console.log('');
        });
        console.log('\n🗺️ States Found:');
        Array.from(states).slice(0, 20).forEach(state => {
            console.log(`  - ${state}`);
        });
        if (states.size > 20) {
            console.log(`  ... and ${states.size - 20} more states`);
        }
        console.log('\n🏛️ LGAs Found (first 20):');
        Array.from(lgas).slice(0, 20).forEach(lga => {
            console.log(`  - ${lga}`);
        });
        if (lgas.size > 20) {
            console.log(`  ... and ${lgas.size - 20} more LGAs`);
        }
        // Generate processed schools data
        console.log('\n🔄 Processing schools for frontend...');
        const processedSchools = [];
        for (let i = 0; i < Math.min(100, rows.length); i++) {
            const row = rows[i];
            if (!row.some(cell => cell !== null && cell !== undefined && cell !== '')) {
                continue;
            }
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
            };
            if (schoolData.name && schoolData.state && schoolData.lga) {
                processedSchools.push({
                    id: `school_${i + 1}`,
                    name: schoolData.name,
                    location: `${schoolData.lga}, ${schoolData.state}`,
                    state: schoolData.state,
                    lga: schoolData.lga,
                    ward: schoolData.ward || '',
                    address: schoolData.location || schoolData.town || '',
                    phone: '',
                    email: '',
                    principalName: '',
                    schoolType: schoolData.type || 'Primary',
                    studentCount: generateStudentCount(),
                    targetAmount: generateTargetAmount(),
                    raisedAmount: 0,
                    needs: ['Breakfast Programs', 'Educational Materials'],
                    image: getRandomSchoolImage(),
                    description: `A ${schoolData.type || 'Primary'} school in ${schoolData.lga}, ${schoolData.state} committed to providing quality education.`,
                    needType: 'General Education',
                    isActive: true,
                    importBatch: 'excel_import_2024',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            }
        }
        console.log(`\n✅ Processed ${processedSchools.length} schools for frontend`);
        // Save processed data to JSON file for frontend use
        const fs = require('fs');
        fs.writeFileSync('./processed-schools.json', JSON.stringify(processedSchools, null, 2));
        console.log('💾 Saved processed schools to processed-schools.json');
        return processedSchools;
    }
    catch (error) {
        console.error('❌ Error analyzing Excel file:', error);
        throw error;
    }
}
// Run the analysis function
if (require.main === module) {
    analyzeExcelFile()
        .then(() => {
        console.log('✅ Excel analysis completed successfully!');
        process.exit(0);
    })
        .catch((error) => {
        console.error('❌ Excel analysis failed:', error);
        process.exit(1);
    });
}
exports.default = analyzeExcelFile;
