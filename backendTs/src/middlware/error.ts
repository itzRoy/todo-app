import { IbasicResponse, Irequest } from '../declarations.js';
import { NextFunction, Response } from 'express';
import { CustomError } from '../utils/index.js';
import redisClient from '../redisClient.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const error = async (error: CustomError, req: Irequest, res: Response<IbasicResponse>, next: NextFunction) => {
  if (redisClient.isOpen) await redisClient.quit();
  
  res.status(error.status).json({message: error.message, status: error.status, success: false});
};

export default error;