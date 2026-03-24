"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/', auth_1.authenticateToken, (0, auth_1.requireRole)(['NATIONAL_CMD', 'STATE_CONTROL', 'LGA_MONITOR']), async (req, res) => {
    try {
        const reports = await prisma.safetyReport.findMany({
            orderBy: { reportedAt: 'desc' }
        });
        res.json(reports);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch safety reports" });
    }
});
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { type, description, targetId, status } = req.body;
        const report = await prisma.safetyReport.create({
            data: { type, description, targetId, status: status || 'Pending' }
        });
        res.status(201).json(report);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to submit safety report" });
    }
});
exports.default = router;
