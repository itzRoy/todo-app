import {createClient} from 'redis';
import config from './config.js';

const {redisUrl, redisPassword, redisPort} = config;

const redisClient = createClient({
  password: redisPassword,
  socket: {
    host: redisUrl,
    port: redisPort,
    timeout: 30000
  }
});

export default redisClient;