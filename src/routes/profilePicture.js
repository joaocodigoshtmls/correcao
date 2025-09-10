import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { pool } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Pasta para fotos
const uploadRoot = path.join(process.cwd(), 'uploads', 'profile-pics');
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadRoot),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const name = `u${req.user?.sub || 'anon'}_${Date.now()}${ext || '.png'}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // até 5MB
  fileFilter: (_, file, cb) => {
    const ok = /image\/(png|jpe?g|webp)/i.test(file.mimetype);
    cb(ok ? null : new Error('Tipo de imagem não suportado'), ok);
  }
});

// helper para montar caminho relativo
function relPath(fileName) {
  return path.join('uploads', 'profile-pics', fileName).replace(/\\/g, '/');
}

// Upload de nova foto
router.post('/api/user/profile-picture', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.user.sub;
    const [rows] = await pool.execute(`SELECT profile_picture FROM users WHERE id = ?`, [userId]);
    if (!rows.length) return res.status(404).json({ error: 'Usuário não encontrado' });

    const prev = rows[0]?.profile_picture || null;
    const rel = relPath(req.file.filename);

    await pool.execute(`UPDATE users SET profile_picture = ?, updated_at = NOW() WHERE id = ?`, [rel, userId]);

    // apaga foto anterior (se local)
    if (prev && !/googleusercontent\.com/i.test(prev)) {
      const absolute = path.join(process.cwd(), prev.startsWith('/') ? prev.slice(1) : prev);
      if (absolute.startsWith(uploadRoot) && fs.existsSync(absolute)) {
        try { fs.unlinkSync(absolute); } catch {}
      }
    }

    res.json({ success: true, profilePictureUrl: `/${rel}?v=${Date.now()}` });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Falha no upload' });
  }
});

// Remover foto
router.delete('/api/user/profile-picture', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.sub;
    const [rows] = await pool.execute(`SELECT profile_picture FROM users WHERE id = ?`, [userId]);
    if (!rows.length) return res.status(404).json({ error: 'Usuário não encontrado' });

    const current = rows[0]?.profile_picture || null;

    await pool.execute(`UPDATE users SET profile_picture = NULL, updated_at = NOW() WHERE id = ?`, [userId]);

    if (current && !/googleusercontent\.com/i.test(current)) {
      const absolute = path.join(process.cwd(), current.startsWith('/') ? current.slice(1) : current);
      if (absolute.startsWith(uploadRoot) && fs.existsSync(absolute)) {
        try { fs.unlinkSync(absolute); } catch {}
      }
    }

    res.json({ success: true, profilePictureUrl: null });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao remover foto' });
  }
});

export default router;
