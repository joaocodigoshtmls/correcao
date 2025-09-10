import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const envPath    = path.resolve(__dirname, './.env');

const r = dotenv.config({ path: envPath });
console.log('Carregado de:', envPath, 'erro?', !!r.error);
console.log('DB_PASSWORD length:', (process.env.DB_PASSWORD || '').length);
