import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

// Multer setup for verifier proof uploads
const uploadDir = path.join(process.cwd(), 'uploads', 'proofs');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'proof-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

router.get('/admin/overview', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
    try {
        const [
            totalRequests,
            completedRequests,
            uniqueSchoolsData,
            verifiedSuppliers,
            totalDonors,
            pupilStats,
            distinctStates,
            distinctLGAs,
            deliveredRequests,
            pendingRequests,
            sponsorshipDays,
            statusBreakdown
        ] = await Promise.all([
            prisma.supplyRequest.count(),
            prisma.supplyRequest.count({ where: { status: 'VERIFIED' } }),
            prisma.school.groupBy({ by: ['name'] }),
            prisma.user.count({ where: { role: 'SUPPLIER' } }),
            prisma.user.count({ where: { role: 'DONOR' } }),
            prisma.school.aggregate({ _sum: { studentCount: true } }),
            prisma.school.findMany({ where: { NOT: [{ state: null }, { state: "" }] }, distinct: ['state'], select: { state: true } }),
            prisma.school.findMany({ where: { NOT: [{ lga: null }, { lga: "" }] }, distinct: ['lga'], select: { lga: true } }),
            prisma.supplyRequest.count({ where: { status: 'DELIVERED' } }),
            prisma.supplyRequest.count({ 
                where: { 
                    status: { 
                        in: ['PAYMENT_CONFIRMED', 'ADMIN_APPROVED', 'SUPPLIER_ALLOCATED', 'DISPATCHED'] as any
                    } 
                } 
            }),
            prisma.supplyRequest.count({ 
                where: { 
                    supplyDate: { contains: '2026' } 
                } 
            }),
            prisma.supplyRequest.groupBy({
                by: ['status'],
                _count: { _all: true }
            })
        ]);

        const totalSchools = uniqueSchoolsData.length;

        // Estimated school days per year (approx 190)
        const schoolDaysPerYear = 190;
        const totalPossibleSchoolDays = totalSchools * schoolDaysPerYear;
        const sponsorshipDaysCount = sponsorshipDays;
        const unsponsoredDays = Math.max(0, totalPossibleSchoolDays - sponsorshipDaysCount);

        res.json({
            totalRequests,
            completedRequests,
            totalSchools,
            verifiedSuppliers,
            totalStates: distinctStates.length,
            totalLGAs: distinctLGAs.length,
            totalPupils: pupilStats._sum.studentCount || 0,
            totalDonors,
            sponsoredDays: sponsorshipDaysCount,
            unsponsoredDays: unsponsoredDays,
            suppliesDelivered: deliveredRequests,
            pendingDeliveries: pendingRequests,
            completedFeedingDays: completedRequests,
            statusBreakdown
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch admin overview" });
    }
});

router.get('/admin/geo-stats', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
    try {
        const { state, lga } = req.query;

        if (state && lga) {
            // Detailed stats for specific LGA (Schools list)
            const schools = await prisma.school.findMany({
                where: { state: String(state), lga: String(lga) },
                include: {
                    _count: {
                        select: { supplyRequests: true }
                    }
                }
            });
            return res.json({ type: 'lga', data: schools });
        }

        if (state) {
            // Stats for specific State (LGAs list)
            const lgas = await prisma.school.groupBy({
                by: ['lga'],
                where: { state: String(state) },
                _count: { id: true },
                _sum: { studentCount: true }
            });
            return res.json({ type: 'state', data: lgas });
        }

        // Summary for Nigeria (States list)
        const states = await prisma.school.groupBy({
            by: ['state'],
            _count: { id: true },
            _sum: { studentCount: true }
        });
        
        res.json({ type: 'country', data: states });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch geo stats" });
    }
});

