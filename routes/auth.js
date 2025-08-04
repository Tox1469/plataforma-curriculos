const express = require('express');
const router = express.Router();
const db = require('../models/init');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Cadastro
router.post('/registro', (req, res) => {
  const { nome, email, senha, tipo, cpf_cnpj } = req.body;
  const hash = bcrypt.hashSync(senha, 8);
  db.run(
    `INSERT INTO usuarios (nome, email, senha, tipo, cpf_cnpj) VALUES (?, ?, ?, ?, ?)`,
    [nome, email, hash, tipo, cpf_cnpj],
    function (err) {
      if (err) return res.status(400).json({ erro: 'Erro no cadastro' });
      res.json({ id: this.lastID });
    }
  );
});

// Login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;
  db.get(`SELECT * FROM usuarios WHERE email = ?`, [email], (err, usuario) => {
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

    const valido = bcrypt.compareSync(senha, usuario.senha);
    if (!valido) return res.status(401).json({ erro: 'Senha incorreta' });

    const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
    res.json({ token, tipo: usuario.tipo });
  });
});

module.exports = router;
