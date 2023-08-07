import {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLFloat, GraphQLBoolean} from 'graphql';
import User from './model.js';
import { createError, createToken } from '../utils/index.js';

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
        const { email, password } = args;
        const user = await User.findOne({email});
              
        if (!user || password !== user.password) {
          throw createError('wrong credentials', 401);
        }
        if (user && user._id) {
          const access_token = createToken(user._id); 
              
          return {access_token};
              
        }
      }
    },
    signup: {
      type: Signup,
      args: {email: {type: GraphQLString}, password: {type: GraphQLString}, confirmPassword: {type: GraphQLString}},
      resolve: async function(parent, args) {
        const {email, password, confirmPassword} = args;

        const isUserExists = await User.findOne({email});

        if (password !== confirmPassword) {
          throw createError('Password do not match', 400);
        }
            
        if (isUserExists) {
          throw createError('User already exists', 409);
            
        }
            
        await User.create({email, password, todoList: []});
            
        return {status: 201, success: true, message: 'user created'};
            
      }
    }
  }
});

export default new GraphQLSchema({query: RootQuery});