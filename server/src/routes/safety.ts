import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authenticateToken, requireRole(['NATIONAL_CMD', 'STATE_CONTROL', 'LGA_MONITOR']), async (req, res) => {
    try {
        const reports = await prisma.safetyReport.findMany({
            orderBy: { reportedAt: 'desc' }
        });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch safety reports" });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { type, description, targetId, status } = req.body;
        const report = await prisma.safetyReport.create({
            data: { type, description, targetId, status: status || 'Pending' }
        });
        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ error: "Failed to submit safety report" });
    }
});

export default router;
