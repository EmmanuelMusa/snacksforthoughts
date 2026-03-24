import { Router } from 'express'
import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

// @route   GET /api/donors/suppliers/:state
// @desc    Get verified suppliers in a specific state
router.get('/suppliers/:state', async (req, res) => {
    try {
        const { state } = req.params
        console.log(`[API] Fetching suppliers for state: "${state}"`)
        
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
        
        console.log(`[API] Found ${users.length} suppliers for state: "${state}"`)
        res.json({ success: true, data: users })
    } catch (error) {
        console.error('Error fetching suppliers:', error)
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
