import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

// HELPER: Normalize state string for matching
const normalizeState = (s: string) => s ? s.toUpperCase().replace(/-/g, ' ').trim() : ''

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

// TEMPORARY: Reset all donor passwords to 'password123'
router.post('/admin/reset-donor-passwords', async (req, res) => {
    const { secret } = req.body;
    if (secret !== 'snacks-reset-2026') return res.status(403).json({ error: 'Unauthorized' });

    try {
        const passwordHash = await bcrypt.hash('password123', 10);
        const result = await prisma.user.updateMany({
            where: { role: Role.DONOR },
            data: { passwordHash }
        });
        res.json({ success: true, message: `Reset ${result.count} donor passwords to "password123"` });
    } catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});

// TEMPORARY: Diagnostic endpoint to see DB state
router.get('/admin/db-diagnostic', async (req, res) => {
    try {
        const roles = await prisma.user.groupBy({ by: ['role'], _count: { _all: true } });
        
        // Detailed state list
        const userStates = await prisma.user.groupBy({ by: ['state'], _count: { _all: true } });
        const schoolStates = await prisma.school.groupBy({ by: ['state'], _count: { _all: true } });
        
        const sampleUsers = await prisma.user.findMany({ 
            take: 20,
            where: { role: Role.SUPPLIER },
            select: { id: true, name: true, role: true, state: true, email: true, nin: true, isActive: true }
        });
        
        const inactiveCount = await prisma.user.count({ where: { role: Role.SUPPLIER, isActive: false } });
        const activeCount = await prisma.user.count({ where: { role: Role.SUPPLIER, isActive: true } });

        const sampleSchools = await prisma.school.findMany({ take: 5, select: { id: true, name: true, state: true } });

        res.json({ 
            roles, 
            userStates: userStates.sort((a, b) => (a.state || '').localeCompare(b.state || '')),
            schoolStates: schoolStates.sort((a, b) => (a.state || '').localeCompare(b.state || '')),
            sampleSuppliers: sampleUsers, 
            sampleSchools,
            stats: { activeSuppliers: activeCount, inactiveSuppliers: inactiveCount } 
        });
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
        const normState = normalizeState(state)
        console.log(`[DIAGNOSTIC] Fetching suppliers for state: "${state}" (Normalized: "${normState}")`)
        
        const users = await prisma.user.findMany({
            where: {
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
        
        // Manual filter to handle DB variations if Prisma 
        // string normalization isn't sufficient or consistent
        const filteredUsers = users.filter(u => normalizeState(u.state || '') === normState)

        console.log(`[DIAGNOSTIC] Found ${filteredUsers.length} suppliers matching state "${normState}" and role "SUPPLIER"`)
        
        res.json({ success: true, data: filteredUsers })
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
