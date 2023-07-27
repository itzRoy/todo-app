
const mongoose = require('mongoose');
const config = require('./config');

module.exports = mongoose.connect(config.db, {dbName: 'todoDB'})
  .then(() => console.log('connected to mongodb'))
  .catch((err) => console.log(err));
