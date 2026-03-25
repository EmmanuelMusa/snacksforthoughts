import { Router } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import multer from 'multer'

const prisma = new PrismaClient()
const router = Router()
const upload = multer({ dest: 'uploads/' })

const donationSchema = z.object({
    donorName: z.string().min(1),
    amount: z.number().int().positive().optional(),
    schoolId: z.string().min(1),
    date: z.string().datetime().optional(),
    type: z.enum(['CASH', 'IN_KIND']),
    kindType: z.string().optional(),
    kindDesc: z.string().optional(),
})

router.get('/', async (req, res) => {
    const schoolId = typeof req.query.schoolId === 'string' ? req.query.schoolId : undefined
    const limit = typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined

    const donations = await prisma.donation.findMany({
        where: schoolId ? { schoolId } : undefined,
        include: { school: true },
        orderBy: { date: 'desc' },
        take: limit && Number.isFinite(limit) ? Math.max(1, Math.min(100, Math.floor(limit))) : undefined,
    })
    res.json(donations)
})

router.post('/', upload.single('image'), async (req, res) => {
    const data = { ...req.body, amount: req.body.amount ? Number(req.body.amount) : undefined }
    const parsed = donationSchema.safeParse(data)
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
    const { donorName, amount, schoolId, date, type, kindType, kindDesc } = parsed.data
    const imageUrl = (req.file && req.file.path) || undefined
    try {
        const donation = await prisma.$transaction(async (tx) => {
            const created = await tx.donation.create({ data: { donorName, amount, schoolId, date: date ? new Date(date) : undefined, type, kindType, kindDesc, imageUrl } })
            if (type === 'CASH' && amount) {
                await tx.school.update({ where: { id: schoolId }, data: { raisedAmount: { increment: amount } } })
            }
            return created
        })
        res.status(201).json(donation)
    } catch (e) {
        res.status(400).json({ error: 'Invalid school or data' })
    }
})

export default router
