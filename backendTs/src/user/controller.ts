import User, { IUser } from './model.js';
import {createToken} from '../utils/index.js';
import { Request, Response } from 'express';
import { IbasicResponse } from '../declarations.js';

const signup = async (req: Request, res: Response<IbasicResponse>) => {
  const { email, password, confirmPassword } = req.body;

  try {
    const isUserExists = await User.findOne({email});

    if (password !== confirmPassword) {
      return res.status(400).json({  status: 400, success: false, message: 'Password do not match' });
    }

    if (isUserExists) {

      return res.status(409).json({ status: 409, success: false, message: 'User already exists' });

    }

    await User.create({email, password, todoList: []});

    return res.status(201).json({status: 201, success: true, message: 'user created'});

  } catch (error) {

    return res.status(500).json({status: 500, success: false, message: 'something went wrong', error});

  }
};

const login = async (req: Request, res: Response<IbasicResponse<{access_token: string}>>) => {

  const { email, password } = req.body;
  const user = await User.findOne({email});

  if (!user || password !== user.password) {

    return res.status(401).json({status: 401, success: false, message: 'wrong credentials'});

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