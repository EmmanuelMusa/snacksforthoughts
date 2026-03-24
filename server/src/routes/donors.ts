import { Router } from 'express'
import { PrismaClient, Role } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()
const router = Router()

// @route   GET /api/donors/suppliers/:state
// @desc    Get verified suppliers in a specific state
router.get('/suppliers/:state', async (req, res) => {
    try {
        const { state } = req.params
        const suppliers = await prisma.user.findMany({
            where: {
                role: Role.SUPPLIER,
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
                lga: true
            }
        })
        res.json(suppliers)
    } catch (error) {
        console.error('Error fetching suppliers:', error)
        res.status(500).json({ error: 'Failed to fetch suppliers' })
    }
})

// @route   POST /api/donor/request
// @desc    Initiate a new supply request for a school
router.post('/request', async (req, res) => {
    try {
        const { schoolId, supplierId, academicPeriod, supplyDate, items } = req.body
        const donorId = (req as any).user?.id // Assuming middleware adds user

        if (!donorId) return res.status(401).json({ error: 'Unauthorized: Donor ID missing' })

        const supplyRequest = await prisma.supplyRequest.create({
            data: {
                donorId,
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
