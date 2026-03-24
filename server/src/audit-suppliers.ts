import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const schools = await prisma.school.count()
  console.log('Total Schools Found:', schools)

  const suppliers = await prisma.user.findMany({
    where: { role: Role.SUPPLIER },
    select: { state: true, isActive: true, id: true, name: true }
  })

  console.log('Total Suppliers Found:', suppliers.length)
  
  const stateCounts: Record<string, number> = {}
  suppliers.forEach(s => {
    const key = s.state || 'NO STATE'
    stateCounts[key] = (stateCounts[key] || 0) + 1
  })

  console.log('Suppliers by State:', JSON.stringify(stateCounts, null, 2))
  
  const inactive = suppliers.filter(s => !s.isActive)
  console.log('Inactive Suppliers:', inactive.length)
}

main().catch(console.error).finally(() => prisma.$disconnect())
