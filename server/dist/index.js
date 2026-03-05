"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const schools_1 = __importDefault(require("./routes/schools"));
const vendors_1 = __importDefault(require("./routes/vendors"));
const donations_1 = __importDefault(require("./routes/donations"));
const companies_1 = __importDefault(require("./routes/companies"));
const suppliers_1 = __importDefault(require("./routes/suppliers"));
const breakfast_donations_1 = __importDefault(require("./routes/breakfast-donations"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('uploads'));
app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
});
app.use('/api/schools', schools_1.default);
app.use('/api/vendors', vendors_1.default);
app.use('/api/donations', donations_1.default);
app.use('/api/companies', companies_1.default);
app.use('/api/suppliers', suppliers_1.default);
app.use('/api/breakfast-donations', breakfast_donations_1.default);
const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
