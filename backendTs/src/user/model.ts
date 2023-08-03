import {Schema, Types, model} from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  todoList: Types.ObjectId[] | []
  
}
const userSchema = new Schema<IUser>(
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
      type: Types.ObjectId,
      ref: 'todo'  
    }]

    
  }
);

const User = model('user', userSchema);

export default User;