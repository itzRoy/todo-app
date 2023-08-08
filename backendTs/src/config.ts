import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { config } from 'dotenv';
import { Secret } from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({path: resolve(__dirname, '../.env.local')});

export type Tconfig = {
  tokenSecret: Secret
  port?: string | number
  db?: string
}
const configObj: Tconfig = {
  port : process.env.PORT,
  db: process.env.DB,
  tokenSecret: process.env.TOKEN_SECRET as string
} satisfies Tconfig;

export default configObj;