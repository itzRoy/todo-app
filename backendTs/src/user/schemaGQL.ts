import {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLFloat, GraphQLBoolean} from 'graphql';
import User from './model.js';
import { createError, createToken } from '../utils/index.js';
import bcrypt from 'bcrypt';

const AuthData = new GraphQLObjectType({
  name: 'AuthData',
  fields: () => ({
    access_token: { type: GraphQLString}

  })
});

const Signup = new GraphQLObjectType({
  name: 'Signup',
  fields: () => ({
    status: {type: GraphQLFloat},
    message: {type: GraphQLString},
    success: { type: GraphQLBoolean}
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    login: {
      type: AuthData,
      args: {email: {type: GraphQLString}, password: {type: GraphQLString}},
      resolve: async function(parent, args) {
        try {
          const { email, password } = args;
          const user = await User.findOne({email});
        
      
          if (!user) throw createError('user not found', 404);
        
          bcrypt.compare(password, user.password, (err, isMatch: boolean) => {
            
            if (isMatch) {
              const access_token = createToken(user._id); 
        
              return {access_token};
            } 
            
            throw createError('wrong credentials', 401);
          });
      
        } catch {
          throw createError('something went wrong', 500);
        }
      
      }
    },
    
    signup: {
      type: Signup,
      args: {email: {type: GraphQLString}, password: {type: GraphQLString}, confirmPassword: {type: GraphQLString}},
      resolve: async function(parent, args) {
        const {email, password, confirmPassword} = args;

        try {
          const isUserExists = await User.findOne({email});
      
          if (password !== confirmPassword) {
            throw createError('Password do not match', 400);
          }
      
          if (isUserExists) {
            throw createError('User already exists', 409);
      
          }
      
          bcrypt.hash(password, 10, async (err, hashedPass: string) => {
            
            if (err) throw createError('something went wrong while hashing the password', 400);
      
            await User.create({email, password: hashedPass, todoList: []});
            return {status: 201, success: true, message: 'user created'};
          });
        } catch (error) {
        
          
          throw createError('something went wrong', 500);
      
        }
      }
    }
  }
});

export default new GraphQLSchema({query: RootQuery});