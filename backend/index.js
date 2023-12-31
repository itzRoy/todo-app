require('./dbConnect');
const express = require('express');
const authMiddleware = require('./src/middlware/authentication');
const config = require('./config.js');
const cors = require('cors');

const userRoutes = require('./src/user/routes');
const todoRoutes = require('./src/todo/routes');

const PORT = config.port || 5000;

const app = new express();


app.use(cors({
  origin: '*'
}));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRoutes);
app.use('/api/todo', authMiddleware, todoRoutes);
app.use('/api/health', (req, res) => {
  res.send('health checked');
});

app.listen(
  PORT, console.log(`app running on port ${  PORT}`)
);

module.exports = app;