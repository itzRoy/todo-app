import { Types, Document, ObjectId } from 'mongoose';
import {createError} from '../utils/index.js';
import Todo, { ITodo } from './model.js';
import User from '../user/model.js';
import { NextFunction, Response } from 'express';
import { IbasicResponse, Irequest } from '../declarations.js';
import redisClient from '../redisClient.js';
const ObjectId = Types.ObjectId;

type TpaginationResponse = {
  result: ITodo[] | [],
  totalItems: number,
  completeCount: number,
  totalPages: number,
  currentPage: number
}

type TQuery = {page: number; limit: number; search: string; filter?: {complete: boolean; userId: ObjectId}}

const deletePagesCach = async (userPages: string) => {

  const cachExists = await redisClient.exists(userPages);

  if (cachExists) {

    await redisClient.del(userPages);
  }

};

const getTodos = async (req: Irequest<unknown, TQuery>, res: Response<IbasicResponse<TpaginationResponse>>, next: NextFunction) => {
  const userId = req.userId;
  
  const { page, limit, search, ...filter} = req.query;
  
  const queryFilter = filter || {};
  const skip = (page - 1) * limit;
  const cachKey = `user:${userId}page:${page}limit:${limit}search:${search}filter:${JSON.stringify(filter)}`;
  const userPages = `pages:${userId}`;

  try {

    const cachExists = await redisClient.hExists(userPages, cachKey);

    if (cachExists) {
      
      const result = await redisClient.HGET(userPages, cachKey);
      
      if (result) {

        res.status(200).json({status: 200, success: true, message: 'Success', data: JSON.parse(result)});
        return next();
        
      }
    } else {
      const userDoc = await User.findById(userId);

      const paginatedTodo = await Todo.aggregate([
        {
          $match: {
            ...queryFilter,
            _id: { $in: userDoc?.todoList },
            todo: { $regex: search, $options: 'i' },
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
              { $limit: limit },
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
      const totalPages = Math.ceil(totalItems / limit);
      const data = {result: paginatedTodoData, totalItems, completeCount, totalPages, currentPage: page };

      await redisClient.HSET(userPages, [cachKey, JSON.stringify(data)]);
      res.status(200).json({status: 200, success: true, message: 'Success', data});
      return next();
    }

  } catch (error) {

    return next(createError('something went wrong', 500));
    
  }
};


const addTodo = async (req: Irequest<{todo: string}>, res: Response<IbasicResponse>, next: NextFunction) => {
  const {userId} = req;


  try {
    await deletePagesCach(`pages:${userId}`);

    const savedTodo = await Todo.create({
      todo: req.body.todo,
      complete: false
    });

    await User.findOneAndUpdate({_id: userId}, {$push: {todoList: new ObjectId(savedTodo._id)}});
    return res.status(201).json({ status: 201, success: true, message: 'Todo created', data: savedTodo });

  } catch (error) {

    return next(createError('something went wrong', 500));

  }


};

const deleteTodo = async (req: Irequest, res: Response<IbasicResponse>, next: NextFunction) => {
  const {userId} = req;
  const id = req.params.id;
  const todoExists = await Todo.findById(id);

  if (!todoExists) {
    return next(createError('Todo not found', 404));
  }

  try {
    await deletePagesCach(`pages:${userId}`);
    await Todo.deleteOne({_id: id});
    await User.findOneAndUpdate({_id: userId}, {$pull: {todoList: new ObjectId(id)}});
    return res.status(200).json({ status: 200, success: true, message: 'Todo deleted'});
  } catch (error) {
    return next(createError('something went wrong', 500));
  }
};

const toggleDone = async (req: Irequest, res: Response<IbasicResponse<(Document<unknown, unknown, ITodo> & ITodo & {
  _id: Types.ObjectId;
}) | null>>, next: NextFunction) => {
  const id = req.params.id;
  
  const { userId } = req;

  const todoExists = await Todo.findById({_id: id});

  if (!todoExists) {
    return next(createError('Todo not found', 404));
  }

  try {
    await deletePagesCach(`pages:${userId}`);
    await Todo.updateOne({_id: id}, {$set: {complete: !todoExists.complete}});
    const updatedTodo = await Todo.findById(id);
    return res.status(200).json({ status: 200, success: true, message: 'Todo updated', data: updatedTodo});

  } catch (error) {
    
    return next(createError('something went wrong', 500));
  }
};

export { toggleDone, addTodo, deleteTodo, getTodos};