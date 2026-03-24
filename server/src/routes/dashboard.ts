import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth';
import { NIGERIAN_STATES } from '../constants';

const router = Router();
const prisma = new PrismaClient();

// Helper to get start of today
const getStartOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

// National Command Center Data
router.get('/national', authenticateToken, requireRole(['NATIONAL_CMD']), async (req, res) => {
    try {
        const today = getStartOfToday();
        const totalPupilsFed = await prisma.schoolReport.aggregate({ 
            where: { createdAt: { gte: today } },
            _sum: { pupilsFedToday: true } 
        });
        const totalSchools = await prisma.school.count();
        const totalVendors = await prisma.vendor.count();
        const totalFarmers = await prisma.user.count({ where: { role: 'FARMER' } });

        res.json({
            pupilsFedToday: totalPupilsFed._sum.pupilsFedToday || 0,
            schoolsParticipating: totalSchools,
            vendorsActive: totalVendors,
            farmersLinked: totalFarmers,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch national data" });
    }
});

// State Control Dashboard
router.get('/state/:stateName', authenticateToken, requireRole(['NATIONAL_CMD', 'STATE_CONTROL']), async (req, res) => {
    try {
        const { stateName } = req.params;
        const today = getStartOfToday();
        
        if (!NIGERIAN_STATES.includes(stateName)) {
            return res.status(400).json({ error: "Invalid Nigerian State" });
        }

        const schoolsInState = await prisma.school.findMany({ where: { state: stateName } });
        const schoolIds = schoolsInState.map(s => s.id);

        const pupilsFed = await prisma.schoolReport.aggregate({
            where: { 
                schoolId: { in: schoolIds },
                createdAt: { gte: today }
            },
            _sum: { pupilsFedToday: true }
        });

        const activeVendors = await prisma.user.count({ where: { role: 'VENDOR', state: stateName } });

        res.json({
            schoolsParticipating: schoolsInState.length,
            pupilsFedToday: pupilsFed._sum.pupilsFedToday || 0,
            vendorsActive: activeVendors
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch state data" });
    }
});

// LGA Monitoring Panel
router.get('/lga/:lgaName', authenticateToken, requireRole(['NATIONAL_CMD', 'STATE_CONTROL', 'LGA_MONITOR']), async (req, res) => {
    try {
        const { lgaName } = req.params;
        const schoolsInLga = await prisma.school.findMany({ where: { lga: lgaName } });
        const schoolIds = schoolsInLga.map(s => s.id);

        const pupilsFed = await prisma.schoolReport.aggregate({
            where: { schoolId: { in: schoolIds } },
            _sum: { pupilsFedToday: true }
        });

        const inspectionVisits = await prisma.safetyReport.count({ where: { type: 'inspection' } });

        res.json({
            schoolsFeeding: schoolsInLga.length,
            pupilsServed: pupilsFed._sum.pupilsFedToday || 0,
            inspectionVisits,
            schools: schoolsInLga
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch LGA data" });
    }
});

// Public Transparency Portal (No Auth)
router.get('/public', async (req, res) => {
    try {
        const totalPupilsFed = await prisma.schoolReport.aggregate({ _sum: { pupilsFedToday: true } });
        
        // Count distinct states that are in our valid list
        const participatingStates = await prisma.school.findMany({ 
            where: { state: { in: NIGERIAN_STATES } },
            select: { state: true }, 
            distinct: ['state'] 
        });
        
        const farmersEngaged = await prisma.user.count({ where: { role: 'FARMER' } });

        res.json({
            pupilsFed: totalPupilsFed._sum.pupilsFedToday || 0,
            statesParticipating: participatingStates.length,
            farmersEngaged
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch public data" });
    }
});

// School Reporting POST
router.post('/report', authenticateToken, requireRole(['SCHOOL_REPORTER']), async (req: any, res) => {
    try {
        const { pupilsFedToday, menuServed, vendorName, qualityScore } = req.body;
        if (!pupilsFedToday || !menuServed) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        let schoolId = user?.schoolId;
        if (!schoolId) {
            const firstSchool = await prisma.school.findFirst();
            schoolId = firstSchool?.id || "temp-school-id"; 
        }

        const report = await prisma.schoolReport.create({
            data: {
                schoolId: schoolId,
                pupilsFedToday: Number(pupilsFedToday),
                menuServed,
                vendorName: vendorName || "N/A",
                qualityScore: Number(qualityScore) || 5,
                reportedByUserId: user?.id
            }
        });

        res.status(201).json({ message: "Report submitted successfully!", report });
    } catch (error) {
        console.error("Report Post error:", error);
        res.status(500).json({ error: "Failed to save report" });
    }
});

export default router;
