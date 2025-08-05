// routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const autenticar = require('../middleware/autenticar');

// Middleware de autenticação para todas as rotas
router.use(autenticar);

// Adicionar créditos manualmente
router.post('/creditos', async (req, res) => {
  const { email, qtd } = req.body;
  try {
    const empresa = await db.get('SELECT * FROM empresas WHERE email = ?', [email]);
    if (!empresa) return res.status(404).json({ erro: 'Empresa não encontrada' });

    const novoTotal = empresa.creditos + Number(qtd);
    await db.run('UPDATE empresas SET creditos = ? WHERE id = ?', [novoTotal, empresa.id]);
    res.json({ msg: `Créditos atualizados: ${novoTotal}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao adicionar créditos' });
  }
});

// Listar todos os usuários
router.get('/usuarios', async (req, res) => {
  try {
    const candidatos = await db.all('SELECT id, nome, email, "candidato" AS tipo FROM candidatos');
    const empresas = await db.all('SELECT id, nome, email, "empresa" AS tipo FROM empresas');
    res.json([...empresas, ...candidatos]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar usuários' });
  }
});

// Excluir usuário por ID
router.delete('/usuario/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db.get('SELECT id FROM candidatos WHERE id = ?', [id]) ||
                 await db.get('SELECT id FROM empresas WHERE id = ?', [id]);
    if (!user) return res.status(404).json({ erro: 'Usuário não encontrado' });

    await db.run('DELETE FROM candidatos WHERE id = ?', [id]);
    await db.run('DELETE FROM empresas WHERE id = ?', [id]);

    res.json({ msg: 'Usuário excluído com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao excluir usuário' });
  }
});

module.exports = router;
