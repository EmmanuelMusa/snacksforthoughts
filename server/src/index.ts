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

dotenv.config()

const app = express()

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://www.snacksforthoughts.com',
    'https://snacksforthoughts.com'
]

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}))
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.get('/api/health', (_req, res) => {
    res.json({ ok: true })
})

app.use('/api/schools', schoolsRouter)
app.use('/api/vendors', vendorsRouter)
app.use('/api/donations', donationsRouter)
app.use('/api/companies', companiesRouter)
app.use('/api/suppliers', suppliersRouter)
app.use('/api/breakfast-donations', breakfastDonationsRouter)

const port = process.env.PORT ? Number(process.env.PORT) : 4000
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})
