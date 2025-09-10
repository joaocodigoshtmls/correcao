import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = decoded; // precisa ter .sub = id do usuário
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}
