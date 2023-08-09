import {Request} from 'express';
import { JwtPayload } from 'jsonwebtoken';
import * as core from 'express-serve-static-core';

export interface Irequest<T = unknown, TQuery = unknown> extends Request<core.ParamsDictionary, unknown, T, core.Query & TQuery> { 
    userId: string | JwtPayload
}

export interface IbasicResponse<T = unknown> {
    status: number
    success: boolean
    message: string
    data?: T
    error?: unknown
}