import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

// TEMPORARY: Reset all supplier passwords to 'password123'
router.post('/admin/reset-supplier-passwords', async (req, res) => {
    const { secret } = req.body;
    if (secret !== 'snacks-reset-2026') return res.status(403).json({ error: 'Unauthorized' });

    try {
        const passwordHash = await bcrypt.hash('password123', 10);
        const result = await prisma.user.updateMany({
            where: { role: Role.SUPPLIER },
            data: { passwordHash }
        });
        res.json({ success: true, message: `Reset ${result.count} supplier passwords to "password123"` });
    } catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});

// TEMPORARY: Diagnostic endpoint to see DB state
router.get('/admin/db-diagnostic', async (req, res) => {
    try {
        const roles = await prisma.user.groupBy({ by: ['role'], _count: { _all: true } });
        const states = await prisma.user.groupBy({ by: ['state'], _count: { _all: true } });
        const sampleUsers = await prisma.user.findMany({ 
            take: 10,
            select: { id: true, name: true, role: true, state: true, email: true, nin: true, isActive: true }
        });
        
        res.json({ roles, states, sampleUsers });
    } catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});

router.get('/test', (req, res) => {
    res.json({ success: true, message: "Router-level /api/donors/test works" })
})

// @route   GET /api/donors/suppliers/:state
// @desc    Get verified suppliers in a specific state
router.get('/suppliers/:state', async (req, res) => {
    try {
        const { state } = req.params
        console.log(`[DIAGNOSTIC] Fetching suppliers for state: "${state}"`)
        
        // Log all roles in the DB for debugging
        const allRoles = await prisma.user.groupBy({
            by: ['role'],
            _count: { _all: true }
        })
        console.log(`[DIAGNOSTIC] Current roles in DB:`, JSON.stringify(allRoles))

        const users = await prisma.user.findMany({
            where: {
                state: {
                    equals: state,
                    mode: 'insensitive'
                },
                isActive: true,
                role: Role.SUPPLIER
            },
            select: {
                id: true,
                name: true,
                companyName: true,
                accountDetails: true,
                contactInfo: true,
                state: true,
                lga: true,
                role: true
            }
        })
        
        console.log(`[DIAGNOSTIC] Found ${users.length} suppliers matching state "${state}" and role "SUPPLIER"`)
        if (users.length === 0) {
            // Check if there are any suppliers in OTHER states
            const otherSuppliers = await prisma.user.count({
                where: { role: Role.SUPPLIER, isActive: true }
            })
            console.log(`[DIAGNOSTIC] Total active suppliers in entire DB: ${otherSuppliers}`)
        }

        res.json({ success: true, data: users })
    } catch (error) {
        console.error('[DIAGNOSTIC] Error fetching suppliers:', error)
        res.status(500).json({ success: false, error: 'Failed to fetch suppliers' })
    }
})

// @route   POST /api/donors/request
// @desc    Initiate a new supply request for a school
router.post('/request', async (req, res) => {
    try {
        const { donorId, schoolId, supplierId, academicPeriod, supplyDate, items } = req.body
        const userId = (req as any).user?.id || donorId

        if (!userId) return res.status(401).json({ error: 'Please log in to confirm your donation.' })

        const supplyRequest = await (prisma as any).supplyRequest.create({
            data: {
                donorId: userId,
                schoolId,
                supplierId,
                academicPeriod,
                supplyDate,
                items,
                status: 'PENDING_PAYMENT'
            }
        })

        res.status(201).json(supplyRequest)
    } catch (error) {
        console.error('Error creating supply request:', error)
        res.status(500).json({ error: 'Failed to create supply request' })
    }
})

export default router
