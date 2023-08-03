import {Schema, model} from 'mongoose';

export interface ITodo {
  todo: string;
  complete: boolean;
}
const todoSchema = new Schema<ITodo>(
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


const Todo = model('todo', todoSchema);

export default Todo;
