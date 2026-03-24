"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const schools_1 = __importDefault(require("./routes/schools"));
const vendors_1 = __importDefault(require("./routes/vendors"));
const donations_1 = __importDefault(require("./routes/donations"));
const companies_1 = __importDefault(require("./routes/companies"));
const suppliers_1 = __importDefault(require("./routes/suppliers"));
const breakfast_donations_1 = __importDefault(require("./routes/breakfast-donations"));
const auth_1 = __importDefault(require("./routes/auth"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const supply_chain_1 = __importDefault(require("./routes/supply-chain"));
const safety_1 = __importDefault(require("./routes/safety"));
dotenv_1.default.config();
const app = (0, express_1.default)();
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
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or some server-side fetches)
        if (!origin)
            return callback(null, true);
        const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1') || origin.startsWith('http://192.168.');
        const isOfficialDomain = allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.onrender.com');
        if (isLocalhost || isOfficialDomain) {
            callback(null, true);
        }
        else {
            // Instead of throwing an error that returns HTML, we just don't allow the origin.
            // This will cause a standard CORS failure in the browser rather than a server-side crash/HTML response.
            console.warn(`CORS attempt from unrecognized origin: ${origin}`);
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('uploads'));
app.get('/', (_req, res) => {
    res.json({
        status: "Online",
        version: "1.0.1",
        message: "National Digital School Feeding Platform API - Production",
        timestamp: new Date().toISOString()
    });
});
app.get('/api/health', (_req, res) => {
    res.json({ ok: true, version: "1.0.1" });
});
app.use('/api/schools', schools_1.default);
app.use('/api/vendors', vendors_1.default);
app.use('/api/donations', donations_1.default);
app.use('/api/companies', companies_1.default);
app.use('/api/suppliers', suppliers_1.default);
app.use('/api/breakfast-donations', breakfast_donations_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/dashboard', dashboard_1.default);
app.use('/api/supply-chain', supply_chain_1.default);
app.use('/api/safety', safety_1.default);
// Catch-all for undefined routes
app.use((_req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
});
// Error handler to ensure JSON response instead of HTML
app.use((err, _req, res, _next) => {
    console.error("Unhandle error:", err);
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});
const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
