import { Router } from 'express'
import { z } from 'zod'
import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()
const router = Router()

const schoolSchema = z.object({
    name: z.string().min(1),
    location: z.string().min(1),
    needType: z.string().min(1),
    description: z.string().min(1),
    image: z.string().url().optional(),
    targetAmount: z.number().int().nonnegative(),
    raisedAmount: z.number().int().nonnegative().optional(),
})

router.get('/', async (_req, res) => {
    const schools = await prisma.school.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(schools)
})

router.get('/:id', async (req, res) => {
    const school = await prisma.school.findUnique({ where: { id: req.params.id } })
    if (!school) return res.status(404).json({ error: 'Not found' })
    res.json(school)
})

router.post('/', async (req, res) => {
    const parsed = schoolSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
    const created = await prisma.school.create({ data: parsed.data })
    res.status(201).json(created)
})

router.put('/:id', async (req, res) => {
    const parsed = schoolSchema.partial().safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
    try {
        const updated = await prisma.school.update({ where: { id: req.params.id }, data: parsed.data })
        res.json(updated)
    } catch {
        res.status(404).json({ error: 'Not found' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await prisma.school.delete({ where: { id: req.params.id } })
        res.status(204).end()
    } catch {
        res.status(404).json({ error: 'Not found' })
    }
})

export default router
