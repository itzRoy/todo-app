import { IbasicResponse, Irequest } from '../declarations.js';
import { NextFunction, Response } from 'express';
import redisClient from '../redisClient.js';

const openRedisConnection = async (req: Irequest, res: Response<IbasicResponse>, next: NextFunction) => {
  
  if (!redisClient.isOpen) await redisClient.connect();

  next();
};

export default openRedisConnection;