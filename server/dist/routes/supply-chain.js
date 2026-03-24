"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const supplies = await prisma.foodSupply.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(supplies);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch supplies" });
    }
});
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { product, quantity, unit, state, sourceId, destinationId, status } = req.body;
        const supply = await prisma.foodSupply.create({
            data: { product, quantity, unit, state, sourceId, destinationId, status }
        });
        res.status(201).json(supply);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create supply" });
    }
});
exports.default = router;
