// src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();

/* ===== CORS (habilita front em Vite) ===== */
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.options('*', cors());

/* ===== Body parser ===== */
app.use(express.json({ limit: '10mb' }));

/* ===== Configuração de uploads ===== */
const uploadsDir = path.join(process.cwd(), 'uploads', 'profile-pics');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Pasta de uploads criada:', uploadsDir);
}

// 🔧 ALTERADO: Servir /uploads SEM CACHE para evitar avatar “fantasma”
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // usa o ID do token (req.user.sub)
    cb(null, `profile-${req.user?.sub || 'anon'}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'));
    }
  }
});

/* ===== Porta ===== */
const PORT = process.env.PORT || 3001;

/* ===== Fallback de JWT_SECRET em dev ===== */
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET não definido no .env — usando valor TEMPORÁRIO (apenas dev).');
  process.env.JWT_SECRET = 'dev-temp-secret-change-me';
}

/* ===== Middleware de autenticação JWT ===== */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token de acesso requerido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Erro no token:', err);
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

/* ===== Rotas de teste ===== */
app.get('/', (req, res) => {
  res.send('API funcionando!');
});

app.get('/test', (req, res) => {
  res.json({
    message: 'Server funcionando!',
    timestamp: new Date(),
    port: PORT
  });
});

/* Saúde da API (para checar no navegador) */
app.get('/health', (req, res) => {
  res.json({ ok: true, ts: new Date(), port: PORT });
});

/* ===== Signup ===== */
app.post('/signup', async (req, res) => {
  const { fullName, email, password, phone } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      `INSERT INTO users (full_name, email, password_hash, phone)
       VALUES (?, ?, ?, ?)`,
      [fullName, email, hash, phone]
    );
    res.status(201).json({ userId: result.insertId });
  } catch (err) {
    console.error('Erro no cadastro:', err);
    res.status(400).json({ error: 'Falha no cadastro: ' + err.message });
  }
});

/* ===== Login ===== */
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.execute(
      `SELECT id, password_hash FROM users WHERE email = ?`,
      [email]
    );
    if (rows.length === 0) return res.status(401).json({ error: 'Usuário não encontrado' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Senha incorreta' });

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });

    console.log('Login realizado para usuário ID:', user.id);
    res.json({ token });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro no login: ' + err.message });
  }
});

/* ===== Sync Firebase → MariaDB ===== */
app.post('/api/sync-firebase-user', async (req, res) => {
  const { firebaseEmail, firebaseDisplayName, firebaseUid, firebasePhotoURL } = req.body;

  try {
    console.log('🔄 Sincronizando usuário do Firebase:', firebaseEmail);

    const [existingUsers] = await pool.execute(
      `SELECT id, full_name, email, profile_picture FROM users WHERE email = ?`,
      [firebaseEmail]
    );

    let userId;

    if (existingUsers.length > 0) {
      userId = existingUsers[0].id;
      console.log('✅ Usuário já existe no MariaDB, ID:', userId);

      let needsUpdate = false;
      let updateFields = [];
      let updateValues = [];

      if (firebaseDisplayName && existingUsers[0].full_name !== firebaseDisplayName) {
        updateFields.push('full_name = ?');
        updateValues.push(firebaseDisplayName);
        needsUpdate = true;
      }

      // Atualiza foto apenas se não há foto personalizada (não começar com /uploads)
      if (firebasePhotoURL && (!existingUsers[0].profile_picture || !existingUsers[0].profile_picture.startsWith('/uploads'))) {
        updateFields.push('profile_picture = ?');
        updateValues.push(firebasePhotoURL);
        needsUpdate = true;
      }

      if (needsUpdate) {
        updateValues.push(userId);
        await pool.execute(
          `UPDATE users SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = ?`,
          updateValues
        );
        console.log('📝 Dados atualizados no MariaDB');
      }
    } else {
      console.log('➕ Criando novo usuário no MariaDB...');
      const [result] = await pool.execute(
        `INSERT INTO users (full_name, email, password_hash, firebase_uid, profile_picture, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          firebaseDisplayName || 'Usuário Firebase',
          firebaseEmail,
          'firebase_auth',
          firebaseUid,
          firebasePhotoURL || null
        ]
      );
      userId = result.insertId;
      console.log('✅ Novo usuário criado no MariaDB, ID:', userId);
    }

    const token = jwt.sign(
      { sub: userId, email: firebaseEmail, firebase: true },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    console.log('🎫 Token JWT gerado para usuário ID:', userId);

    res.json({
      success: true,
      token,
      userId,
      message: 'Usuário sincronizado com sucesso'
    });

  } catch (err) {
    console.error('❌ Erro ao sincronizar usuário:', err);
    res.status(500).json({ error: 'Erro ao sincronizar usuário: ' + err.message });
  }
});

