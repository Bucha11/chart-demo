import { prisma } from './prismaClient';

interface CreateUploadInput {
  filename: string;
  size: number;
  mimeType: string;
  rowsCount: number;
  fileHash: string;
  analysis?: any;
  rawPreview?: any;
}

export async function createUpload(input: CreateUploadInput) {
  // Use upsert so re-uploading the same file (same `fileHash`) returns
  // the existing record instead of throwing a unique constraint error.
  const createData: any = {
    filename: input.filename,
    size: input.size,
    mimeType: input.mimeType,
    rowsCount: input.rowsCount,
    fileHash: input.fileHash,
  };

  if (input.analysis !== undefined) createData.analysis = JSON.stringify(input.analysis);
  if (input.rawPreview !== undefined) createData.rawPreview = JSON.stringify(input.rawPreview);

  return prisma.upload.upsert({
    where: { fileHash: input.fileHash },
    update: {},
    create: createData,
  });
}

export async function findUploadByHash(hash: string) {
  const rec: any = await prisma.upload.findUnique({ where: { fileHash: hash } });
  if (!rec) return null;
  // Parse stored JSON strings back into objects
  return {
    ...rec,
    analysis: rec.analysis ? JSON.parse(rec.analysis) : null,
    rawPreview: rec.rawPreview ? JSON.parse(rec.rawPreview) : null,
  };
}

export async function updateUploadAnalysis(id: string, analysis: any, rawPreview: any) {
  const data: any = {};
  if (analysis !== undefined) data.analysis = JSON.stringify(analysis);
  if (rawPreview !== undefined) data.rawPreview = JSON.stringify(rawPreview);
  return prisma.upload.update({ where: { id }, data });
}

export async function listUploads(limit = 50) {
  return prisma.upload.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}
