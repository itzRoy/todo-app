import dbConnet from './dbConnect.js';
import express, { Response } from 'express';
import authMiddleware from './middlware/authentication.js';
import config from './config.js';
import cors from 'cors';
import userRoutes from './user/routes.js';
import todoRoutes from './todo/routes.js';
import cookieParser from 'cookie-parser';
import { graphqlHTTP } from 'express-graphql';
import registerSchema from './user/schemaGQL.js';
import authenticatedSchema from './todo/schemaGQL.js';
import error from './middlware/error.js';
import { Irequest } from './declarations.js';

dbConnet();

const PORT = config.port || 5000;

const app = express();


app.use(cors({
  origin: ['http://localhost:5173', 'https://todo-app-itzroy.vercel.app'],
  credentials: true,
}));
app.use(express.json());

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRoutes);
app.use('/api/todo', authMiddleware, todoRoutes);
app.use('/api/health', (req, res: Response) => {
  res.send('health checked');
});

app.use('/api/graphql/auth', graphqlHTTP({
  schema: registerSchema,
  graphiql: true,
  customFormatErrorFn(e) {
    if (!e.originalError) {
      return e;
    }
    return { ...e.originalError, message: e.originalError.message};
    
  }
}));


app.use('/api/graphql', authMiddleware, graphqlHTTP((req: Irequest) => {
  return ({
    schema: authenticatedSchema,
    graphiql: true,
    context: req,
    customFormatErrorFn(e) {
      if (!e.originalError) {
        return e;
      }
      return { ...e.originalError, message: e.originalError.message};
    
    }
  });}));

app.use(error);

app.listen(
  PORT
);

export default app;