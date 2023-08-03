import {Request} from 'express'
import { JwtPayload } from 'jsonwebtoken'
import * as core from 'express-serve-static-core';
import { Types } from 'mongoose'

export interface Irequest<T = any> extends Request<core.ParamsDictionary, any, T> { 
    userId: string | JwtPayload
}

export interface IbasicResponse<T = any> {
    status: number
    success: boolean
    message: string
    data?: T
    error?: any
}