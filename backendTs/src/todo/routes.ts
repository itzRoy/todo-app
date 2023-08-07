import {Router} from 'express';

import {addTodo, deleteTodo, getTodos, toggleDone} from './controller.js';

const router = Router();

router.get('/', getTodos);
router.post('/', addTodo);
router.delete('/:id', deleteTodo);
router.put('/:id', toggleDone);

export default router;