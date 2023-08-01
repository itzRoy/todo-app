const utils = require('../utils');
const Todo = require('./model');
const User = require('../user/model');
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

exports.getTodos = async (req, res) => {
  const userId = req.userId;
  const { page, limit, ...filter} = utils.parseQueryParam(req.query);

  const pageLimit = limit || 10; 
  const currentPage = page || 1; 
  const queryFilter = filter || {};
  const skip = (currentPage - 1) * pageLimit;

  const userDoc = await User.findById(userId);

  const paginatedTodo = await Todo.aggregate([
    {
      $match: {
        ...queryFilter,
        _id: { $in: userDoc.todoList },
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

    return res.status(200).json({status: 200, success: true, result: paginatedTodoData, totalItems, completeCount, totalPages, currentPage});

  } catch (error) {

    return res.status('500').json({success: false, message: 'internal server error'});
    
  }
};


exports.addTodo = async (req, res) => {
  const {userId} = req;


  try {
    const savedTodo = await Todo.create({
      todo: req.body.todo,
      complete: false
    });

    await User.findOneAndUpdate({_id: userId}, {$push: {todoList: new ObjectId(savedTodo._id)}});
    return res.status(201).json({ success: true, message: 'Todo created', data: savedTodo });

  } catch (error) {

    return res.status(500).json({ success: false, message: 'Internal Server Error', error });

  }


};

exports.deleteTodo = async (req, res) => {
  const {userId} = req;
  const id = req.params.id;
  const todoExists = await Todo.findById(id);

  if (!todoExists) {
    return res.status(404).json({ success: false, message: 'Todo not found' });
  }

  try {
    await Todo.deleteOne({_id: id});
    await User.findOneAndUpdate({_id: userId}, {$pull: {todoList: new ObjectId(id)}});
    return res.status(200).json({ success: true, message: 'Todo deleted'});
  } catch (error) {
    return res.status(500).json({ success: false, message: 'something went wrong' });
  }
};

exports.toggleDone = async (req, res) => {
  const id = req.params.id;

  const todoExists = await Todo.findById({_id: id});

  if (!todoExists) {
    return res.status(404).json({ success: false, message: 'Todo not found' });
  }

  try {

    await Todo.updateOne({_id: id}, {$set: {complete: !todoExists.complete}});
    const updatedTodo = await Todo.findById({_id: id});
    return res.status(200).json({ success: true, message: 'Todo updated', todo: updatedTodo});

  } catch (error) {
    return res.status(500).json({ success: false, message: 'something went wrong' });
  }
};