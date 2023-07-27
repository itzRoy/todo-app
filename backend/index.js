require('./dbConnect');
const express = require('express');
const config = require('./config.js');

const userRoutes = require('./src/user/routes');
const PORT = config.port || 5000;

const app = new express();

app.use(express.urlencoded({ extended: true }));

app.use('/user', userRoutes);


app.listen(
  PORT, console.log(`app running on port ${  PORT}`)
);