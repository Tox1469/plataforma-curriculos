const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Frontend

// Inicializa banco e rotas
require('./models/init');
app.use('/auth', require('./routes/auth'));
app.use('/candidato', require('./routes/candidato'));
app.use('/empresa', require('./routes/empresa'));
app.use('/admin', require('./routes/admin'));

// Rota fallback para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