/* ===== Perfil do usuário ===== */
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    console.log('Buscando perfil para usuário ID:', req.user.sub);

    const [rows] = await pool.execute(
      `SELECT id, full_name, email, phone, cpf, profile_picture, created_at, updated_at 
       FROM users WHERE id = ?`,
      [req.user.sub]
    );

    if (rows.length === 0) {
      console.log('Usuário não encontrado no banco:', req.user.sub);
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const user = rows[0];
    console.log('Perfil encontrado:', user);
    res.json(user);
  } catch (err) {
    console.error('Erro ao buscar perfil:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/* ===== Atualizar perfil ===== */
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  const { full_name, phone, cpf } = req.body;

  try {
    console.log('Atualizando perfil para usuário ID:', req.user.sub);
    console.log('Novos dados:', { full_name, phone, cpf });

    if (!full_name || full_name.trim().length < 2) {
      return res.status(400).json({ error: 'Nome deve ter pelo menos 2 caracteres' });
    }

    const [result] = await pool.execute(
      `UPDATE users 
       SET full_name = ?, phone = ?, cpf = ?, updated_at = NOW()
       WHERE id = ?`,
      [full_name.trim(), phone || null, cpf || null, req.user.sub]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const [rows] = await pool.execute(
      `SELECT id, full_name, email, phone, cpf, profile_picture, updated_at 
       FROM users WHERE id = ?`,
      [req.user.sub]
    );

    console.log('Perfil atualizado com sucesso');
    res.json({
      message: 'Perfil atualizado com sucesso',
      user: rows[0]
    });
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/* ===== Alterar senha ===== */
app.put('/api/user/password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    console.log('Alterando senha para usuário ID:', req.user.sub);

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Nova senha deve ter pelo menos 6 caracteres' });
    }

    const [rows] = await pool.execute(
      `SELECT password_hash FROM users WHERE id = ?`,
      [req.user.sub]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });

    const match = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!match) return res.status(401).json({ error: 'Senha atual incorreta' });

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.execute(
      `UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?`,
      [newHash, req.user.sub]
    );

    console.log('Senha alterada com sucesso');
    res.json({ message: 'Senha alterada com sucesso' });
  } catch (err) {
    console.error('Erro ao alterar senha:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/* ===== Excluir conta ===== */
app.delete('/api/user/account', authenticateToken, async (req, res) => {
  const { password } = req.body;

  try {
    console.log('Excluindo conta para usuário ID:', req.user.sub);

    if (!password) return res.status(400).json({ error: 'Senha é obrigatória para excluir a conta' });

    const [rows] = await pool.execute(
      `SELECT password_hash FROM users WHERE id = ?`,
      [req.user.sub]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });

    const match = await bcrypt.compare(password, rows[0].password_hash);
    if (!match) return res.status(401).json({ error: 'Senha incorreta' });

    await pool.execute(`DELETE FROM users WHERE id = ?`, [req.user.sub]);

    console.log('Conta excluída com sucesso');
    res.json({ message: 'Conta excluída com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir conta:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/* ===== DEBUG: Rota temporária para listar usuários ===== */
app.get('/debug/users', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, email, full_name, created_at FROM users LIMIT 10');
    res.json({ users: rows, total: rows.length });
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    res.status(500).json({ error: err.message });
  }
});

/* ===== Rota para migração da tabela (adicionar coluna profile_picture) ===== */
// Endpoint simples para migração (sem autenticação para facilitar)
app.get('/api/migrate-database', async (req, res) => {
  try {
    console.log('🔧 Iniciando migração da coluna profile_picture...');
    
    // Verifica se a coluna já existe
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'profile_picture'
    `, [process.env.DB_NAME]);
    
    if (columns.length > 0) {
      console.log('✅ Coluna profile_picture já existe');
      return res.json({ 
        success: true, 
        message: 'Coluna profile_picture já existe na tabela users',
        alreadyExists: true
      });
    }
    
    // Adiciona a coluna
    await pool.execute(`
      ALTER TABLE users 
      ADD COLUMN profile_picture VARCHAR(500) NULL AFTER password
    `);
    
    console.log('✅ Coluna profile_picture adicionada com sucesso');
    
    res.json({ 
      success: true, 
      message: 'Coluna profile_picture adicionada com sucesso!',
      alreadyExists: false
    });
    
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.post('/admin/migrate-profile-pictures', async (req, res) => {
  try {
    // Verifica se a coluna já existe
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'profile_picture'
      AND TABLE_SCHEMA = DATABASE()
    `);
    
    if (columns.length === 0) {
      // Adiciona a coluna se não existir
      await pool.execute(`
        ALTER TABLE users 
        ADD COLUMN profile_picture VARCHAR(255) NULL 
        AFTER firebase_uid
      `);
      console.log('✅ Coluna profile_picture adicionada com sucesso');
      res.json({ success: true, message: 'Coluna profile_picture adicionada' });
    } else {
      res.json({ success: true, message: 'Coluna profile_picture já existe' });
    }
  } catch (err) {
    console.error('Erro na migração:', err);
    res.status(500).json({ error: err.message });
  }
});

/* ===== Upload de foto de perfil ===== */
// 🔧 ALTERADO: resposta com cache-bust e deleção de arquivo anterior robusta
app.post('/api/user/profile-picture', authenticateToken, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    const userId = req.user.sub;
    const relPath = `/uploads/profile-pics/${req.file.filename}`;

    // Buscar foto antiga para deletar
    const [oldPictureRows] = await pool.execute(
      'SELECT profile_picture FROM users WHERE id = ?',
      [userId]
    );
    const oldPic = oldPictureRows?.[0]?.profile_picture || null;

    // Atualizar no banco
    await pool.execute(
      'UPDATE users SET profile_picture = ?, updated_at = NOW() WHERE id = ?',
      [relPath, userId]
    );

    // Deletar foto antiga se existir e não for externa
    if (oldPic && !oldPic.includes('googleusercontent.com')) {
      const rel = oldPic.startsWith('/') ? oldPic.slice(1) : oldPic; // 🔧 NOVO: remove / inicial
      const abs = path.join(process.cwd(), rel);
      // segurança: garante que está dentro da pasta de uploads de profile-pics
      if (abs.startsWith(uploadsDir) && fs.existsSync(abs)) {
        try { fs.unlinkSync(abs); } catch {}
      }
    }

    // 🔧 NOVO: retorna URL com versão para quebrar cache
    res.json({
      success: true,
      profilePictureUrl: `${relPath}?v=${Date.now()}`,
      message: 'Foto de perfil atualizada com sucesso'
    });

  } catch (err) {
    console.error('Erro no upload da foto:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// 🔧 NOVO: DELETE da foto de perfil (zera DB e apaga arquivo local)
app.delete('/api/user/profile-picture', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.sub;

    const [rows] = await pool.execute(
      'SELECT profile_picture FROM users WHERE id = ?',
      [userId]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });

    const current = rows[0]?.profile_picture || null;

    // Zera no banco
    await pool.execute(
      'UPDATE users SET profile_picture = NULL, updated_at = NOW() WHERE id = ?',
      [userId]
    );

    // Apaga arquivo físico se local
    if (current && !current.includes('googleusercontent.com')) {
      const rel = current.startsWith('/') ? current.slice(1) : current;
      const abs = path.join(process.cwd(), rel);
      if (abs.startsWith(uploadsDir) && fs.existsSync(abs)) {
        try { fs.unlinkSync(abs); } catch {}
      }
    }

    res.json({ success: true, profilePictureUrl: null, message: 'Foto de perfil removida' });
  } catch (err) {
    console.error('Erro ao remover foto:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/* ===== Middlewares de erro e 404 ===== */
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.use((req, res) => {
  console.log('Rota não encontrada:', req.method, req.originalUrl);
  res.status(404).json({ error: 'Rota não encontrada' });
});

/* ===== Sobe o servidor + ping no DB ===== */
app.listen(PORT, async () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
  console.log('📅 Iniciado em:', new Date().toLocaleString('pt-BR'));

  try {
    console.log("🔍 Tentando conectar ao banco com:");
    console.log({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    });

    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT 1 as ok');
    conn.release();
    if (rows?.[0]?.ok === 1) {
      console.log('✅ Conectado ao banco de dados com sucesso');
    } else {
      console.warn('⚠️  Banco respondeu, mas sem OK esperado');
    }
  } catch (err) {
    console.error('❌ Falha ao conectar no banco!');
    console.error('Código:', err.code);
    console.error('Mensagem:', err.message);
    console.error('SQL State:', err.sqlState);
    console.error('Config usada:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    });
  }
});

/* ===== Tratamento global de erros não capturados ===== */
process.on('uncaughtException', (err) => {
  console.error('Erro não capturado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Promise rejeitada não tratada:', err);
  process.exit(1);
});
