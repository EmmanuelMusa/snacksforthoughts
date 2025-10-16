import { Router } from 'express'
import { z } from 'zod'
import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()
const router = Router()

const vendorSchema = z.object({
    name: z.string().min(1),
    category: z.string().min(1),
    verified: z.boolean().optional(),
    contact: z.string().optional(),
    portfolio: z.string().url().optional(),
})

router.get('/', async (_req, res) => {
    const vendors = await prisma.vendor.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(vendors)
})

router.get('/pending', async (_req, res) => {
    const vendors = await prisma.vendor.findMany({ where: { verified: false }, orderBy: { createdAt: 'desc' } })
    res.json(vendors)
})

router.get('/:id', async (req, res) => {
    const vendor = await prisma.vendor.findUnique({ where: { id: req.params.id } })
    if (!vendor) return res.status(404).json({ error: 'Not found' })
    res.json(vendor)
})

router.post('/', async (req, res) => {
    const parsed = vendorSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
    const created = await prisma.vendor.create({ data: parsed.data })
    res.status(201).json(created)
})

router.put('/:id', async (req, res) => {
    const parsed = vendorSchema.partial().safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
    try {
        const updated = await prisma.vendor.update({ where: { id: req.params.id }, data: parsed.data })
        res.json(updated)
    } catch {
        res.status(404).json({ error: 'Not found' })
    }
})

router.patch('/:id/verify', async (req, res) => {
    try {
        const updated = await prisma.vendor.update({ where: { id: req.params.id }, data: { verified: true } })
        res.json(updated)
    } catch {
        res.status(404).json({ error: 'Not found' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await prisma.vendor.delete({ where: { id: req.params.id } })
        res.status(204).end()
    } catch {
        res.status(404).json({ error: 'Not found' })
    }
})

export default router
