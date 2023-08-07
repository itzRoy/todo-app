import jwt from 'jsonwebtoken';
import config from '../config.js';
import { Types } from 'mongoose';
import { ParsedQs } from 'qs';

const createToken = (id: Types.ObjectId): string => {
  return jwt.sign({ id }, config.tokenSecret, { expiresIn: 7200});
};

const parseQueryParam = (queryParams: ParsedQs): {[key: string]: number} => {
  const parsedParams = {};

  for (const key in queryParams) {
    if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
      const value = queryParams[key];
      if (value === 'true') {
        parsedParams[key] = true;
      } else if (value === 'false') {
        parsedParams[key] = false;
      } else if (!isNaN(Number(value))) {
        parsedParams[key] = Number(value);
      } else {
        parsedParams[key] = value;
      }
    }
  }

  return parsedParams;
};
interface CustomError extends Error {
  status: number;
}

class CreateError extends Error implements CustomError {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.message = message;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}


const createError = (message: string, status: number) => {
  return new CreateError(message, status);
  
};

const isEmailAddress = (value: string): boolean => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(value);
};
export { createToken, parseQueryParam, createError, isEmailAddress, CustomError};
