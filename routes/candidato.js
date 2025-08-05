const express = require('express');
const router = express.Router();
const db = require('../models/init');
const autenticar = require('../middleware/auth');

// Criar ou atualizar currículo
router.post('/curriculo', autenticar, (req, res) => {
  if (req.usuario.tipo !== 'candidato')
    return res.status(403).json({ erro: 'Acesso negado' });

  const { nome, ultimo_cargo, data_demissao, nr10, nr33, nr35, outras } = req.body;

  db.get(`SELECT * FROM candidatos WHERE usuario_id = ?`, [req.usuario.id], (err, row) => {
    if (row) {
      db.run(
        `UPDATE candidatos SET nome = ?, ultimo_cargo = ?, data_demissao = ?, nr10 = ?, nr33 = ?, nr35 = ?, outras = ? WHERE usuario_id = ?`,
        [nome, ultimo_cargo, data_demissao, nr10, nr33, nr35, outras, req.usuario.id],
        function (err) {
          if (err) return res.status(500).json({ erro: 'Erro ao atualizar currículo' });
          res.json({ msg: 'Currículo atualizado' });
        }
      );
    } else {
      db.run(
        `INSERT INTO candidatos (usuario_id, nome, ultimo_cargo, data_demissao, nr10, nr33, nr35, outras) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.usuario.id, nome, ultimo_cargo, data_demissao, nr10, nr33, nr35, outras],
        function (err) {
          if (err) return res.status(500).json({ erro: 'Erro ao criar currículo' });
          res.json({ msg: 'Currículo criado' });
        }
      );
    }
  });
});

// Ver currículo próprio
router.get('/meu', autenticar, (req, res) => {
  if (req.usuario.tipo !== 'candidato')
    return res.status(403).json({ erro: 'Acesso negado' });

  db.get(`SELECT * FROM candidatos WHERE usuario_id = ?`, [req.usuario.id], (err, row) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar' });
    res.json(row || {});
  });
});

module.exports = router;
