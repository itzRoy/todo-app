import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from 'dotenv';
import { GetPublicKeyOrSecret, Secret } from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({path: path.resolve(__dirname, '../.env')});

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