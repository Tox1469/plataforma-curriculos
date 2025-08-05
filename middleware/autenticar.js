const jwt = require('jsonwebtoken');
const chaveSecreta = process.env.JWT_SECRET || 'chave_super_secreta';

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não informado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, chaveSecreta);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido.' });
  }
}

module.exports = autenticar;
