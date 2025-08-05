const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta public
app.use(express.static('public'));

// Rota principal redireciona para index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

require('./models/init'); // cria tabelas se não existirem

app.use('/auth', require('./routes/auth'));
app.use('/candidato', require('./routes/candidato'));
app.use('/empresa', require('./routes/empresa'));
app.use('/admin', require('./routes/admin'));

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
