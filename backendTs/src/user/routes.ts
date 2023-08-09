import {Router} from 'express';
import {login, logout, signup} from './controller.js';
import { SignupSchema } from './validation.schema.js';
import validator from '../middlware/validator.js';


const router = Router();

router.post('/signup', validator(SignupSchema, 'body'), signup);
router.post('/login', validator(SignupSchema, 'body'), login);
router.post('/logout', logout);

export default router;