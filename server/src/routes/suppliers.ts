import { Router } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

const supplierSchema = z.object({
    name: z.string().min(1),
    logo: z.string().url().optional(),
    description: z.string().optional(),
    specialties: z.array(z.string()),
    rating: z.number().min(0).max(5).optional(),
    deliveryAreas: z.array(z.string()),
    accountDetails: z.object({
        bankName: z.string(),
        accountNumber: z.string(),
        accountName: z.string()
    }),
    contactInfo: z.object({
        phone: z.string(),
        email: z.string().email()
    }),
    verified: z.boolean().optional()
})

router.get('/', async (_req, res) => {
    try {
        const suppliers = await prisma.supplier.findMany({
            where: { verified: true },
            orderBy: { rating: 'desc' }
        })
        res.json(suppliers)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch suppliers' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const supplier = await prisma.supplier.findUnique({
            where: { id: req.params.id }
        })
        if (!supplier) return res.status(404).json({ error: 'Supplier not found' })
        res.json(supplier)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch supplier' })
    }
})

router.post('/', async (req, res) => {
    try {
        const parsed = supplierSchema.safeParse(req.body)
        if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

        const supplier = await prisma.supplier.create({
            data: parsed.data
        })
        res.status(201).json(supplier)
    } catch (error) {
        res.status(500).json({ error: 'Failed to create supplier' })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const parsed = supplierSchema.partial().safeParse(req.body)
        if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

        const supplier = await prisma.supplier.update({
            where: { id: req.params.id },
            data: parsed.data
        })
        res.json(supplier)
    } catch (error) {
        res.status(500).json({ error: 'Failed to update supplier' })
    }
})

export default router
