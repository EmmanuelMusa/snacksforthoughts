"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
const companySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    logo: zod_1.z.string().url().optional(),
    description: zod_1.z.string().optional(),
    supportedCauses: zod_1.z.array(zod_1.z.string()).optional().default([]),
    partnershipType: zod_1.z.string().optional(),
    contact: zod_1.z.string().optional(),
});
router.get('/', async (_req, res) => {
    const companies = await prisma.company.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(companies);
});
router.post('/', async (req, res) => {
    const parsed = companySchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const created = await prisma.company.create({ data: parsed.data });
    res.status(201).json(created);
});
exports.default = router;
