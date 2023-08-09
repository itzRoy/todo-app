import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { createError } from '../utils/index.js';

const validator = (schema: Joi.ObjectSchema, target: 'body' | 'params') => (
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      await schema.validateAsync(req[target]);
      return next();

    } catch (error: unknown) {

      if (error instanceof Joi.ValidationError) {
        return next(createError(error.details[0].message, 422));
      }
      next();
    }
  }
);

export default validator;