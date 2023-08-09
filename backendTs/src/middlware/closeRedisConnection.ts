import { IbasicResponse, Irequest } from '../declarations.js';
import { NextFunction, Response } from 'express';
import redisClient from '../redisClient.js';

const closeRedisConnection = async (req: Irequest, res: Response<IbasicResponse>, next: NextFunction) => {
  
  if (redisClient.isOpen) await redisClient.quit();
  
  next();
};

export default closeRedisConnection;