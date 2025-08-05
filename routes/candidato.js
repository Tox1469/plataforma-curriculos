const express = require('express');
const router = express.Router();
const db = require('../database/db');
const autenticar = require('../middleware/autenticar');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Criar pasta uploads se não existir
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configuração do multer para upload
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  }
});

// Salvar currículo do candidato
router.post('/curriculo', autenticar, (req, res) => {
  if (req.usuario.tipo !== 'candidato') return res.status(403).json({ erro: 'Acesso negado' });

  const { nome, ultimo_cargo, data_demissao, nr10, nr33, nr35, outras } = req.body;

  db.run(`
    INSERT INTO candidatos (usuario_id, nome, ultimo_cargo, data_demissao, nr10, nr33, nr35, outras)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(usuario_id) DO UPDATE SET
      nome=excluded.nome,
      ultimo_cargo=excluded.ultimo_cargo,
      data_demissao=excluded.data_demissao,
      nr10=excluded.nr10,
      nr33=excluded.nr33,
      nr35=excluded.nr35,
      outras=excluded.outras
  `,
  [req.usuario.id, nome, ultimo_cargo, data_demissao, nr10, nr33, nr35, outras],
  err => {
    if (err) return res.status(500).json({ erro: 'Erro ao salvar currículo' });
    res.json({ msg: 'Currículo salvo com sucesso' });
  });
});

// Upload de documento (PDF ou imagem)
router.post('/upload', autenticar, upload.single('documento'), (req, res) => {
  if (req.usuario.tipo !== 'candidato') return res.status(403).json({ erro: 'Acesso negado' });
  if (!req.file) return res.status(400).json({ erro: 'Arquivo inválido' });

  console.log(`Upload recebido de ${req.usuario.id}: ${req.file.originalname}`);
  res.json({ msg: 'Upload recebido com sucesso!' });
});

module.exports = router;
