const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

require('./models/init'); // cria tabelas se não existirem

app.use('/auth', require('./routes/auth'));
app.use('/candidato', require('./routes/candidato'));
app.use('/empresa', require('./routes/empresa'));
app.use('/admin', require('./routes/admin'));

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
