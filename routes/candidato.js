const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const autenticar = require('../middleware/autenticar');
const db = require('../database/db');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/curriculo', autenticar, (req, res) => {
  const { nome, cargo, dataDemissao, outrasHabilitacoes } = req.body;

  if (!nome || !cargo || !dataDemissao) {
    return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });
  }

  const query = 'INSERT INTO curriculos (nome, cargo, dataDemissao, outrasHabilitacoes) VALUES (?, ?, ?, ?)';
  const params = [nome, cargo, dataDemissao, outrasHabilitacoes];

  db.run(query, params, function (err) {
    if (err) return res.status(500).json({ erro: 'Erro ao salvar no banco.' });
    res.json({ id: this.lastID });
  });
});

router.post('/upload', autenticar, upload.single('documento'), (req, res) => {
  if (!req.file) return res.status(400).json({ erro: 'Arquivo não enviado.' });
  res.json({ mensagem: 'Upload realizado com sucesso!', arquivo: req.file.filename });
});

module.exports = router;