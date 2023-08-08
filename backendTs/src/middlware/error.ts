import { IbasicResponse, Irequest } from '../declarations.js';
import { NextFunction, Response } from 'express';
import { CustomError } from '../utils/index.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const error = (error: CustomError, req: Irequest, res: Response<IbasicResponse>, next: NextFunction) => {
  res.status(error.status).json({message: error.message, status: error.status, success: false});
};

export default error;