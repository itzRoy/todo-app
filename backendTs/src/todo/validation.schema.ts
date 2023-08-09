import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

const AddTodoSchema = Joi.object({
  todo: Joi.string().min(1).required(),
});

const ParamValidationSchema = Joi.object({
  id: Joi.string().custom((value, helpers) => {
    if (!isValidObjectId(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }).message('Invalid ObjectId format'),

});
export { AddTodoSchema, ParamValidationSchema };