const express = require('express');
const router = express.Router();
const db = require('../models/init');
const autenticar = require('../middleware/auth');

// ✅ Ver todos os usuários
router.get('/usuarios', autenticar, (req, res) => {
  if (req.usuario.tipo !== 'admin')
    return res.status(403).json({ erro: 'Acesso negado' });

  db.all(`SELECT id, nome, email, tipo, cpf_cnpj, creditos FROM usuarios`, [], (err, rows) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar usuários' });
    res.json(rows);
  });
});

// ✅ Adicionar créditos a um usuário
router.post('/add-creditos', autenticar, (req, res) => {
  if (req.usuario.tipo !== 'admin')
    return res.status(403).json({ erro: 'Acesso negado' });

  const { usuarioId, quantidade } = req.body;
  db.run(
    `UPDATE usuarios SET creditos = ? WHERE id = ?`,
    [quantidade, usuarioId],
    function (err) {
      if (err) return res.status(500).json({ erro: 'Erro ao adicionar créditos' });
      res.json({ msg: 'Créditos adicionados' });
    }
  );
});

// ✅ Ver currículo de qualquer candidato
router.get('/curriculo/:usuarioId', autenticar, (req, res) => {
  if (req.usuario.tipo !== 'admin')
    return res.status(403).json({ erro: 'Acesso negado' });

  const usuarioId = req.params.usuarioId;
  db.get(`SELECT * FROM candidatos WHERE usuario_id = ?`, [usuarioId], (err, row) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar currículo' });
    if (!row) return res.status(404).json({ erro: 'Currículo não encontrado' });
    res.json(row);
  });
});

// ✅ Dados para gráficos do dashboard
router.get('/dashboard/dados', autenticar, (req, res) => {
  if (req.usuario.tipo !== 'admin')
    return res.status(403).json({ erro: 'Acesso negado' });

  const stats = {};
  db.all(`SELECT tipo, COUNT(*) as total FROM usuarios GROUP BY tipo`, (err, tipos) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar usuários' });
    stats.usuarios = tipos;

    db.all(`SELECT nome, creditos FROM usuarios WHERE tipo = 'empresa'`, (err, empresas) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar empresas' });
      stats.empresas = empresas;

      db.all(`
        SELECT
          SUM(CASE WHEN nr10 THEN 1 ELSE 0 END) as nr10,
          SUM(CASE WHEN nr33 THEN 1 ELSE 0 END) as nr33,
          SUM(CASE WHEN nr35 THEN 1 ELSE 0 END) as nr35
        FROM candidatos
      `, (err, habilitacoes) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar habilitações' });
        stats.habilitacoes = habilitacoes[0];
        res.json(stats);
      });
    });
  });
});

module.exports = router;
