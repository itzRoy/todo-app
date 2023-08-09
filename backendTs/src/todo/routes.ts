import {Router} from 'express';

import {addTodo, deleteTodo, getTodos, toggleDone} from './controller.js';
import validator from '../middlware/validator.js';
import { AddTodoSchema, ParamValidationSchema } from './validation.schema.js';

const router = Router();

router.get('/', getTodos);
router.post('/', validator(AddTodoSchema, 'body'), addTodo);
router.delete('/:id', validator(ParamValidationSchema, 'params'), deleteTodo);
router.put('/:id', validator(ParamValidationSchema, 'params'), toggleDone);

export default router;