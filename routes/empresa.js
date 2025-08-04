const express = require('express');
const router = express.Router();
const db = require('../models/init');
const autenticar = require('../middleware/auth');

// Listar candidatos (somente visual geral)
router.get('/listar', autenticar, (req, res) => {
  if (req.usuario.tipo !== 'empresa')
    return res.status(403).json({ erro: 'Acesso negado' });

  db.all(
    `SELECT id, nome, ultimo_cargo, data_demissao FROM candidatos`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar' });
      res.json(rows);
    }
  );
});

// Ver detalhes de candidato (consome crédito)
router.get('/detalhes/:id', autenticar, (req, res) => {
  if (req.usuario.tipo !== 'empresa')
    return res.status(403).json({ erro: 'Acesso negado' });

  const candidatoId = req.params.id;

  db.get(`SELECT creditos FROM usuarios WHERE id = ?`, [req.usuario.id], (err, empresa) => {
    if (empresa.creditos <= 0)
      return res.status(403).json({ erro: 'Créditos insuficientes' });

    db.get(`SELECT * FROM candidatos WHERE id = ?`, [candidatoId], (err, cand) => {
      if (!cand) return res.status(404).json({ erro: 'Candidato não encontrado' });

      db.run(`UPDATE usuarios SET creditos = creditos - 1 WHERE id = ?`, [req.usuario.id]);
      res.json(cand);
    });
  });
});

module.exports = router;