router.get('/admin/supplies', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
    try {
        const supplies = await prisma.supplyRequest.findMany({
            include: {
                donor: { select: { name: true, email: true } },
                supplier: { select: { companyName: true, name: true } },
                school: { select: { name: true, state: true, lga: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(supplies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch supply ledger" });
    }
});

// Admin Status Override
router.patch('/admin/request/:id/status', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
    try {
        const { status } = req.body;
        const updated = await prisma.supplyRequest.update({
            where: { id: req.params.id },
            data: { status }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Failed to update request status" });
    }
});

// Admin User Management
router.get('/admin/users', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                state: true,
                isActive: true,
                companyName: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

router.patch('/admin/user/:id', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
    try {
        const { isActive, role, state } = req.body;
        const updated = await prisma.user.update({
            where: { id: req.params.id },
            data: { isActive, role, state }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
});

// ==========================================
// SUPPLIER ENDPOINTS
// ==========================================

router.get('/supplier/requests', authenticateToken, requireRole(['SUPPLIER', 'ADMIN']), async (req: any, res) => {
    try {
        // Find requests assigned to this supplier
        const supplierId = req.user.id;
        const requests = await prisma.supplyRequest.findMany({
            where: { supplierId },
            include: {
                donor: { select: { name: true, email: true } },
                school: { select: { name: true, state: true, lga: true, address: true, phone: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch supplier requests" });
    }
});

router.post('/supplier/request/:id/status', authenticateToken, requireRole(['SUPPLIER']), async (req: any, res) => {
    try {
        const { status } = req.body;
        const requestId = req.params.id;
        
        // Ensure the supplier owns this request
        const supplyRequest = await prisma.supplyRequest.findUnique({ where: { id: requestId } });
        if (!supplyRequest || supplyRequest.supplierId !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized to update this request." });
        }

        const updated = await prisma.supplyRequest.update({
            where: { id: requestId },
            data: { status }
        });
        res.json({ message: "Status updated successfully", request: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update status" });
    }
});

// ==========================================
// VERIFIER ENDPOINTS
// ==========================================

router.get('/verifier/requests', authenticateToken, requireRole(['VERIFIER', 'ADMIN']), async (req: any, res) => {
    try {
        const state = req.user.state;
        if (!state) return res.status(400).json({ error: "Verifier has no state assigned." });

        // Verifiers see DELIVERED or VERIFIED requests in their state
        const requests = await prisma.supplyRequest.findMany({
            where: {
                school: { state: state },
                status: { in: ['DELIVERED', 'VERIFIED'] }
            },
            include: {
                supplier: { select: { companyName: true, name: true } },
                school: { select: { name: true, state: true, lga: true } }
            },
            orderBy: { updatedAt: 'desc' }
        });
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch verifier requests" });
    }
});

router.post('/verifier/request/:id/verify', authenticateToken, requireRole(['VERIFIER']), upload.single('evidence'), async (req: any, res) => {
    try {
        const requestId = req.params.id;
        const supplyRequest = await prisma.supplyRequest.findUnique({ 
            where: { id: requestId },
            include: { school: true }
        });

        if (!supplyRequest) return res.status(404).json({ error: "Supply request not found." });
        
        // Ensure it's in the verifier's state
        if (supplyRequest.school.state !== req.user.state) {
            return res.status(403).json({ error: "Unauthorized: Request is in a different state." });
        }

        let proofUrl = null;
        if (req.file) {
            proofUrl = `/uploads/proofs/${req.file.filename}`;
        }

        const updated = await prisma.supplyRequest.update({
            where: { id: requestId },
            data: { 
                status: 'VERIFIED',
                proofImageUrl: proofUrl || supplyRequest.proofImageUrl 
            }
        });
        res.json({ message: "Supply verified successfully", request: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to verify request" });
    }
});

// ==========================================
// DONOR ENDPOINTS
// ==========================================

router.get('/donors/suppliers/:state', async (req, res) => {
    try {
        const stateName = req.params.state.toUpperCase();
        const suppliers = await prisma.user.findMany({
            where: { role: 'SUPPLIER', state: stateName },
            select: {
                id: true,
                companyName: true,
                accountDetails: true,
                contactInfo: true,
                state: true
            }
        });
        res.json(suppliers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch suppliers for state" });
    }
});

router.post('/donor/request', authenticateToken, requireRole(['DONOR']), async (req: any, res) => {
    try {
        const { schoolId, supplierId, academicPeriod, items } = req.body;
        const donorId = req.user.id;

        if (!schoolId || !supplierId || !academicPeriod || !items) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const request = await prisma.supplyRequest.create({
            data: {
                donorId,
                schoolId,
                supplierId,
                academicPeriod,
                items, // JSON array
                status: 'PAYMENT_CLAIMED' // Instantly assume they've hit "I've made payment"
            }
        });

        res.status(201).json({ message: "Supply request initiated", request });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create supply request" });
    }
});

// Backward compatibility or public stats
router.get('/public', async (req, res) => {
    try {
        res.json({});
    } catch (err) {
        res.json({});
    }
});

export default router;
