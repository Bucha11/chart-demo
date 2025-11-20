import { Router } from 'express';
import { listUploads } from '../db/uploadRepository';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const uploads = await listUploads(50);
    return res.json({ uploads });
  } catch (err) {
    return next(err);
  }
});

export default router;
