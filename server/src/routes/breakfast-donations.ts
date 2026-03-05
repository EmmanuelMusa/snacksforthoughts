import { Router } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

const breakfastDonationSchema = z.object({
    donorName: z.string().min(1),
    schoolId: z.string().min(1),
    supplierId: z.string().min(1),
    selectedWeeks: z.array(z.string()),
    totalAmount: z.number().int().positive(),
    costPerStudent: z.number().int().positive().optional(),
    studentCount: z.number().int().positive(),
    paymentReference: z.string().optional()
})

router.get('/', async (_req, res) => {
    try {
        const donations = await prisma.breakfastDonation.findMany({
            include: {
                school: true,
                supplier: true
            },
            orderBy: { createdAt: 'desc' }
        })
        res.json(donations)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch breakfast donations' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const donation = await prisma.breakfastDonation.findUnique({
            where: { id: req.params.id },
            include: {
                school: true,
                supplier: true
            }
        })
        if (!donation) return res.status(404).json({ error: 'Donation not found' })
        res.json(donation)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch donation' })
    }
})

router.post('/', async (req, res) => {
    try {
        const parsed = breakfastDonationSchema.safeParse(req.body)
        if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

        const donation = await prisma.breakfastDonation.create({
            data: {
                ...parsed.data,
                costPerStudent: parsed.data.costPerStudent || 50
            },
            include: {
                school: true,
                supplier: true
            }
        })
        res.status(201).json(donation)
    } catch (error) {
        res.status(500).json({ error: 'Failed to create breakfast donation' })
    }
})

router.patch('/:id/confirm-payment', async (req, res) => {
    try {
        const { paymentReference } = req.body

        const donation = await prisma.breakfastDonation.update({
            where: { id: req.params.id },
            data: {
                paymentConfirmed: true,
                paymentReference,
                status: 'PAYMENT_CONFIRMED'
            },
            include: {
                school: true,
                supplier: true
            }
        })

        // In a real app, you would notify the supplier here
        // For now, we'll just update the status
        setTimeout(async () => {
            await prisma.breakfastDonation.update({
                where: { id: req.params.id },
                data: { status: 'SUPPLIER_NOTIFIED' }
            })
        }, 2000)

        res.json(donation)
    } catch (error) {
        res.status(500).json({ error: 'Failed to confirm payment' })
    }
})

router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body

        if (!['PENDING', 'PAYMENT_CONFIRMED', 'SUPPLIER_NOTIFIED', 'IN_PROGRESS', 'DELIVERED', 'COMPLETED', 'CANCELLED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' })
        }

        const donation = await prisma.breakfastDonation.update({
            where: { id: req.params.id },
            data: { status },
            include: {
                school: true,
                supplier: true
            }
        })
        res.json(donation)
    } catch (error) {
        res.status(500).json({ error: 'Failed to update donation status' })
    }
})

export default router
