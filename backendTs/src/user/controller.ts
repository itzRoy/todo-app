import User, { IUser } from './model.js';
import {createError, createToken} from '../utils/index.js';
import { NextFunction, Request, Response } from 'express';
import { IbasicResponse } from '../declarations.js';
import bcrypt from 'bcrypt';
import redisClient from '../redisClient.js';
import { Types } from 'mongoose';

const signup = async (req: Request, res: Response<IbasicResponse>, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const isUserExists = await User.findOne({email});

    if (isUserExists) {
      return next(createError('User already exists', 409));

    }

    bcrypt.hash(password, 10, async (err, hashedPass: string) => {
      
      if (err) return next(createError('something went wrong while hashing the password', 400));

      await User.create({email, password: hashedPass, todoList: []});
      return res.status(201).json({status: 201, success: true, message: 'user created'});
    });
  } catch (error) {
  
    
    return next(createError('something went wrong', 500));

  }
};

const login = async (req: Request, res: Response<IbasicResponse<{access_token: string}>>, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const userCachExists = await redisClient.exists(email);
    let user: IUser = { _id: new Types.ObjectId(), email: '', password: '', todoList: []} satisfies IUser;
    
    if (userCachExists) {
      
      const cachedUser = await redisClient.get(email);
      if (cachedUser) user = JSON.parse(cachedUser);

    } else {

      const userData = await User.findOne({email}, {todoList: 0}); 

      if (userData) {

        user = userData;

      } else {

        return next(createError('user not found', 404));

      }

    }

    bcrypt.compare(password, user.password, async (err, isMatch: boolean) => {
      
      if (isMatch) {
        const access_token = createToken(user._id); 
        await redisClient.set(email, JSON.stringify(user));
        res.cookie('access_token', access_token, {maxAge: 7200, httpOnly: true}).status(200).json({ status: 200, success: true, message: 'logged in', data: {access_token}});
        return next();
      } 

      return next(createError('wrong credentials', 401));
    });

  } catch (error) {

    return next(createError('something went wrong', 500));
  }


};

const logout = async (req: Request, res: Response<IbasicResponse>) => {
  res
    .clearCookie('access_token')
    .status(200)
    .header('Cache-Control', 'no-cache')
    .json({ status: 200, success: true, message: 'Successfully logged out' });
};

export { login, logout, signup};
