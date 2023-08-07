import { Types, Document } from 'mongoose';
import {createError, parseQueryParam} from '../utils/index.js';
import Todo, { ITodo } from './model.js';
import User from '../user/model.js';
import { NextFunction, Response } from 'express';
import { IbasicResponse, Irequest } from '../declarations.js';

const ObjectId = Types.ObjectId;

type TpaginationResponse = {
  result: ITodo[] | [],
  totalItems: number,
  completeCount: number,
  totalPages: number,
  currentPage: number
}

const getTodos = async (req: Irequest, res: Response<IbasicResponse<TpaginationResponse>>, next: NextFunction) => {
  const userId = req.userId;
  const { page, limit, search, ...filter} = parseQueryParam(req.query);

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
        todo: { $regex: typeof search === 'number' ? search.toString() : search, $options: 'i' },
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
  try {

    return res.status(200).json({status: 200, success: true, message: 'Success', data: {result: paginatedTodoData, totalItems, completeCount, totalPages, currentPage}});

  } catch (error) {

    return next(createError('something went wrong', 500));
    
  }
};


const addTodo = async (req: Irequest<{todo: string}>, res: Response<IbasicResponse>, next: NextFunction) => {
  const {userId} = req;


  try {
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

  const todoExists = await Todo.findById({_id: id});

  if (!todoExists) {
    return next(createError('Todo not found', 404));
  }

  try {

    await Todo.updateOne({_id: id}, {$set: {complete: !todoExists.complete}});
    const updatedTodo = await Todo.findById(id);
    return res.status(200).json({ status: 200, success: true, message: 'Todo updated', data: updatedTodo});

  } catch (error) {
    return next(createError('something went wrong', 500));
  }
};

export { toggleDone, addTodo, deleteTodo, getTodos};