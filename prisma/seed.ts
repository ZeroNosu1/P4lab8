import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // เพิ่มหมวดหมู่
  const electronics = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: { name: 'Electronics' },
  })

  const accessories = await prisma.category.upsert({
    where: { name: 'Accessories' },
    update: {},
    create: { name: 'Accessories' },
  })

  // เพิ่มสินค้า (ใช้ connect)
  await prisma.product.createMany({
    data: [
      {
        name: '1',
        description: '14 inch, Intel i5',
        price: 23900,
        categoryId: electronics.id,
      },
      {
        name: '2',
        description: 'Ergonomic design',
        price: 590,
        categoryId: accessories.id,
      },
      {
        name: '3',
        description: 'Noise Cancelling, Bluetooth 5.0',
        price: 1990,
        categoryId: accessories.id,
      },
    ],
    skipDuplicates: true,
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
