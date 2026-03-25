import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const supplies = await prisma.foodSupply.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(supplies);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch supplies" });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { product, quantity, unit, state, sourceId, destinationId, status } = req.body;
        const supply = await prisma.foodSupply.create({
            data: { product, quantity, unit, state, sourceId, destinationId, status }
        });
        res.status(201).json(supply);
    } catch (error) {
        res.status(500).json({ error: "Failed to create supply" });
    }
});

export default router;
