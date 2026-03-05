"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
const supplierSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    logo: zod_1.z.string().url().optional(),
    description: zod_1.z.string().optional(),
    specialties: zod_1.z.array(zod_1.z.string()),
    rating: zod_1.z.number().min(0).max(5).optional(),
    deliveryAreas: zod_1.z.array(zod_1.z.string()),
    accountDetails: zod_1.z.object({
        bankName: zod_1.z.string(),
        accountNumber: zod_1.z.string(),
        accountName: zod_1.z.string()
    }),
    contactInfo: zod_1.z.object({
        phone: zod_1.z.string(),
        email: zod_1.z.string().email()
    }),
    verified: zod_1.z.boolean().optional()
});
router.get('/', async (_req, res) => {
    try {
        const suppliers = await prisma.supplier.findMany({
            where: { verified: true },
            orderBy: { rating: 'desc' }
        });
        res.json(suppliers);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch suppliers' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const supplier = await prisma.supplier.findUnique({
            where: { id: req.params.id }
        });
        if (!supplier)
            return res.status(404).json({ error: 'Supplier not found' });
        res.json(supplier);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch supplier' });
    }
});
router.post('/', async (req, res) => {
    try {
        const parsed = supplierSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: parsed.error.flatten() });
        const supplier = await prisma.supplier.create({
            data: parsed.data
        });
        res.status(201).json(supplier);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create supplier' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const parsed = supplierSchema.partial().safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: parsed.error.flatten() });
        const supplier = await prisma.supplier.update({
            where: { id: req.params.id },
            data: parsed.data
        });
        res.json(supplier);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update supplier' });
    }
});
exports.default = router;
