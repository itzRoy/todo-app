
import mongoose from 'mongoose';
import config from './config.js';

export default () => mongoose.connect(config.db || '', {dbName: 'todoDB'}).then(() => console.log('connected to mongoDB')).catch(e => e);
