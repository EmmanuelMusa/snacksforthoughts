import { Router } from 'express'
import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

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
