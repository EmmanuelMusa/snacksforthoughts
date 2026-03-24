import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';

router.post('/register', async (req, res) => {
    try {
        const { name, nin, email, password, role, state, lga, schoolId } = req.body;
        
        const existingUser = await prisma.user.findUnique({ where: { nin } });
        if (existingUser) {
            return res.status(400).json({ error: "User with this NIN already exists" });
        }

        const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;

        const user = await prisma.user.create({
            data: {
                name,
                nin,
                email,
                passwordHash,
                role,
                state,
                lga,
                schoolId
            }
        });

        const token = jwt.sign({ id: user.id, role: user.role, nin: user.nin }, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({ user: { id: user.id, name: user.name, role: user.role }, token });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: "Failed to register user" });
    }
});

router.get('/login', (_req, res) => {
    res.json({ message: "Auth endpoint is alive. Please use POST for login.", method: "GET" });
});

router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;
        
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { nin: identifier },
                    { email: identifier }
                ]
            }
        });
        
        if (!user || !user.passwordHash) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, role: user.role, nin: user.nin }, JWT_SECRET, { expiresIn: '24h' });

        const loginUserData: any = { 
            id: user.id, 
            name: user.name, 
            role: user.role,
            state: user.state,
            lga: user.lga,
            schoolId: user.schoolId
        };

        if (user.schoolId) {
            const school = await prisma.school.findUnique({ where: { id: user.schoolId } });
            if (school) loginUserData.schoolName = school.name;
        }

        res.json({ user: loginUserData, token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Failed to login" });
    }
});

export default router;
