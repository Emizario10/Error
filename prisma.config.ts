import { defineConfig } from '@prisma/config';
import 'dotenv/config'; // Esto obliga al script a leer el archivo .env

export default defineConfig({
  // Ruta directa al esquema
  schema: 'prisma/schema.prisma',
  
  // En Prisma 7, la URL de conexión para el CLI va aquí:
  datasource: {
    url: process.env.DIRECT_URL,
  },

  // Y el comando de semilla va dentro de 'migrations'
  migrations: {
    seed: 'npx tsx prisma/seed.ts',
  },
});