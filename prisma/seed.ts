import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: 'Heavy Cuban Link Chain',
      description: 'Solid stainless-steel chain finished in matte chrome; extra weight for presence.',
      price: 5500, // $55.00
      imageUrl:
        'https://images.unsplash.com/photo-1526178612120-1b6a47b8d9b6?q=80&w=1400&auto=format&fit=crop&crop=entropy',
      category: 'HARDWARE',
    },
    {
      name: 'Titanium Signet Ring',
      description: 'Laser-etched signet with industrial matte finish.',
      price: 3500, // $35.00
      imageUrl:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1400&auto=format&fit=crop&crop=entropy',
      category: 'HARDWARE',
    },
    {
      name: 'Y2K Wraparound Visor',
      description: 'Wraparound visor with anti-glare coating — dystopian silhouettes.',
      price: 8000, // $80.00
      imageUrl:
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1400&auto=format&fit=crop&crop=entropy',
      category: 'OPTICS',
    },
    {
      name: 'Void Black Acetate Shades',
      description: 'Opaque acetate shades for maximum anonymity and style.',
      price: 4500, // $45.00
      imageUrl:
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1400&auto=format&fit=crop&crop=entropy',
      category: 'OPTICS',
    },
    {
      name: 'Tactical Crossbody Rig',
      description: 'Modular crossbody rig with MOLLE-compatible attachment points.',
      price: 7900, // $79.00
      imageUrl:
        'https://images.unsplash.com/photo-1591014749839-8f8a6b6f1b42?q=80&w=1400&auto=format&fit=crop&crop=entropy',
      category: 'UTILITY',
    },
    {
      name: 'Field Utility Pouch',
      description: 'Weatherproof pouch for tools and small optics.',
      price: 2800, // $28.00
      imageUrl:
        'https://images.unsplash.com/photo-1556909210-09f4d6a64a8b?q=80&w=1400&auto=format&fit=crop&crop=entropy',
      category: 'UTILITY',
    },
  ];

  for (const p of products) {
    // Use upsert to avoid duplicates on re-run
    await prisma.product.upsert({
      where: { name: p.name },
      update: {},
      create: {
        name: p.name,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        category: p.category,
      },
    });
  }

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
