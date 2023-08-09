import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

const AddTodoSchema = Joi.object({
  todo: Joi.string().min(1).required(),
});

const GetTodosSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(15),
  search: Joi.string().allow('').default(''),
  complete: Joi.boolean()
});

const ParamValidationSchema = Joi.object({
  id: Joi.string().custom((value, helpers) => {
    if (!isValidObjectId(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }).message('Invalid ObjectId format'),

});
export { AddTodoSchema, ParamValidationSchema, GetTodosSchema };