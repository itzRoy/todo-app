import User, { IUser } from './model.js';
import {createError, createToken} from '../utils/index.js';
import { NextFunction, Request, Response } from 'express';
import { IbasicResponse } from '../declarations.js';

const signup = async (req: Request, res: Response<IbasicResponse>, next: NextFunction) => {
  const { email, password, confirmPassword } = req.body;

  try {
    const isUserExists = await User.findOne({email});

    if (password !== confirmPassword) {
      return next(createError('Password do not match', 400))
    }

    if (isUserExists) {
      return next(createError('User already exists', 409))

    }

    await User.create({email, password, todoList: []});

    return res.status(201).json({status: 201, success: true, message: 'user created'});

  } catch (error) {
    return next(createError('something went wrong', 500))

  }
};

const login = async (req: Request, res: Response<IbasicResponse<{access_token: string}>>, next: NextFunction) => {

  const { email, password } = req.body;
  const user = await User.findOne({email});

  if (!user || password !== user.password) {

    return next(createError('wrong credentials', 401))

  }

  const access_token = createToken(user._id); 

  return res.cookie('access_token', access_token, {maxAge: 7200, httpOnly: true}).status(200).json({ status: 200, success: true, message: 'logged in', data: {access_token}});


};

const logout = async (req: Request, res: Response<IbasicResponse>) => {
  res
    .clearCookie('access_token')
    .status(200)
    .header('Cache-Control', 'no-cache')
    .json({ status: 200, success: true, message: 'Successfully logged out' });
};

export { login, logout, signup}