import Joi from 'joi';
const SignupSchema = Joi.object({
  email: Joi.string().min(6).required(),

  password: Joi.string().min(1).required(),

  confirmPassword: Joi.string().valid(Joi.ref('password')).messages({
    'any.only': 'Passwords do not match.',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().required(),
  
  password: Joi.string().min(5).required(),
  
});

export { SignupSchema, loginSchema};