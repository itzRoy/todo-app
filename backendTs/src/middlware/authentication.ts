import jwt, {JwtPayload, VerifyErrors} from 'jsonwebtoken';
import config from '../config.js';
import { NextFunction, Response } from 'express';
import { Irequest } from '../declarations.js';
import { Types } from 'mongoose';

interface Token extends JwtPayload {
  id?: Types.ObjectId
}
const authenticate = (req: Irequest, res: Response, next: NextFunction) => {
  const authCookie = req.cookies?.access_token as string;
  const authHeader = (req.headers?.authorization || req.headers?.Authorization);

  if (authCookie || authHeader) {
    jwt.verify(authHeader as string, config.tokenSecret, (err: VerifyErrors | null, decodedToken: Token) => {
    
      if (err) {
        if (err) res.status(403).json({ status: 403, success: false, message: 'Token is not valid!' });
      }
      else {
        if (decodedToken?.id) req.userId = decodedToken.id;
        next();
      }
    });
  }
  else {
    res.status(403).json({ success: false, message: 'Unauthorized!' });
  }
};

export default authenticate;