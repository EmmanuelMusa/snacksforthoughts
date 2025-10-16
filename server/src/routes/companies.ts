import { Router } from 'express'
import { z } from 'zod'
import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()
const router = Router()

const companySchema = z.object({
    name: z.string().min(1),
    logo: z.string().url().optional(),
    description: z.string().optional(),
    supportedCauses: z.array(z.string()).optional().default([]),
    partnershipType: z.string().optional(),
    contact: z.string().optional(),
})

router.get('/', async (_req, res) => {
    const companies = await prisma.company.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(companies)
})

router.post('/', async (req, res) => {
    const parsed = companySchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
    const created = await prisma.company.create({ data: parsed.data })
    res.status(201).json(created)
})

export default router


