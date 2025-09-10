import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306
};

async function migrateProfileColumn() {
  try {
    const connection = await mysql.createConnection(config);
    
    console.log('🔗 Conectado ao banco de dados');
    
    // Verifica se a coluna já existe
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'profile_picture'
    `, [process.env.DB_NAME]);
    
    if (columns.length > 0) {
      console.log('✅ Coluna profile_picture já existe');
    } else {
      // Adiciona a coluna
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN profile_picture VARCHAR(500) NULL AFTER password
      `);
      console.log('✅ Coluna profile_picture adicionada com sucesso');
    }
    
    await connection.end();
    console.log('🔚 Migração concluída');
    
  } catch (error) {
    console.error('❌ Erro na migração:', error);
  }
}

migrateProfileColumn();
