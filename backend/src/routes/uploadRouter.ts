import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import Joi from 'joi';
import { validateQuery } from '../middleware/validateRequest';
import { parseCsvBuffer, parseJsonBuffer } from '../services/parseService';
import { analyzeData } from '../services/analysisService';
import { getCache, setCache } from '../cache/cache';
import { createUpload, findUploadByHash } from '../db/uploadRepository';

const router = Router();

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

const querySchema = Joi.object({
  format: Joi.string().valid('json', 'csv').default('json'),
});

router.post(
  '/',
  upload.single('file'),
  validateQuery(querySchema),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'File is required' });
      }

      const { buffer, originalname, mimetype, size } = req.file as any;
      const fileHash = crypto.createHash('sha256').update(buffer).digest('hex');

      const cached = await getCache<any>(fileHash);
      if (cached) {
        return res.json({ cacheHit: true, ...cached });
      }

      // If we've already stored an Upload with this hash, return the stored
      // analysis/preview when available (no need to re-parse the file).
      const existing = await findUploadByHash(fileHash);
      if (existing) {
        if (existing.analysis && existing.rawPreview) {
          const responsePayload = {
            cacheHit: true,
            uploadId: existing.id,
            analysis: existing.analysis,
            rawPreview: existing.rawPreview,
          };

          await setCache(fileHash, responsePayload, 300);
          return res.json(responsePayload);
        }

        // If DB record lacks analysis (older records), compute it, persist,
        // and return it.
        const isJson =
          mimetype === 'application/json' ||
          originalname.toLowerCase().endsWith('.json');

        const rows = isJson ? parseJsonBuffer(buffer) : parseCsvBuffer(buffer);

        const analysis = analyzeData(rows);
        const rawPreview = rows.slice(0, 200);

        // Update DB so future requests can return stored results.
        try {
          // Import is deferred to avoid circular imports at top-level.
          const { updateUploadAnalysis } = await import('../db/uploadRepository');
          await updateUploadAnalysis(existing.id, analysis, rawPreview);
        } catch (e) {
          // Non-fatal: if update fails, we still return the computed analysis.
          console.warn('Failed to persist analysis for existing upload', e);
        }

        const responsePayload = {
          cacheHit: true,
          uploadId: existing.id,
          analysis,
          rawPreview,
        };

        await setCache(fileHash, responsePayload, 300);
        return res.json(responsePayload);
      }

      const isJson =
        mimetype === 'application/json' ||
        originalname.toLowerCase().endsWith('.json');

      const rows = isJson ? parseJsonBuffer(buffer) : parseCsvBuffer(buffer);

      const analysis = analyzeData(rows);

      const rawPreview = rows.slice(0, 200);
      const uploadRecord = await createUpload({
        filename: originalname,
        size,
        mimeType: mimetype,
        rowsCount: rows.length,
        fileHash,
        analysis,
        rawPreview,
      });

      const responsePayload = {
        cacheHit: false,
        uploadId: uploadRecord.id,
        analysis,
        rawPreview: rows.slice(0, 200),
      };

      await setCache(fileHash, responsePayload, 300);

      return res.json(responsePayload);
    } catch (err) {
      return next(err);
    }
  },
);

export default router;
