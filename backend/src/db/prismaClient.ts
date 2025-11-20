import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Ensure DATABASE_URL is defined for Prisma at runtime. Prefer environment variable,
// otherwise fallback to a local SQLite file inside prisma/ for development.
import path from 'path';

if (!process.env.DATABASE_URL) {
	// Resolve absolute path to the SQLite file to avoid issues when cwd differs
	const dbPath = path.resolve(__dirname, '..', '..', 'prisma', 'dev.db');
	process.env.DATABASE_URL = `file:${dbPath}`;
}

export const prisma = new PrismaClient();
