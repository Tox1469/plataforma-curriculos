const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/db.sqlite');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT UNIQUE,
    senha TEXT,
    tipo TEXT, -- admin, empresa, candidato
    cpf_cnpj TEXT,
    creditos INTEGER DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS candidatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    nome TEXT,
    ultimo_cargo TEXT,
    data_demissao TEXT,
    nr10 BOOLEAN,
    nr33 BOOLEAN,
    nr35 BOOLEAN,
    outras TEXT,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
  )`);
});

module.exports = db;
