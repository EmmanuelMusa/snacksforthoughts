import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

// @route   GET /api/donors/suppliers/:state
// @desc    Get verified suppliers in a specific state
router.get('/suppliers/:state', async (req, res) => {
    try {
        const { state } = req.params
        
        // Fetch users in the state, then filter by role in memory.
        // This prevents Prisma Enum mismatch errors if the live database hasn't updated its ENUM definition,
        // and also safely retrieves users who might still have the old 'VENDOR' role.
        const users = await (prisma.user as any).findMany({
            where: {
                state: {
                    equals: state,
                    mode: 'insensitive'
                },
                isActive: true
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
        
        const suppliers = users.filter((u: any) => u.role === 'SUPPLIER' || u.role === 'VENDOR')
        
        res.json(suppliers)
    } catch (error) {
        console.error('Error fetching suppliers:', error)
        res.status(500).json({ error: 'Failed to fetch suppliers' })
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
