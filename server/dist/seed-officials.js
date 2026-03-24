"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("Seeding dashboard officials...");
    const roles = [
        { role: 'NATIONAL_CMD', name: 'National Commander', nin: '11111111111' },
        { role: 'STATE_CONTROL', name: 'State Controller (Lagos)', nin: '22222222222', state: 'Lagos' },
        { role: 'LGA_MONITOR', name: 'LGA Monitor (Ikeja)', nin: '33333333333', state: 'Lagos', lga: 'Ikeja' },
        { role: 'SCHOOL_REPORTER', name: 'School Reporter', nin: '44444444444' }
    ];
    const passwordHash = await bcryptjs_1.default.hash('password123', 10);
    for (const data of roles) {
        // use upsert to create or update
        await prisma.user.upsert({
            where: { nin: data.nin },
            update: {
                role: data.role,
                state: data.state,
                lga: data.lga,
                passwordHash
            },
            create: {
                name: data.name,
                nin: data.nin,
                passwordHash,
                role: data.role,
                state: data.state,
                lga: data.lga
            }
        });
        console.log(`Created user: ${data.name} | NIN: ${data.nin} | Password: password123 | Role: ${data.role}`);
    }
    console.log("Seeding complete.");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
