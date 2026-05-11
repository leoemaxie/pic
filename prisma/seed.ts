import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const STAPLE_PRODUCTS = [
  { name: "Tomatoes", unit: "crate", category: "vegetable" },
  { name: "Rice", unit: "bag", category: "grain" },
  { name: "Onions", unit: "crate", category: "vegetable" },
  { name: "Pepper", unit: "crate", category: "vegetable" },
  { name: "Beans", unit: "bag", category: "grain" },
  { name: "Vegetable Oil", unit: "jug", category: "oil" },
  { name: "Eggs", unit: "carton", category: "protein" },
  { name: "Flour", unit: "bag", category: "grain" },
];

async function main() {
  console.log("Seeding database...");

  // Create products
  for (const product of STAPLE_PRODUCTS) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });
  }

  console.log(`Created ${STAPLE_PRODUCTS.length} products`);

  // Create demo retailer
  const retailerUser = await prisma.user.upsert({
    where: { phone: "+2348012345678" },
    update: {},
    create: {
      phone: "+2348012345678",
      name: "Ngozi · Retailer",
      persona: "retailer",
      region: "Lagos",
    },
  });

  const retailer = await prisma.retailer.upsert({
    where: { userId: retailerUser.id },
    update: {},
    create: {
      userId: retailerUser.id,
    },
  });

  // Create demo wholesalers
  const wholesalerUsers = [
    { phone: "+2348000111111", name: "Ibrahim", region: "Kano" },
    { phone: "+2348000222222", name: "Aisha", region: "Ibadan" },
    { phone: "+2348000333333", name: "Chukwu", region: "Lagos" },
  ];

  for (const wu of wholesalerUsers) {
    const user = await prisma.user.upsert({
      where: { phone: wu.phone },
      update: {},
      create: {
        ...wu,
        persona: "wholesaler",
      },
    });

    await prisma.wholesaler.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
      },
    });
  }

  console.log("Seeding complete");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
