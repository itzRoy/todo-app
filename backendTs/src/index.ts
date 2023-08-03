import dbConnet from './dbConnect.js';
import express, { Response } from 'express';
import authMiddleware from './middlware/authentication.js';
import config from './config.js';
import cors from 'cors';
import userRoutes from'./user/routes.js';
import todoRoutes from './todo/routes.js';
import cookieParser from 'cookie-parser'

dbConnet()

const PORT = config.port || 5000;

const app = express();


app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());

app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRoutes);
app.use('/api/todo', authMiddleware, todoRoutes);
app.use('/api/health', (req, res: Response) => {
  res.send('health checked');
});

app.listen(
  PORT
);

export default app;