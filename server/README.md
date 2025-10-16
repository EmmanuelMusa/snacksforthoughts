# Server (Express + Prisma + PostgreSQL)

## Setup
1. Create `server/.env` with:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME"
PORT=4000
```
2. Install dependencies:
```
npm install
```
3. Generate client and run migrations:
```
npx prisma generate
npx prisma migrate dev --name init
```
4. Start dev server:
```
npm run dev
```

## Routes
- `GET /api/health`
- `CRUD /api/schools`
- `CRUD /api/vendors`
  - `PATCH /api/vendors/:id/verify`
- `POST /api/donations` and `GET /api/donations`
