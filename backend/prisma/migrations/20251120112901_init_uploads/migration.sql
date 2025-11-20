-- This file was created by running `prisma migrate dev --name init_uploads`
PRAGMA foreign_keys = ON;

CREATE TABLE "Upload" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "filename" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "rowsCount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileHash" TEXT NOT NULL
);

CREATE UNIQUE INDEX "Upload_fileHash_key" ON "Upload"("fileHash");
-- CreateTable
CREATE TABLE "Upload" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "rowsCount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileHash" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Upload_fileHash_key" ON "Upload"("fileHash");
