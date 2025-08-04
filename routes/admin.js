const express = require('express');
const router = express.Router();
const db = require('../models/init');
const autenticar = require('../middleware/auth');

// Ver todos os usuários
router.get('/usuarios', autenticar, (req, res) => {
  if (req.usuario.tipo !== 'admin')
    return res.status(403).json({ erro: 'Acesso negado' });

  db.all(`SELECT id, nome, email, tipo, cpf_cnpj, creditos FROM usuarios`, [], (err, rows) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar usuários' });
    res.json(rows);
  });
});

// Adicionar créditos
router.post('/add-creditos', autenticar, (req, res) => {
  if (req.usuario.tipo !== 'admin')
    return res.status(403).json({ erro: 'Acesso negado' });

  const { usuarioId, quantidade } = req.body;
  db.run(
    `UPDATE usuarios SET creditos = creditos + ? WHERE id = ?`,
    [quantidade, usuarioId],
    function (err) {
      if (err) return res.status(500).json({ erro: 'Erro ao adicionar créditos' });
      res.json({ msg: 'Créditos adicionados' });
    }
  );
});

module.exports = router;
