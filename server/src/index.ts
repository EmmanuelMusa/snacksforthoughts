require('dotenv').config();
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { z } from 'zod'
import schoolsRouter from './routes/schools'
import vendorsRouter from './routes/vendors'
import donationsRouter from './routes/donations'
import companiesRouter from './routes/companies'
import suppliersRouter from './routes/suppliers'
import breakfastDonationsRouter from './routes/breakfast-donations'
import authRouter from './routes/auth'
import dashboardRouter from './routes/dashboard'
import supplyChainRouter from './routes/supply-chain'
import safetyRouter from './routes/safety'

dotenv.config()

const app = express()

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'https://www.snacksforthoughts.com',
    'https://snacksforthoughts.com',
    'https://snacksforthoughts-frontend.onrender.com'
]

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or some server-side fetches)
        if (!origin) return callback(null, true);
        
        const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1') || origin.startsWith('http://192.168.');
        const isOfficialDomain = allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.onrender.com');

        if (isLocalhost || isOfficialDomain) {
            callback(null, true)
        } else {
            // Instead of throwing an error that returns HTML, we just don't allow the origin.
            // This will cause a standard CORS failure in the browser rather than a server-side crash/HTML response.
            console.warn(`CORS attempt from unrecognized origin: ${origin}`);
            callback(null, false); 
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}))
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.get('/', (_req, res) => {
    res.json({ 
        status: "Online", 
        version: "1.0.1", 
        message: "National Digital School Feeding Platform API - Production",
        timestamp: new Date().toISOString()
    });
});

app.get('/api/health', (_req, res) => {
    res.json({ ok: true, version: "1.0.1" })
})

app.use('/api/schools', schoolsRouter)
app.use('/api/vendors', vendorsRouter)
app.use('/api/donations', donationsRouter)
app.use('/api/companies', companiesRouter)
app.use('/api/suppliers', suppliersRouter)
app.use('/api/breakfast-donations', breakfastDonationsRouter)
app.use('/api/auth', authRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/supply-chain', supplyChainRouter)
app.use('/api/safety', safetyRouter)

// Catch-all for undefined routes
app.use((_req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
});

// Error handler to ensure JSON response instead of HTML
app.use((err: any, _req: any, res: any, _next: any) => {
    console.error("Unhandle error:", err);
    res.status(err.status || 500).json({ 
        error: err.message || "Internal Server Error",
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})
