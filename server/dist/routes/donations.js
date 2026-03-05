"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const donationSchema = zod_1.z.object({
    donorName: zod_1.z.string().min(1),
    amount: zod_1.z.number().int().positive().optional(),
    schoolId: zod_1.z.string().min(1),
    date: zod_1.z.string().datetime().optional(),
    type: zod_1.z.enum(['CASH', 'IN_KIND']),
    kindType: zod_1.z.string().optional(),
    kindDesc: zod_1.z.string().optional(),
});
router.get('/', async (req, res) => {
    const schoolId = typeof req.query.schoolId === 'string' ? req.query.schoolId : undefined;
    const limit = typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined;
    const donations = await prisma.donation.findMany({
        where: schoolId ? { schoolId } : undefined,
        include: { school: true },
        orderBy: { date: 'desc' },
        take: limit && Number.isFinite(limit) ? Math.max(1, Math.min(100, Math.floor(limit))) : undefined,
    });
    res.json(donations);
});
router.post('/', upload.single('image'), async (req, res) => {
    const data = { ...req.body, amount: req.body.amount ? Number(req.body.amount) : undefined };
    const parsed = donationSchema.safeParse(data);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const { donorName, amount, schoolId, date, type, kindType, kindDesc } = parsed.data;
    const imageUrl = (req.file && req.file.path) || undefined;
    try {
        const donation = await prisma.$transaction(async (tx) => {
            const created = await tx.donation.create({ data: { donorName, amount, schoolId, date: date ? new Date(date) : undefined, type, kindType, kindDesc, imageUrl } });
            if (type === 'CASH' && amount) {
                await tx.school.update({ where: { id: schoolId }, data: { raisedAmount: { increment: amount } } });
            }
            return created;
        });
        res.status(201).json(donation);
    }
    catch (e) {
        res.status(400).json({ error: 'Invalid school or data' });
    }
});
exports.default = router;
