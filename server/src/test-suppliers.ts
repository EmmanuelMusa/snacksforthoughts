import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    select: {
      role: true,
      state: true,
      isActive: true,
      companyName: true
    }
  })

  console.log('Total users:', users.length);
  const roleGroups = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('Users by Role:', roleGroups);
  
  const suppliers = users.filter(u => `${u.role}`.includes('SUPPLIER') || `${u.role}`.includes('VENDOR'))
  console.log('Potential Suppliers:', suppliers);
}

main().catch(console.error).finally(() => prisma.$disconnect())
