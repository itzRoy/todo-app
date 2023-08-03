import jwt from 'jsonwebtoken';
import config from '../config.js';
import { Types } from 'mongoose';
import { ParsedQs } from 'qs';

const createToken = (id: Types.ObjectId): string => {
  return jwt.sign({ id }, config.tokenSecret, { expiresIn: 7200});
};

const parseQueryParam = (queryParams: ParsedQs): {[key: string]: any} => {
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

export { createToken, parseQueryParam}