const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Token ausente' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ erro: 'Token inválido' });
    req.usuario = decoded;
    next();
  });
}

module.exports = autenticar;
