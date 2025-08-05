const sqlite3 = require('sqlite3').verbose();

// Conecta no arquivo db.sqlite que você já tem
const db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite com sucesso!');
  }
});

module.exports = db;
