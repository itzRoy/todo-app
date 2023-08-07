
import mongoose from 'mongoose';
import config from './config.js';

export default () => mongoose.connect(config.db || '', {dbName: 'todoDB'});
