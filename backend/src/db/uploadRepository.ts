import { prisma } from './prismaClient';

interface CreateUploadInput {
  filename: string;
  size: number;
  mimeType: string;
  rowsCount: number;
  fileHash: string;
}

export async function createUpload(input: CreateUploadInput) {
  return prisma.upload.create({ data: input });
}

export async function findUploadByHash(hash: string) {
  return prisma.upload.findUnique({ where: { fileHash: hash } });
}

export async function listUploads(limit = 50) {
  return prisma.upload.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}
