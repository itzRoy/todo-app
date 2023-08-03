import { Types } from 'mongoose';
import {createToken, parseQueryParam} from '../utils/index.js';
import Todo, { ITodo } from './model.js';
import User from '../user/model.js';
import { Request, Response } from 'express';
import { IbasicResponse, Irequest } from '../declarations.js'
import { Document } from 'mongoose';

const ObjectId = Types.ObjectId;

type TpaginationResponse = {
  result: ITodo[] | [],
  totalItems: number,
  completeCount: number,
  totalPages: number,
  currentPage: number
}

const getTodos = async (req: Irequest, res: Response<IbasicResponse<TpaginationResponse>>) => {
  const userId = req.userId;
  const { page, limit, ...filter} = parseQueryParam(req.query);

  const pageLimit = limit || 10; 
  const currentPage = page || 1; 
  const queryFilter = filter || {};
  const skip = (currentPage - 1) * pageLimit;

  const userDoc = await User.findById(userId);

  const paginatedTodo = await Todo.aggregate([
    {
      $match: {
        ...queryFilter,
        _id: { $in: userDoc?.todoList },
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
                  $cond: [{ $eq: ['$complete', true] }, 1, 0], // New count (total count of documents with complete: true)
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

    return res.status(500).json({status: 500, success: false, message: 'internal server error'});
    
  }
};


const addTodo = async (req: Irequest<{todo: string}>, res: Response<IbasicResponse>) => {
  const {userId} = req;


  try {
    const savedTodo = await Todo.create({
      todo: req.body.todo,
      complete: false
    });

    await User.findOneAndUpdate({_id: userId}, {$push: {todoList: new ObjectId(savedTodo._id)}});
    return res.status(201).json({ status: 201, success: true, message: 'Todo created', data: savedTodo });

  } catch (error) {

    return res.status(500).json({ status: 500, success: false, message: 'Internal Server Error', error });

  }


};

const deleteTodo = async (req: Irequest, res: Response<IbasicResponse>) => {
  const {userId} = req;
  const id = req.params.id;
  const todoExists = await Todo.findById(id);

  if (!todoExists) {
    return res.status(404).json({ status: 404, success: false, message: 'Todo not found' });
  }

  try {
    await Todo.deleteOne({_id: id});
    await User.findOneAndUpdate({_id: userId}, {$pull: {todoList: new ObjectId(id)}});
    return res.status(200).json({ status: 200, success: true, message: 'Todo deleted'});
  } catch (error) {
    return res.status(500).json({ status: 500, success: false, message: 'something went wrong' });
  }
};

const toggleDone = async (req: Irequest, res: Response<IbasicResponse<(Document<unknown, {}, ITodo> & ITodo & {
  _id: Types.ObjectId;
}) | null>>) => {
  const id = req.params.id;

  const todoExists = await Todo.findById({_id: id});

  if (!todoExists) {
    return res.status(404).json({ status: 404, success: false, message: 'Todo not found' });
  }

  try {

    await Todo.updateOne({_id: id}, {$set: {complete: !todoExists.complete}});
    const updatedTodo = await Todo.findById(id);
    return res.status(200).json({ status: 200, success: true, message: 'Todo updated', data: updatedTodo});

  } catch (error) {
    return res.status(500).json({ status: 500, success: false, message: 'something went wrong' });
  }
};

export { toggleDone, addTodo, deleteTodo, getTodos}