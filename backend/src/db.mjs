// backend/src/db.mjs
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Resolve o caminho EXATO do .env: .../backend/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const envPath    = path.resolve(__dirname, '../.env'); // um nível acima de src/

const envResult = dotenv.config({ path: envPath });
if (envResult.error) {
  console.error('❌ Não consegui carregar .env em:', envPath, envResult.error.message);
} else {
  console.log('✅ .env carregado de:', envPath);
}

import mysql from 'mysql2/promise';

function mask(s) { return s ? `(${String(s).length} chars)` : '(vazio)'; }

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
  console.error('❌ Variáveis de DB faltando no .env:', {
    DB_HOST: process.env.DB_HOST || '(vazio)',
    DB_PORT: process.env.DB_PORT || '(vazio)',
    DB_USER: process.env.DB_USER || '(vazio)',
    DB_NAME: process.env.DB_NAME || '(vazio)',
  });
}
if (!process.env.DB_PASSWORD) {
  console.error('❌ DB_PASSWORD ausente no .env (sem senha)');
}

const cfg = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'facerec',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_SIZE || 10),
  queueLimit: 0,
  timezone: process.env.DB_TZ || 'Z',
  charset: process.env.DB_CHARSET || 'utf8mb4_general_ci',
};

console.log('💾 MySQL config efetiva:', {
  host: cfg.host,
  port: cfg.port,
  user: cfg.user,
  database: cfg.database,
  password: mask(cfg.password),
});

export const pool = mysql.createPool(cfg);
