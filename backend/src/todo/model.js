const mongoose = require('mongoose');

const todoSchema = mongoose.Schema(
  {
    todo: {
      type: String,
      required: [true, 'Please enter what todo']
    },
    complete: {
      type: Boolean
    }
 
  },
  {
    timestamps: true
  }
);


const Todo = mongoose.model('todo', todoSchema);

module.exports = Todo;