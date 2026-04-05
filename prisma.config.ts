import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * PRISMA_7_CONFIG: Finalized for Supabase Connection Pooling.
 * Moves Database and Migrate URLs out of the schema file.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env["DATABASE_URL"],
    // directUrl: process.env["DIRECT_URL"],
  },
  migrations: {
    path: "prisma/migrations",
  },
});
