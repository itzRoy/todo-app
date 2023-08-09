import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { createError } from '../utils/index.js';

const validator = (schema: Joi.ObjectSchema, target: 'body' | 'params' | 'query') => (
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const values = await schema.validateAsync(req[target]);
      req[target] = values;
      
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