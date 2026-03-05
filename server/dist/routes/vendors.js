"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
const vendorSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    category: zod_1.z.string().min(1),
    verified: zod_1.z.boolean().optional(),
    contact: zod_1.z.string().optional(),
    portfolio: zod_1.z.string().url().optional(),
});
router.get('/', async (_req, res) => {
    const vendors = await prisma.vendor.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(vendors);
});
router.get('/pending', async (_req, res) => {
    const vendors = await prisma.vendor.findMany({ where: { verified: false }, orderBy: { createdAt: 'desc' } });
    res.json(vendors);
});
router.get('/:id', async (req, res) => {
    const vendor = await prisma.vendor.findUnique({ where: { id: req.params.id } });
    if (!vendor)
        return res.status(404).json({ error: 'Not found' });
    res.json(vendor);
});
router.post('/', async (req, res) => {
    const parsed = vendorSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const created = await prisma.vendor.create({ data: parsed.data });
    res.status(201).json(created);
});
router.put('/:id', async (req, res) => {
    const parsed = vendorSchema.partial().safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    try {
        const updated = await prisma.vendor.update({ where: { id: req.params.id }, data: parsed.data });
        res.json(updated);
    }
    catch {
        res.status(404).json({ error: 'Not found' });
    }
});
router.patch('/:id/verify', async (req, res) => {
    try {
        const updated = await prisma.vendor.update({ where: { id: req.params.id }, data: { verified: true } });
        res.json(updated);
    }
    catch {
        res.status(404).json({ error: 'Not found' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        await prisma.vendor.delete({ where: { id: req.params.id } });
        res.status(204).end();
    }
    catch {
        res.status(404).json({ error: 'Not found' });
    }
});
exports.default = router;
