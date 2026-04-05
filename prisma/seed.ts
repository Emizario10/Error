import { prisma } from '../lib/prisma';

async function main() {
  const products = [
    {
      name: 'HEAVY CUBAN LINK CHAIN',
      description: 'Solid stainless-steel chain finished in matte chrome. 12mm gauge. Industrial presence.',
      price: 85.00,
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
      category: 'HARDWARE',
    },
    {
      name: 'TITANIUM SIGNET RING',
      description: 'Laser-etched aerospace titanium. Void-black finish. Minimalist brutality.',
      price: 45.00,
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop',
      category: 'HARDWARE',
    },
    {
      name: 'Y2K VOID VISOR',
      description: 'Wraparound polycarbonate visor. Anti-glare coating. Full anonymity protocol.',
      price: 120.00,
      imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1200&auto=format&fit=crop',
      category: 'OPTICS',
    },
    {
      name: 'NEON ACID SHADES',
      description: 'Translucent acid-green frames. Polarized black lenses. Integrated HUD aesthetics.',
      price: 95.00,
      imageUrl: 'https://images.unsplash.com/photo-1511499767390-903390e6fbc4?q=80&w=1200&auto=format&fit=crop',
      category: 'OPTICS',
    },
    {
      name: 'TACTICAL CROSSBODY RIG',
      description: 'Ballistic nylon construction. MOLLE-compatible webbing. 4-point magnetic buckle.',
      price: 110.00,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop',
      category: 'UTILITY',
    },
    {
      name: 'CARBON CARDHOLDER',
      description: '3K twill carbon fiber. RFID shielding. Holds 1-12 cards. Ultra-lightweight.',
      price: 55.00,
      imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1200&auto=format&fit=crop',
      category: 'UTILITY',
    },
  ];

  console.log('--- INITIALIZING ARSENAL DEPLOYMENT ---');

  for (const p of products) {
    await prisma.product.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
    console.log(`DEPLOYED: ${p.name}`);
  }

  console.log('--- SEEDING COMPLETE: ARSENAL ONLINE ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
