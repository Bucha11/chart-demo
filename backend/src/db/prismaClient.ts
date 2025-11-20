import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Ensure DATABASE_URL is defined for Prisma at runtime. Prefer environment variable,
// otherwise fallback to a local SQLite file inside prisma/ for development.
if (!process.env.DATABASE_URL) {
	// relative path from backend working directory to prisma DB file
	process.env.DATABASE_URL = 'file:./prisma/dev.db';
}

export const prisma = new PrismaClient();
