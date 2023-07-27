const express = require('express');

const todoController = require('./controller');

const router = express.Router();

router.get('/', todoController.getTodos);
router.post('/', todoController.addTodo);
router.delete('/:id', todoController.deleteTodo);
router.put('/:id', todoController.toggleDone);

module.exports = router;