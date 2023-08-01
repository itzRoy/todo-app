const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    todoList: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'todo'  
    }]

    
  }
);

const User = mongoose.model('user', userSchema);

module.exports = User;