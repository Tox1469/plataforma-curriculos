// routes/curriculo.js
const express = require('express');
const router = express.Router();
const db = require('../database/db');
const autenticar = require('../middleware/autenticar');

// Salvar currículo no banco
router.post('/', autenticar, (req, res) => {
  const { nome, ultimo_cargo, data_demissao, nr10, nr33, nr35, outras } = req.body;
  const candidato_id = req.usuario.id; // ID vem do token JWT decodificado

  const query = `
    INSERT INTO curriculos (candidato_id, nome, ultimo_cargo, data_demissao, nr10, nr33, nr35, outras)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [candidato_id, nome, ultimo_cargo, data_demissao, nr10, nr33, nr35, outras], function (err) {
    if (err) {
      console.error('Erro ao salvar currículo:', err);
      return res.status(500).json({ erro: 'Erro ao salvar currículo' });
    }
    return res.status(200).json({ mensagem: 'Currículo salvo com sucesso' });
  });
});

module.exports = router;
