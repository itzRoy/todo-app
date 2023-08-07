import {GraphQLObjectType, GraphQLString, GraphQLID, GraphQLSchema, GraphQLFloat, GraphQLBoolean, GraphQLList, GraphQLInputObjectType, GraphQLInt} from 'graphql';
import User from '../user/model.js';
import { createError } from '../utils/index.js';
import Todo from './model.js';
import { Types } from 'mongoose';


const ObjectId = Types.ObjectId;

const TodoData = new GraphQLObjectType({
  name: 'TodoData',
  fields: () => ({
    _id: { type: GraphQLID},
    todo: { type: GraphQLString},
    complete: { type: GraphQLBoolean},
    createdAt: { type: GraphQLString}

  })
});

const GetTodosData = new GraphQLObjectType({
  name: 'GetTodosData',
  fields: () => ({
    completeCount: {type: GraphQLInt},
    totalItems: {type: GraphQLInt},
    totalPages: {type: GraphQLInt},
    currentPage: {type: GraphQLInt},
    result: {
      type: new GraphQLList(TodoData)
    }
  })
});
const GetTodos = new GraphQLObjectType({
  name: 'GetTodos',
  fields: () => ({
    status: {type: GraphQLInt},
    success: {type: GraphQLBoolean},
    message: {type: GraphQLString},
    data: {type: GetTodosData }
  })
});

const SuccessResponse = new GraphQLObjectType({
  name: 'SuccessResponse',
  fields: () => ({

    success: {type: GraphQLBoolean},
    message: {type: GraphQLString},
    status: {type: GraphQLInt}
  })


});

const FilterType = new GraphQLInputObjectType({
  name: 'FilterType',
  fields: {complete: {type: GraphQLBoolean}}
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    getTodos: {
      type: GetTodos,
      args: { 
        access_token: {type: GraphQLString},
        page: {type: GraphQLFloat}, 
        limit: {type: GraphQLFloat},
        filter:{type: FilterType},
        search: {type: GraphQLString}
      },

      resolve: async function(src, args, context) {
        const {userId} = context;
          
        const {page, limit, search, filter} = args;


        const currentPage = page || 1;
        const pageLimit = limit || 15;
        const queryFilter = filter || {};
        const skip = (currentPage - 1) * pageLimit;

    
        const userDoc = await User.findById(userId);

        const paginatedTodo = await Todo.aggregate([
          {
            $match: {
              ...queryFilter,
              _id: { $in: userDoc?.todoList },
              todo: { $regex: search.toString() || '', $options: 'i' },
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $facet: {
              paginatedData: [
                { $skip: skip },
                { $limit: pageLimit },
              ],
              totalCount: [
                {
                  $group: {
                    _id: null,
                    totalItems: { $sum: 1 }, 
                    completeCount: {
                      $sum: {
                        $cond: [{ $eq: ['$complete', true] }, 1, 0], 
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            $unwind: { path: '$totalCount', preserveNullAndEmptyArrays: true },
          },
          {
            $project: {
              paginatedData: 1,
              totalCount: {
                total: { $ifNull: ['$totalCount.totalItems', 0] },
                completeCount: '$totalCount.completeCount',
              },
            },
          },
        ]);
    
    
        const paginatedTodoData = paginatedTodo[0].paginatedData;
        const totalItems = paginatedTodo[0].totalCount.total;
        const completeCount = paginatedTodo[0].totalCount.completeCount;
        const totalPages = Math.ceil(totalItems / pageLimit);

        // const lll = await User.findById(userId)?.populate('todoList');
        // console.log(lll);

        return {status: 200, success: true, message: 'Success', data: {result: paginatedTodoData, totalItems, completeCount, totalPages, currentPage} };
        
      }
    },
    addTodo: {
      type: SuccessResponse,
      args: {todo: {type: GraphQLString}},
      resolve: async function(source, {todo}, context) {

        const {userId} = context;

        try {
          const savedTodo = await Todo.create({
            todo,
            complete: false
          });

  
          await User.findOneAndUpdate({_id: userId}, {$push: {todoList: new ObjectId(savedTodo._id)}});
          return { status: 201, success: true, message: 'Todo created'};
  
        } catch (error) {
  
          return createError('something went wrong', 500);
  
        }
      }
    }
  }
});

export default new GraphQLSchema({query: RootMutation, mutation: RootMutation});