import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { z } from 'zod'
import schoolsRouter from './routes/schools'
import vendorsRouter from './routes/vendors'
import donationsRouter from './routes/donations'
import companiesRouter from './routes/companies'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
    res.json({ ok: true })
})

app.use('/api/schools', schoolsRouter)
app.use('/api/vendors', vendorsRouter)
app.use('/api/donations', donationsRouter)
app.use('/api/companies', companiesRouter)

const port = process.env.PORT ? Number(process.env.PORT) : 4000
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})
