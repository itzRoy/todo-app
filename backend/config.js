const path = require('path');

require('dotenv').config({path: path.resolve(__dirname, './.env')});
const config = {
  port : process.env.PORT,
  db: process.env.DB,
  tokenSecret: process.env.TOKEN_SECRET
};

module.exports = config;