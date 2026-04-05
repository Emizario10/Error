import { PrismaClient } from '@prisma/client';
import ProductTableClient from './ProductTableClient';

const prisma = new PrismaClient();

export default async function AdminPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="min-h-screen p-12 bg-[#000000] text-[#F3F4F6]">
      <header className="mb-8">
        <h1 className="text-3xl font-sans font-bold">Admin Dashboard</h1>
        <p className="text-sm text-[#cfcfcf]/80 mt-2">Manage products — Underground Chrome</p>
      </header>

      <main>
        {/* Pass server-fetched products to client table */}
        {/* ProductTableClient handles CRUD via API */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <ProductTableClient products={products} />
      </main>
    </div>
  );
}
