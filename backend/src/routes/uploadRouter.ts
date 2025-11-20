import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import Joi from 'joi';
import { validateQuery } from '../middleware/validateRequest';
import { parseCsvBuffer, parseJsonBuffer } from '../services/parseService';
import { analyzeData } from '../services/analysisService';
import { getCache, setCache } from '../cache/cache';
import { createUpload } from '../db/uploadRepository';

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

      const isJson =
        mimetype === 'application/json' ||
        originalname.toLowerCase().endsWith('.json');

      const rows = isJson ? parseJsonBuffer(buffer) : parseCsvBuffer(buffer);

      const analysis = analyzeData(rows);

      const uploadRecord = await createUpload({
        filename: originalname,
        size,
        mimeType: mimetype,
        rowsCount: rows.length,
        fileHash,
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
