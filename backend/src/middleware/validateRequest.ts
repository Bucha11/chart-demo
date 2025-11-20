import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export function validateQuery(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query);
    if (error) return res.status(400).json({ error: error.message });
    req.query = value as any;
    return next();
  };
}
